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
  tips?: string[];
  providerUsed?: string;
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

export type DailyMissionType = 'read_article' | 'complete_srs' | 'shadowing_record';

export interface DailyMission {
  id: DailyMissionType;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
}

export interface DailyMissionsState {
  date: string; // YYYY-MM-DD
  missions: DailyMission[];
  allCompletedBonusClaimed: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  referenceNumber: string;
  bankName: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes?: string;
}

export interface LicenseCode {
  code: string;
  maxRedemptions: number;
  currentRedemptions: number;
  active: boolean;
  createdAt: string;
  note?: string;
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
  accentPreference: 'uk' | 'us' | 'au';
  preferredStudyTime: 'morning' | 'afternoon' | 'night';
  interfaceLanguage: 'es' | 'en';
  isAdmin?: boolean;
  hasSeenTour?: boolean;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  id: '',
  name: 'Estudiante',
  username: '',
  email: '',
  avatarEmoji: '👨‍🎓',
  avatarUrl: undefined,
  country: '',
  city: '',
  university: '',
  targetLevel: 'A1 • Principiante',
  dailyGoalMinutes: 20,
  learningFocus: 'Inglés General & Conversacional',
  bio: '',
  createdAt: new Date().toISOString().split('T')[0],
  accentPreference: 'us',
  preferredStudyTime: 'afternoon',
  interfaceLanguage: 'es',
  hasSeenTour: false
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
  DAILY_MISSIONS: 'fluentia_daily_missions',
  CUSTOM_LIBRARY_ITEMS: 'fluentia_custom_library_items',
  COMPLETED_LIBRARY_ITEMS: 'fluentia_completed_library_items',
  PAYWALL_ENABLED: 'fluentia_paywall_enabled',
  IS_PREMIUM: 'fluentia_is_premium',
  PAYMENT_REQUESTS: 'fluentia_payment_requests',
  LICENSE_CODES: 'fluentia_license_codes',
  HAS_SEEN_TOUR: 'nativa_has_seen_tour',
};

function getLangKey(baseKey: string, lang: string = 'english'): string {
  if (!lang || lang === 'english') return baseKey;
  return `${baseKey}_${lang}`;
}

let autoSyncDebounceTimer: any = null;
let isSyncingFromCloud: boolean = false;

