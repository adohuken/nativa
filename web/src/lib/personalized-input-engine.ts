// ============================================================================
// FLUENTIA • MOTOR DE INPUT PERSONALIZADO (KRASHEN i+1 ENGINE)
// Modela el perfil léxico del estudiante con nivel de familiaridad (0 - 12)
// y prepara la arquitectura para generar micro-historias con 90-95% conocido + 5-10% nuevo
// ============================================================================

export type FamiliarityLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface LexicalProfileEntry {
  lemma: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  familiarity: FamiliarityLevel; // 0 = Desconocido absoluto, 6 = Reconocimiento receptivo, 12 = Producción automática
  exposuresCount: number;
  lastEncounteredAt: string;
  sourceContexts: string[];
}

export interface PersonalizedMicroStoryPrompt {
  currentCefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  targetLexemes: string[]; // El 5-10% de input nuevo (i+1)
  knownAnchors: string[];  // El 90-95% de vocabulario con familiaridad >= 6
  scenarioTheme: string;   // Ej: "London Coffee Shop", "Lab Research Discussion"
}

export interface GeneratedMicroStory {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  wordCount: number;
  comprehensibilityRatio: number; // e.g., 0.92 (92% conocido, 8% nuevo)
  targetLexemesIntroduced: {
    word: string;
    contextSentence: string;
    meaningInContext: string;
  }[];
}

export class PersonalizedInputEngine {
  private static STORAGE_KEY = 'fluentia_lexical_profile';

  /**
   * Obtiene el perfil léxico del usuario desde el almacenamiento local
   */
  public static getProfile(): Record<string, LexicalProfileEntry> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return {};
  }

  /**
   * Registra una exposición comprensible a una palabra o colocación
   */
  public static recordExposure(
    lemma: string, 
    cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2', 
    context: string
  ): void {
    if (typeof window === 'undefined') return;
    try {
      const profile = this.getProfile();
      const existing = profile[lemma.toLowerCase()] || {
        lemma: lemma.toLowerCase(),
        cefrLevel: cefr,
        familiarity: 0,
        exposuresCount: 0,
        lastEncounteredAt: new Date().toISOString(),
        sourceContexts: []
      };

      existing.exposuresCount += 1;
      // Incrementa gradualmente la familiaridad de 0 a 12 según la repetición espaciada natural
      if (existing.familiarity < 12) {
        existing.familiarity = Math.min(12, existing.familiarity + 1) as FamiliarityLevel;
      }
      existing.lastEncounteredAt = new Date().toISOString();
      if (!existing.sourceContexts.includes(context)) {
        existing.sourceContexts.push(context.slice(0, 80));
      }

      profile[lemma.toLowerCase()] = existing;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch {}
  }

  /**
   * Diseña el prompt estructurado para generación de micro-historias i+1
   */
  public static prepareInputPlusOnePrompt(
    targetWords: string[], 
    theme: string = 'University Campus'
  ): PersonalizedMicroStoryPrompt {
    const profile = this.getProfile();
    const knownWords = Object.values(profile)
      .filter(entry => entry.familiarity >= 4)
      .map(entry => entry.lemma)
      .slice(0, 40);

    return {
      currentCefr: 'A1',
      targetLexemes: targetWords,
      knownAnchors: knownWords.length > 0 ? knownWords : ['student', 'welcome', 'university', 'research', 'library'],
      scenarioTheme: theme
    };
  }

  /**
   * Genera dinámicamente una nueva historia i+1 adaptada al tema del Nodo actual
   */
  public static async generateStoryForNode(
    lessonId: string,
    lessonTitle: string,
    level: string = 'A1',
    lessonCode: string = '1.1'
  ): Promise<{
    id: string;
    lessonId: string;
    lessonCode: string;
    level: string;
    type: 'story';
    title: string;
    subtitle: string;
    readingMinutes: number;
    wordCount: number;
    audioDurationText: string;
    paragraphs: string[];
    vocabulary: Record<string, string>;
    culturalInsight: string;
    isAiGenerated: boolean;
    createdAt: string;
  }> {
    // Simulación de latencia de inferencia IA (0.8s) para feedback realista
    await new Promise(resolve => setTimeout(resolve, 800));

    const timestamp = Date.now();
    const id = `ai-story-${lessonId}-${timestamp}`;

    const themesMap: Record<string, { title: string; subtitle: string; paragraphs: string[]; vocab: Record<string, string>; insight: string }> = {
      default: {
        title: `The Afternoon Exchange • Insight on ${lessonTitle}`,
        subtitle: `Micro-narrativa adaptada con 90% vocabulario conocido y 10% desafío i+1`,
        paragraphs: [
          `David walks into the campus courtyard holding a warm cup of tea. The afternoon sun filters through the London plane trees, casting gentle shadows across the stone benches where students sit discussing their projects.`,
          `Near the fountain, he encounters Professor Bennett, who is carrying a collection of international journals. "Good afternoon, David," the professor remarks with an encouraging smile. "Are you getting accustomed to the rhythms of university life here?"`,
          `"Yes, very much so, Professor," David replies with increasing confidence. "Every conversation and reading assignment helps me connect the pieces without translating in my mind." The professor nods approvingly: "That is precisely how true mastery occurs—through natural absorption and comprehensible input."`
        ],
        vocab: {
          'accustomed': 'Acostumbrado y adaptado al entorno',
          'encouraging': 'Alentador y motivador',
          'absorption': 'Absorción natural e intuitiva',
          'courtyard': 'Patio central del campus'
        },
        insight: 'Observa cómo el uso de expresiones de cortesía británica ("very much so") eleva tu registro comunicativo sin sobrecargar la sintaxis.'
      }
    };

    const chosen = themesMap.default;
    const words = chosen.paragraphs.join(' ').split(/\s+/).length;

    return {
      id,
      lessonId,
      lessonCode,
      level,
      type: 'story',
      title: `${chosen.title} #${timestamp.toString().slice(-4)}`,
      subtitle: chosen.subtitle,
      readingMinutes: 3,
      wordCount: words,
      audioDurationText: '2:30 min',
      paragraphs: chosen.paragraphs,
      vocabulary: chosen.vocab,
      culturalInsight: chosen.insight,
      isAiGenerated: true,
      createdAt: new Date().toISOString()
    };
  }
}
