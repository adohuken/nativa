// ============================================================================
// FLUENTIA • MOTOR DE PERSISTENCIA Y SINCRONIZACIÓN DE PROGRESO
// Garantiza que tras recargar (F5), cerrar el navegador o reiniciar sesión,
// el alumno conserve todas sus lecciones desbloqueadas, XP, racha y rúbricas.
// ============================================================================

export interface SkillMasteryScores {
  listening: number;  // 0 - 100
  speaking: number;   // 0 - 100
  reading: number;    // 0 - 100
  writing: number;    // 0 - 100
}

export interface ProjectSubmission {
  unit: number;
  level: string;
  title: string;
  submittedAt: string;
  content: string;
  overallScore: number;
  wordCount: number;
  rubricScores: {
    taskAchievement: number;     // 0 - 25
    coherenceCohesion: number;   // 0 - 25
    lexicalResource: number;     // 0 - 25
    grammaticalAccuracy: number; // 0 - 25
  };
  feedback: string;
}

export interface StarredPhrase {
  id: string;
  en: string;
  es: string;
  phonetic?: string;
  context?: string;
  speaker?: string;
  lessonId: string;
  level: string;
  addedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string; // base64 o URL de imagen subida
  avatarEmoji?: string; // emoji de avatar de respaldo
  country: string;
  city?: string;
  university?: string;
  targetLevel: string;
  dailyGoalMinutes: number;
  learningFocus: string;
  bio: string;
  createdAt: string;
  accentPreference: 'uk' | 'us';
  preferredStudyTime: 'morning' | 'afternoon' | 'night';
  interfaceLanguage: 'es' | 'en';
}

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_david_01',
  name: 'David Abarca',
  username: 'davida',
  email: 'david@nativa.edu',
  avatarEmoji: '👨‍🎓',
  country: 'Nicaragua',
  city: 'Managua',
  university: 'Universidad Nacional de Ingeniería (UNI)',
  targetLevel: 'B2 • Intercambio Académico',
  dailyGoalMinutes: 20,
  learningFocus: 'Inglés Universitario & Supervivencia en el Campus',
  bio: 'Estudiante de ciencias de la computación. Enfocado en adquirir fluidez natural para conferencias y papers académicos sin traducción mental.',
  createdAt: '2026-09-15',
  accentPreference: 'uk',
  preferredStudyTime: 'afternoon',
  interfaceLanguage: 'es'
};

const KEYS = {
  SESSION: 'fluentia_user_session',
  USER_PROFILE: 'fluentia_user_profile',
  USER_CREDENTIALS: 'fluentia_user_credentials',
  ACTIVE_LANGUAGE: 'fluentia_active_language',
  COMPLETED_NODES: 'fluentia_completed_nodes',
  USER_XP: 'fluentia_user_xp',
  STREAK_DAYS: 'fluentia_streak_days',
  SKILLS: 'fluentia_skill_scores',
  PROJECTS: 'fluentia_project_submissions',
  SOUND_ENABLED: 'fluentia_sound_enabled',
  ZEN_MODE: 'fluentia_zen_mode',
  STARRED_PHRASES: 'fluentia_starred_phrases',
  IMMERSION_MINUTES: 'fluentia_immersion_minutes',
  COMPLETED_SUBNODES: 'fluentia_completed_subnodes',
  CUSTOM_COURSE_CONTENT: 'fluentia_custom_course_content',
  CUSTOM_LANGUAGES_REGISTRY: 'fluentia_custom_languages_registry',
};

function getLangKey(baseKey: string, lang: string = 'english'): string {
  if (!lang || lang === 'english') return baseKey;
  return `${baseKey}_${lang}`;
}

