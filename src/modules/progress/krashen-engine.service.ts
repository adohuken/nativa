import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CefrLevel, LanguageSkill, ExerciseType } from '@prisma/client';

export interface BottleneckAnalysis {
  bottleneckSkill: LanguageSkill;
  currentLevel: CefrLevel;
  targetLevel: CefrLevel;
  masteryScore: number;
  allSkills: Record<LanguageSkill, { level: CefrLevel; score: number }>;
}

@Injectable()
export class KrashenEngineService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly cefrOrder: Record<CefrLevel, number> = {
    [CefrLevel.A1]: 1,
    [CefrLevel.A2]: 2,
    [CefrLevel.B1]: 3,
    [CefrLevel.B2]: 4,
    [CefrLevel.C1]: 5,
    [CefrLevel.C2]: 6,
  };

  /**
   * Identifica el "Cuello de Botella" (Bottleneck) del usuario entre las 4 habilidades
   */
  async identifyBottleneck(userId: string, targetLanguageCode: string): Promise<BottleneckAnalysis> {
    const masteries = await this.prisma.userSkillMastery.findMany({
      where: {
        userId,
        languageCode: targetLanguageCode.toLowerCase(),
      },
    });

    if (!masteries || masteries.length === 0) {
      throw new NotFoundException('No se encontraron registros de habilidades para este usuario');
    }

    // Ordenar de menor a mayor competencia global: (Nivel CEFR * 100) + masteryScore
    const sorted = [...masteries].sort((a, b) => {
      const scoreA = (this.cefrOrder[a.currentLevel] * 100) + a.masteryScore;
      const scoreB = (this.cefrOrder[b.currentLevel] * 100) + b.masteryScore;
      return scoreA - scoreB;
    });

    const bottleneck = sorted[0];
    const targetLevel = this.calculateNextLevel(bottleneck.currentLevel, bottleneck.masteryScore);

    const allSkills = masteries.reduce((acc, curr) => {
      acc[curr.skill] = { level: curr.currentLevel, score: curr.masteryScore };
      return acc;
    }, {} as Record<LanguageSkill, { level: CefrLevel; score: number }>);

    return {
      bottleneckSkill: bottleneck.skill,
      currentLevel: bottleneck.currentLevel,
      targetLevel,
      masteryScore: bottleneck.masteryScore,
      allSkills,
    };
  }

  /**
   * Algoritmo i + 1: Selecciona la siguiente lección adaptada a desatascar la destreza rezagada
   */
  async getOptimalInputLesson(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil de usuario no encontrado');
    }

    const bottleneck = await this.identifyBottleneck(userId, profile.targetLanguageCode);

    // Buscar una lección no completada que ataque el cuello de botella
    const nextLesson = await this.prisma.lesson.findFirst({
      where: {
        targetSkill: bottleneck.bottleneckSkill,
        module: {
          languageCode: profile.targetLanguageCode,
          level: bottleneck.targetLevel,
        },
        progress: {
          none: {
            userId,
            status: 'COMPLETED',
          },
        },
      },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    // Si no hay lección pendiente específica, busca la siguiente lección general del nivel
    const candidateLesson = nextLesson || await this.prisma.lesson.findFirst({
      where: {
        module: {
          languageCode: profile.targetLanguageCode,
          level: bottleneck.currentLevel,
        },
      },
      include: {
        sections: { orderBy: { orderIndex: 'asc' } },
      },
    });

    return {
      pedagogicalContext: {
        hypothesis: 'i + 1 (Input Comprensible)',
        focusSkill: bottleneck.bottleneckSkill,
        currentProficiency: bottleneck.currentLevel,
        targetedLevel: bottleneck.targetLevel,
        affectiveFilterZenMode: profile.zenModeEnabled,
        allSkillsOverview: bottleneck.allSkills,
      },
      lesson: candidateLesson ? this.applyMonitorModelFilter(candidateLesson, false) : null,
    };
  }

  /**
   * Krashen Monitor Model: Oculta la gramática explícita durante la fase de inmersión inicial.
   * Solo se expone si isReviewPhase es verdadero.
   */
  private applyMonitorModelFilter(lesson: any, isReviewPhase: boolean) {
    return {
      ...lesson,
      sections: lesson.sections.map((section: any) => {
        if (!isReviewPhase && section.type === ExerciseType.GRAMMAR_IN_ACTION) {
          return {
            ...section,
            metadata: null, // Ocultar explicaciones metalingüísticas
          };
        }
        return section;
      }),
    };
  }

  private calculateNextLevel(current: CefrLevel, score: number): CefrLevel {
    // Si la destreza supera el 85%, el input óptimo i+1 es el siguiente peldaño CEFR
    if (score >= 85) {
      const levels: CefrLevel[] = [
        CefrLevel.A1,
        CefrLevel.A2,
        CefrLevel.B1,
        CefrLevel.B2,
        CefrLevel.C1,
        CefrLevel.C2,
      ];
      const currentIndex = levels.indexOf(current);
      return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current;
    }
    return current;
  }
}
