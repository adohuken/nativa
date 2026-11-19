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
  studentId: string;
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
      studentId: 'current-student',
      currentCefr: 'A1',
      targetLexemes: targetWords,
      knownAnchors: knownWords.length > 0 ? knownWords : ['student', 'welcome', 'university', 'research', 'library'],
      scenarioTheme: theme
    };
  }
}