export const AppStorage = {
  getActiveLanguage(): string {
    if (typeof window === 'undefined') return 'english';
    try {
      return localStorage.getItem(KEYS.ACTIVE_LANGUAGE) || 'english';
    } catch {}
    return 'english';
  },

  setActiveLanguage(lang: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.ACTIVE_LANGUAGE, lang || 'english');
    } catch {}
  },

  getCompletedNodes(lang: string = 'english'): string[] {
    const defaultNode = lang === 'english' ? 'a1-lesson-1' : `${lang}-a1-lesson-1`;
    if (typeof window === 'undefined') return [defaultNode];
    try {
      const data = localStorage.getItem(getLangKey(KEYS.COMPLETED_NODES, lang));
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [defaultNode];
  },

  saveCompletedNodes(nodes: string[], lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.COMPLETED_NODES, lang), JSON.stringify(nodes));
    } catch {}
  },

  getXp(lang: string = 'english'): number {
    if (typeof window === 'undefined') return 140;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.USER_XP, lang));
      if (data !== null) return parseInt(data, 10) || 140;
    } catch {}
    return 140;
  },

  saveXp(xp: number, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.USER_XP, lang), xp.toString());
    } catch {}
  },

  getStreak(lang: string = 'english'): number {
    if (typeof window === 'undefined') return 2;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.STREAK_DAYS, lang));
      if (data !== null) return parseInt(data, 10) || 2;
    } catch {}
    return 2;
  },

  saveStreak(days: number, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.STREAK_DAYS, lang), days.toString());
    } catch {}
  },

  getSkillScores(lang: string = 'english'): SkillMasteryScores {
    if (typeof window === 'undefined') {
      return { listening: 65, speaking: 45, reading: 70, writing: 50 };
    }
    try {
      const data = localStorage.getItem(getLangKey(KEYS.SKILLS, lang));
      if (data) return JSON.parse(data);
    } catch {}
    return { listening: 65, speaking: 45, reading: 70, writing: 50 };
  },

  saveSkillScores(scores: SkillMasteryScores, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.SKILLS, lang), JSON.stringify(scores));
    } catch {}
  },

  getProjectSubmissions(): Record<number, ProjectSubmission> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(KEYS.PROJECTS);
      if (data) return JSON.parse(data);
    } catch {}
    return {};
  },

  saveProjectSubmission(submission: ProjectSubmission): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getProjectSubmissions();
      current[submission.unit] = submission;
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(current));
    } catch {}
  },

  getSoundEnabled(): boolean {
    if (typeof window === 'undefined') return true;
    try {
      const data = localStorage.getItem(KEYS.SOUND_ENABLED);
      if (data !== null) return data === 'true';
    } catch {}
    return true;
  },

  saveSoundEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.SOUND_ENABLED, enabled.toString());
    } catch {}
  },

  getZenMode(): boolean {
    if (typeof window === 'undefined') return true;
    try {
      const data = localStorage.getItem(KEYS.ZEN_MODE);
      if (data !== null) return data === 'true';
    } catch {}
    return true;
  },

  saveZenMode(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.ZEN_MODE, enabled.toString());
    } catch {}
  },

  // Frases Estrella del Alumno (⭐ Bookmarking hacia SRS)
  getStarredPhrases(): StarredPhrase[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.STARRED_PHRASES);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  toggleStarredPhrase(phrase: Omit<StarredPhrase, 'addedAt'>): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const current = this.getStarredPhrases();
      const existsIndex = current.findIndex(p => p.id === phrase.id || p.en === phrase.en);
      if (existsIndex >= 0) {
        current.splice(existsIndex, 1);
        localStorage.setItem(KEYS.STARRED_PHRASES, JSON.stringify(current));
        return false; // Ahora no está marcada
      } else {
        current.unshift({
          ...phrase,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem(KEYS.STARRED_PHRASES, JSON.stringify(current));
        return true; // Ahora sí está marcada
      }
    } catch {
      return false;
    }
  },

  isPhraseStarred(phraseIdOrText: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const current = this.getStarredPhrases();
      return current.some(p => p.id === phraseIdOrText || p.en === phraseIdOrText);
    } catch {
      return false;
    }
  },

  // Tiempo de Inmersión Comprensible Acumulado (Minutos)
  getImmersionMinutes(lang: string = 'english'): number {
    if (typeof window === 'undefined') return 15;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.IMMERSION_MINUTES, lang));
      if (data !== null) return parseInt(data, 10) || 15;
    } catch {}
    return 15;
  },

  addImmersionMinutes(mins: number, lang: string = 'english'): number {
    if (typeof window === 'undefined') return 15;
    try {
      const current = this.getImmersionMinutes(lang);
      const next = current + Math.max(1, mins);
      localStorage.setItem(getLangKey(KEYS.IMMERSION_MINUTES, lang), next.toString());
      return next;
    } catch {
      return 15;
    }
  },

  // Sub-Nodos de Inmersión (reading, listening, srs)
  getCompletedSubNodes(lang: string = 'english'): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(getLangKey(KEYS.COMPLETED_SUBNODES, lang));
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  },

  saveCompletedSubNodes(subNodes: string[], lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.COMPLETED_SUBNODES, lang), JSON.stringify(subNodes));
    } catch {}
  },

  completeSubNode(subNodeId: string, lang: string = 'english'): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const current = this.getCompletedSubNodes(lang);
      if (!current.includes(subNodeId)) {
        const next = [...current, subNodeId];
        this.saveCompletedSubNodes(next, lang);
        return next;
      }
      return current;
    } catch {
      return [];
    }
  },

  isSubNodeCompleted(subNodeId: string, lang: string = 'english'): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getCompletedSubNodes(lang);
    return current.includes(subNodeId);
  },

  areAllSubNodesCompleted(motherNodeId: string, lang: string = 'english'): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getCompletedSubNodes(lang);
    const required = [
      `${motherNodeId}-reading`,
      `${motherNodeId}-listening`,
      `${motherNodeId}-srs`
    ];
    return required.every(id => current.includes(id));
  },

  // Gestión de Idiomas Personalizados (cPanel Admin)
  getCustomLanguages(): any | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(KEYS.CUSTOM_LANGUAGES_REGISTRY);
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  },

  saveCustomLanguages(langs: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.CUSTOM_LANGUAGES_REGISTRY, JSON.stringify(langs));
    } catch {}
  },

  // Gestión de Contenido de Cursos Personalizado (cPanel Admin)
  getCustomCourseContent(lang: string = 'english'): any | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.CUSTOM_COURSE_CONTENT, lang));
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  },

  saveCustomCourseContent(content: any, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.CUSTOM_COURSE_CONTENT, lang), JSON.stringify(content));
    } catch {}
  },

  // Perfil de Usuario Completo
  getUserProfile(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...DEFAULT_USER_PROFILE, ...parsed };
      }
    } catch {}
    return DEFAULT_USER_PROFILE;
  },

  saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch {}
  },

  // Gestión de Contraseña
  verifyCurrentPassword(password: string): boolean {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem(KEYS.USER_CREDENTIALS);
      if (!saved) return true; // si no hay contraseña previa guardada, permitir
      return saved === password;
    } catch {
      return true;
    }
  },

  updatePassword(newPassword: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.USER_CREDENTIALS, newPassword);
    } catch {}
  },

  resetAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(KEYS.COMPLETED_NODES);
      localStorage.removeItem(KEYS.USER_XP);
      localStorage.removeItem(KEYS.STREAK_DAYS);
      localStorage.removeItem(KEYS.SKILLS);
      localStorage.removeItem(KEYS.PROJECTS);
    } catch {}
  }
};
