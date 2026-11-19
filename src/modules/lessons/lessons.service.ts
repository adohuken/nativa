import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KrashenEngineService } from '../progress/krashen-engine.service';
import { ProgressStatus, LanguageSkill } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly krashenEngine: KrashenEngineService,
  ) {}

  async getNextComprehensibleInput(userId: string) {
    return this.krashenEngine.getOptimalInputLesson(userId);
  }

  async getLessonWithUserProgress(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        sections: { orderBy: { orderIndex: 'asc' } },
        progress: {
          where: { userId },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lección no encontrada');
    }

    return {
      lesson,
      userProgress: lesson.progress[0] || null,
    };
  }

  async completeLesson(userId: string, lessonId: string, score: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lección no encontrada');
    }

    // 1. Actualizar o crear progreso de la lección para este usuario
    const progress = await this.prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        status: ProgressStatus.COMPLETED,
        score,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        status: ProgressStatus.COMPLETED,
        score,
        completedAt: new Date(),
      },
    });

    // 2. Incrementar puntaje de destreza en la habilidad correspondiente
    await this.prisma.userSkillMastery.updateMany({
      where: {
        userId,
        skill: lesson.targetSkill,
      },
      data: {
        masteryScore: {
          increment: Math.min(10, Math.max(1, score * 0.1)),
        },
      },
    });

    // 3. Incrementar Racha (Daily Streak)
    await this.prisma.profile.update({
      where: { userId },
      data: {
        dailyStreak: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });

    return {
      message: 'Progreso registrado exitosamente',
      progress,
    };
  }
}