export const AppStorage = {
  triggerAutoSync(): void {
    if (typeof window === 'undefined' || isSyncingFromCloud) return;
    if (autoSyncDebounceTimer) clearTimeout(autoSyncDebounceTimer);
    autoSyncDebounceTimer = setTimeout(() => {
      this.syncToSupabase().catch((err) => {
        console.warn('Auto-sync en segundo plano hacia Supabase:', err);
      });
    }, 500);
  },
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
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(getLangKey(KEYS.COMPLETED_NODES, lang));
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  },

  resetProgressForNewUser(lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.COMPLETED_NODES, lang), JSON.stringify([]));
      localStorage.setItem(getLangKey(KEYS.COMPLETED_SUBNODES, lang), JSON.stringify([]));
      localStorage.setItem(getLangKey(KEYS.USER_XP, lang), '0');
      localStorage.setItem(getLangKey(KEYS.STREAK_DAYS, lang), '0');
      localStorage.setItem(getLangKey(KEYS.IMMERSION_MINUTES, lang), '0');
      localStorage.setItem(getLangKey(KEYS.SKILLS, lang), JSON.stringify({ listening: 0, speaking: 0, reading: 0, writing: 0 }));
      localStorage.setItem(KEYS.HAS_SEEN_TOUR, 'false');
    } catch {}
  },

  hasSeenTour(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(KEYS.HAS_SEEN_TOUR) === 'true';
    } catch {}
    return false;
  },

  setHasSeenTour(value: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.HAS_SEEN_TOUR, value ? 'true' : 'false');
      const current = this.getUserProfile();
      this.saveUserProfile({ ...current, hasSeenTour: value });
    } catch {}
  },

  saveCompletedNodes(nodes: string[], lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.COMPLETED_NODES, lang), JSON.stringify(nodes));
      this.triggerAutoSync();
    } catch {}
  },

  completeNode(nodeId: string, lang: string = 'english'): string[] {
    const current = this.getCompletedNodes(lang);
    if (!current.includes(nodeId)) {
      const next = [...current, nodeId];
      this.saveCompletedNodes(next, lang);
      return next;
    }
    return current;
  },

  getXp(lang: string = 'english'): number {
    if (typeof window === 'undefined') return 0;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.USER_XP, lang));
      if (data !== null) return parseInt(data, 10) || 0;
    } catch {}
    return 0;
  },

  saveXp(xp: number, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.USER_XP, lang), xp.toString());
      this.triggerAutoSync();
    } catch {}
  },

  addXp(amount: number, lang: string = 'english'): number {
    const current = this.getXp(lang);
    const next = current + Math.max(0, amount);
    this.saveXp(next, lang);
    return next;
  },

  getStreak(lang: string = 'english'): number {
    if (typeof window === 'undefined') return 0;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.STREAK_DAYS, lang));
      if (data !== null) return parseInt(data, 10) || 0;
    } catch {}
    return 0;
  },

  saveStreak(days: number, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.STREAK_DAYS, lang), days.toString());
      this.triggerAutoSync();
    } catch {}
  },

  getSkillScores(lang: string = 'english'): SkillMasteryScores {
    if (typeof window === 'undefined') {
      return { listening: 0, speaking: 0, reading: 0, writing: 0 };
    }
    try {
      const data = localStorage.getItem(getLangKey(KEYS.SKILLS, lang));
      if (data) return JSON.parse(data);
    } catch {}
    return { listening: 0, speaking: 0, reading: 0, writing: 0 };
  },

  saveSkillScores(scores: SkillMasteryScores, lang: string = 'english'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getLangKey(KEYS.SKILLS, lang), JSON.stringify(scores));
      this.triggerAutoSync();
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
    if (typeof window === 'undefined') return 0;
    try {
      const data = localStorage.getItem(getLangKey(KEYS.IMMERSION_MINUTES, lang));
      if (data !== null) return parseInt(data, 10) || 0;
    } catch {}
    return 0;
  },

  addImmersionMinutes(mins: number, lang: string = 'english'): number {
    if (typeof window === 'undefined') return 0;
    try {
      const current = this.getImmersionMinutes(lang);
      const next = current + Math.max(1, mins);
      localStorage.setItem(getLangKey(KEYS.IMMERSION_MINUTES, lang), next.toString());
      this.triggerAutoSync();
      return next;
    } catch {
      return 0;
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
      this.triggerAutoSync();
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
        // Purgar datos de demostración previos o perfiles locales no autenticados
        if (
          parsed.username === 'davida' ||
          parsed.email === 'david@nativa.edu' ||
          parsed.name === 'David Abarca' ||
          !parsed.id
        ) {
          localStorage.removeItem(KEYS.USER_PROFILE);
          return DEFAULT_USER_PROFILE;
        }
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

  // =========================================================================
  // MISIONES DIARIAS (GAMIFICACIÓN INTELIGENTE)
  // =========================================================================
  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  },

  getDailyMissions(): DailyMissionsState {
    const today = this.getTodayDateString();
    const defaultMissions: DailyMission[] = [
      {
        id: 'read_article',
        title: 'Leer 1 artículo de la biblioteca',
        description: 'Explora y lee 1 texto o audio en la Biblioteca de Inmersión',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 20
      },
      {
        id: 'complete_srs',
        title: 'Completar 1 sesión de SRS (Repaso)',
        description: 'Repasa tus tarjetas de repetición espaciada para fijar léxico',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 20
      },
      {
        id: 'shadowing_record',
        title: 'Grabar 1 respuesta oral en Shadowing',
        description: 'Practica tu fonética con el micrófono en la etapa de Shadowing',
        target: 1,
        progress: 0,
        completed: false,
        xpReward: 20
      }
    ];

    if (typeof window === 'undefined') {
      return { date: today, missions: defaultMissions, allCompletedBonusClaimed: false };
    }

    try {
      const data = localStorage.getItem(KEYS.DAILY_MISSIONS);
      if (data) {
        const parsed: DailyMissionsState = JSON.parse(data);
        if (parsed.date === today && Array.isArray(parsed.missions) && parsed.missions.length === 3) {
          return parsed;
        }
      }
    } catch {}

    const freshState: DailyMissionsState = {
      date: today,
      missions: defaultMissions,
      allCompletedBonusClaimed: false
    };
    this.saveDailyMissions(freshState);
    return freshState;
  },

  saveDailyMissions(state: DailyMissionsState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.DAILY_MISSIONS, JSON.stringify(state));
    } catch {}
  },

  updateDailyMissionProgress(
    missionId: DailyMissionType, 
    amount: number = 1
  ): { state: DailyMissionsState; newlyCompleted: boolean; bonusGranted: boolean } {
    const state = this.getDailyMissions();
    let newlyCompleted = false;
    let bonusGranted = false;

    state.missions = state.missions.map(m => {
      if (m.id === missionId && !m.completed) {
        const nextProgress = Math.min(m.target, m.progress + amount);
        const isDone = nextProgress >= m.target;
        if (isDone && !m.completed) {
          newlyCompleted = true;
          // Sumar XP de misión individual
          const currentXp = this.getXp();
          this.saveXp(currentXp + m.xpReward);
        }
        return {
          ...m,
          progress: nextProgress,
          completed: isDone
        };
      }
      return m;
    });

    // Verificar si las 3 misiones están completadas
    const allDone = state.missions.every(m => m.completed);
    if (allDone && !state.allCompletedBonusClaimed) {
      state.allCompletedBonusClaimed = true;
      bonusGranted = true;
      // Bonus especial de +50 XP al completar las 3 del día
      const currentXp = this.getXp();
      this.saveXp(currentXp + 50);
    }

    this.saveDailyMissions(state);
    return { state, newlyCompleted, bonusGranted };
  },

  // =========================================================================
  // BIBLIOTECA EXTENSIVA Y CONTENIDO PERSONALIZADO GUARDADO
  // =========================================================================
  saveCustomLibraryItem(item: any): void {
    if (typeof window === 'undefined') return;
    try {
      const items = this.getCustomLibraryItems();
      const updated = [item, ...items.filter((i: any) => i.id !== item.id)];
      localStorage.setItem(KEYS.CUSTOM_LIBRARY_ITEMS, JSON.stringify(updated));
    } catch {}
  },

  getCustomLibraryItems(lessonId?: string): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.CUSTOM_LIBRARY_ITEMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          if (lessonId) {
            return parsed.filter((i: any) => i.lessonId === lessonId);
          }
          return parsed;
        }
      }
    } catch {}
    return [];
  },

  markLibraryItemCompleted(itemId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getCompletedLibraryItemIds();
      if (!list.includes(itemId)) {
        list.push(itemId);
        localStorage.setItem(KEYS.COMPLETED_LIBRARY_ITEMS, JSON.stringify(list));
      }
    } catch {}
  },

  getCompletedLibraryItemIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.COMPLETED_LIBRARY_ITEMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
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
  },

  // =========================================================================
  // SINCRONIZACIÓN EN LA NUBE (SUPABASE SYNC LAYER)
  // =========================================================================
  async syncFromSupabase(userId: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const { getSupabaseClient, isSupabaseConfigured } = await import('@/lib/supabase');
      const client = getSupabaseClient();
      if (!client || !isSupabaseConfigured) return false;

      isSyncingFromCloud = true;

      // 1. Cargar Perfil
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        if (profile.xp !== undefined && profile.xp !== null) this.saveXp(profile.xp);
        if (profile.streak !== undefined && profile.streak !== null) this.saveStreak(profile.streak);
        if (profile.is_premium !== undefined) this.setUserPremium(Boolean(profile.is_premium));
        if (profile.has_seen_tour !== undefined && profile.has_seen_tour !== null) {
          this.setHasSeenTour(Boolean(profile.has_seen_tour));
        }
        const currentProfile = this.getUserProfile();
        this.saveUserProfile({
          ...currentProfile,
          id: profile.id,
          email: profile.email || currentProfile.email,
          name: profile.name || currentProfile.name,
          targetLevel: profile.current_level || currentProfile.targetLevel,
          avatarUrl: profile.avatar_url || undefined,
          isAdmin: Boolean(profile.is_admin || profile.email === 'adohuken2005@gmail.com'),
          hasSeenTour: profile.has_seen_tour !== undefined ? Boolean(profile.has_seen_tour) : currentProfile.hasSeenTour
        });
      }

      // 2. Cargar Progreso de Nodos
      const { data: progress } = await client
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (progress) {
        if (Array.isArray(progress.completed_nodes) && progress.completed_nodes.length > 0) {
          this.saveCompletedNodes(progress.completed_nodes);
        }
        if (Array.isArray(progress.completed_subnodes)) {
          this.saveCompletedSubNodes(progress.completed_subnodes);
        }
        if (progress.immersion_minutes !== undefined && progress.immersion_minutes !== null) {
          localStorage.setItem(KEYS.IMMERSION_MINUTES, progress.immersion_minutes.toString());
        }
        if (progress.skills) {
          this.saveSkillScores(progress.skills);
        }
      }

      return true;
    } catch (err) {
      console.error('Error syncing from Supabase:', err);
      return false;
    } finally {
      isSyncingFromCloud = false;
    }
  },

  async syncToSupabase(explicitUserId?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const { getSupabaseClient, isSupabaseConfigured } = await import('@/lib/supabase');
      const client = getSupabaseClient();
      if (!client || !isSupabaseConfigured) return false;

      let userId = explicitUserId;
      if (!userId) {
        const { data: { session } } = await client.auth.getSession();
        userId = session?.user?.id || this.getUserProfile().id;
      }

      if (!userId) return false;

      const profile = this.getUserProfile();
      const xp = this.getXp();
      const streak = this.getStreak();
      const completedNodes = this.getCompletedNodes();
      const completedSubNodes = this.getCompletedSubNodes();
      const immersionMinutes = this.getImmersionMinutes();
      const skills = this.getSkillScores();

      // =====================================================================
      // VALIDACIÓN DE SEGURIDAD EN EL SERVIDOR: CADENA DE PRERREQUISITOS
      // =====================================================================
      try {
        const res = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            completedNodes,
            completedSubNodes,
            xp,
            streak,
            immersionMinutes,
            skills,
            userProfile: profile
          })
        });

        if (res.ok) {
          const syncData = await res.json();
          if (syncData.success && syncData.tamperingDetected) {
            // El servidor detectó y purgó saltos de nivel ilegales
            this.saveCompletedNodes(syncData.validatedNodes);
            this.saveXp(syncData.sanitizedXp);
          }
          return true;
        }
      } catch (apiErr) {
        console.warn('API /api/progress/sync no disponible, aplicando fallback directo:', apiErr);
      }

      // Upsert perfil (Fallback)
      await client.from('profiles').upsert({
        id: userId,
        email: profile.email || undefined,
        name: profile.name,
        xp,
        streak,
        current_level: profile.targetLevel?.split(' ')[0] || 'A1',
        is_premium: this.isUserPremium(),
        has_seen_tour: this.hasSeenTour(),
        updated_at: new Date().toISOString()
      });

      // Upsert progreso (Fallback)
      await client.from('user_progress').upsert({
        user_id: userId,
        completed_nodes: completedNodes,
        completed_subnodes: completedSubNodes,
        immersion_minutes: immersionMinutes,
        skills,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      return true;
    } catch (err) {
      console.error('Error syncing to Supabase:', err);
      return false;
    }
  },

  // =========================================================================
  // FASE 5: PAYWALL MANUAL, ESTADO PREMIUM Y CÓDIGOS DE LICENCIA B2B
  // =========================================================================
  getPaywallEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const data = localStorage.getItem(KEYS.PAYWALL_ENABLED);
      return data === 'true';
    } catch {
      return false;
    }
  },

  setPaywallEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.PAYWALL_ENABLED, enabled ? 'true' : 'false');
    } catch {}
  },

  isUserPremium(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const data = localStorage.getItem(KEYS.IS_PREMIUM);
      return data === 'true';
    } catch {
      return false;
    }
  },

  setUserPremium(isPremium: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.IS_PREMIUM, isPremium ? 'true' : 'false');
    } catch {}
  },

  getPaymentRequests(): PaymentRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.PAYMENT_REQUESTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  },

  savePaymentRequests(requests: PaymentRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.PAYMENT_REQUESTS, JSON.stringify(requests));
    } catch {}
  },

  submitPaymentRequest(req: {
    userId: string;
    userName: string;
    userEmail: string;
    referenceNumber: string;
    bankName?: string;
    amount?: string;
    notes?: string;
  }): PaymentRequest {
    const list = this.getPaymentRequests();
    const newReq: PaymentRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: req.userId || 'usr_anonymous',
      userName: req.userName || 'Estudiante Nativa',
      userEmail: req.userEmail || '',
      referenceNumber: req.referenceNumber.trim(),
      bankName: req.bankName || 'BANPRO (Nicaragua)',
      amount: req.amount || '$29.99 USD / C$ 1,095',
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: req.notes
    };
    const updated = [newReq, ...list];
    this.savePaymentRequests(updated);
    return newReq;
  },

  approvePaymentRequest(requestId: string): boolean {
    const list = this.getPaymentRequests();
    let found = false;
    const updated = list.map(item => {
      if (item.id === requestId) {
        found = true;
        return { ...item, status: 'approved' as const };
      }
      return item;
    });
    if (found) {
      this.savePaymentRequests(updated);
      this.setUserPremium(true);
    }
    return found;
  },

  rejectPaymentRequest(requestId: string): boolean {
    const list = this.getPaymentRequests();
    let found = false;
    const updated = list.map(item => {
      if (item.id === requestId) {
        found = true;
        return { ...item, status: 'rejected' as const };
      }
      return item;
    });
    if (found) {
      this.savePaymentRequests(updated);
    }
    return found;
  },

  getLicenseCodes(): LicenseCode[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.LICENSE_CODES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Excluir códigos ficticios demo
          const cleaned = parsed.filter(c =>
            c.code !== 'NATIVA-VIP-ACCESS' &&
            c.code !== 'NATIVA-CALL-2026' &&
            c.code !== 'NATIVA-UNI-SCHOLAR' &&
            !c.note?.includes('Convenio Call Center BPO Excellence') &&
            !c.note?.includes('Beca Académica Universitaria UNI / UCA') &&
            !c.note?.includes('Acceso Especial Fundadores')
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(KEYS.LICENSE_CODES, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  },

  saveLicenseCodes(codes: LicenseCode[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.LICENSE_CODES, JSON.stringify(codes));
    } catch {}
  },

  generateLicenseCode(code: string, note?: string, maxRedemptions: number = 100): LicenseCode {
    const cleanCode = code.trim().toUpperCase();
    const codes = this.getLicenseCodes();
    const existing = codes.find(c => c.code === cleanCode);
    if (existing) {
      return existing;
    }
    const newCode: LicenseCode = {
      code: cleanCode,
      maxRedemptions,
      currentRedemptions: 0,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      note: note || 'Licencia Corporativa B2B'
    };
    this.saveLicenseCodes([newCode, ...codes]);
    return newCode;
  },

  toggleLicenseCode(code: string): boolean {
    const codes = this.getLicenseCodes();
    const updated = codes.map(c => c.code === code ? { ...c, active: !c.active } : c);
    this.saveLicenseCodes(updated);
    return true;
  },

  redeemLicenseCode(rawCode: string): { success: boolean; message: string } {
    const cleanCode = rawCode.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Ingresa un código de licencia válido.' };
    }
    const codes = this.getLicenseCodes();
    const found = codes.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Código de licencia no encontrado o inválido.' };
    }
    if (!found.active) {
      return { success: false, message: 'Este código de licencia se encuentra desactivado.' };
    }
    if (found.currentRedemptions >= found.maxRedemptions) {
      return { success: false, message: 'Este código de licencia ha alcanzado el límite máximo de activaciones.' };
    }

    // Incrementar redención
    const updated = codes.map(c => {
      if (c.code === cleanCode) {
        return { ...c, currentRedemptions: c.currentRedemptions + 1 };
      }
      return c;
    });
    this.saveLicenseCodes(updated);

    // Activar Premium para el usuario
    this.setUserPremium(true);

    return { 
      success: true, 
      message: `¡Licencia activada con éxito! Has desbloqueado Nativa Premium (${found.note || cleanCode}).` 
    };
  }
};
