'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Headphones, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  GraduationCap, 
  Layers, 
  Clock, 
  Brain, 
  Volume2, 
  VolumeX, 
  Compass, 
  Star, 
  ShieldCheck, 
  Check, 
  Phone, 
  Briefcase, 
  Code,
  Play,
  Gift,
  ChevronRight,
  LogOut,
  User,
  ArrowLeft,
  HelpCircle,
  Home
} from 'lucide-react';
import { FluentiaLogo, NativaLogo } from '@/components/fluentia-logo';
import { LANGUAGES_REGISTRY, LanguageHubEntry, getAllLanguages } from '@/content/course-content';
import { AppStorage, UserProfile, DailyMissionsState } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { UserProfileModal } from '@/components/user-profile-modal';
import { AuthModal } from '@/components/auth-modal';
import { PlacementTestModal } from '@/components/placement-test-modal';
import { DailyVocabularyModal } from '@/components/learn';
import { OnboardingTour } from '@/components/onboarding-tour';
import { APP_NAME } from '@/lib/config';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

export default function StudentDashboardPage() {
  const router = useRouter();

  const [streakDays, setStreakDays] = useState<number>(0);
  const [userXp, setUserXp] = useState<number>(0);
  const [immersionMinutes, setImmersionMinutes] = useState<number>(0);
  const [completedEnglishNodes, setCompletedEnglishNodes] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeLang, setActiveLang] = useState<string>('english');
  const [languages, setLanguages] = useState<Record<string, LanguageHubEntry>>(LANGUAGES_REGISTRY);

  // Modales y Estados de Usuario
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isDailyVocabOpen, setIsDailyVocabOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => AppStorage.getUserProfile());
  const [missionsState, setMissionsState] = useState<DailyMissionsState>(() => AppStorage.getDailyMissions());
  const [isRedirectingToRoute, setIsRedirectingToRoute] = useState<boolean>(true);

  // Nombre Real del Alumno (evitar "Estudiante" y correos electrónicos)
  const displayName = useMemo(() => {
    const raw = userProfile.name?.trim() || '';
    if (raw && !raw.includes('@') && raw !== 'Estudiante' && raw !== 'David Abarca' && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(raw)) {
      return raw;
    }
    const metaUsername = userProfile.username?.trim();
    if (metaUsername && metaUsername !== 'estudiante' && metaUsername !== 'davida' && !metaUsername.includes('@')) {
      return `@${metaUsername}`;
    }
    return 'Aventurero';
  }, [userProfile]);

  const greetingFirstName = useMemo(() => {
    if (displayName.startsWith('@')) return displayName.substring(1);
    return displayName.split(' ')[0] || 'Aventurero';
  }, [displayName]);

  const completedMissionsCount = missionsState.missions.filter(m => m.completed).length;
  const totalMissions = missionsState.missions.length || 3;
  const missionsProgressPct = Math.round((completedMissionsCount / totalMissions) * 100);

  useEffect(() => {
    const savedSound = AppStorage.getSoundEnabled();
    const currentLang = AppStorage.getActiveLanguage();
    const allLangs = getAllLanguages();
    const activeLanguages = Object.values(allLangs).filter(l => l.status === 'active');

    // Si solo hay un idioma activo (por defecto Inglés), redirigir inmediatamente a su ruta (/learn/english)
    if (activeLanguages.length <= 1) {
      const targetLang = activeLanguages[0]?.id || 'english';
      router.replace(`/learn/${targetLang}`);
      return;
    }

    setIsRedirectingToRoute(false);
    setSoundEnabled(savedSound);
    setActiveLang(currentLang || 'english');
    setLanguages(allLangs);
    soundManager.enabled = savedSound;

    const refreshMissions = () => setMissionsState(AppStorage.getDailyMissions());
    refreshMissions();
    const missionInterval = setInterval(refreshMissions, 5000);

    // Hidratar sesión de Supabase
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured) {
      client.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          await AppStorage.syncFromSupabase(session.user.id);
          const prof = AppStorage.getUserProfile();
          const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
          const resolvedName = (prof.name && prof.name !== 'Estudiante' && !prof.name.includes('@'))
            ? prof.name
            : (metaName || 'Aventurero');

          const updatedProfile = {
            ...prof,
            name: resolvedName,
            email: session.user.email || prof.email,
            username: prof.username || session.user.email?.split('@')[0] || ''
          };
          setUserProfile(updatedProfile);
          AppStorage.saveUserProfile(updatedProfile);
          setStreakDays(AppStorage.getStreak('english'));
          setUserXp(AppStorage.getXp('english'));
          setImmersionMinutes(AppStorage.getImmersionMinutes('english'));
          setCompletedEnglishNodes(AppStorage.getCompletedNodes('english'));
        } else {
          // Si no está autenticado en Supabase, verificar sesión local
          const localSess = localStorage.getItem('fluentia_user_session');
          if (localSess) {
            setIsAuthenticated(true);
            setUserProfile(AppStorage.getUserProfile());
            setStreakDays(AppStorage.getStreak('english'));
            setUserXp(AppStorage.getXp('english'));
            setImmersionMinutes(AppStorage.getImmersionMinutes('english'));
            setCompletedEnglishNodes(AppStorage.getCompletedNodes('english'));
          } else {
            setIsAuthenticated(false);
          }
        }
      });

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          await AppStorage.syncFromSupabase(session.user.id);
          setUserProfile(AppStorage.getUserProfile());
          setStreakDays(AppStorage.getStreak('english'));
          setUserXp(AppStorage.getXp('english'));
          setImmersionMinutes(AppStorage.getImmersionMinutes('english'));
          setCompletedEnglishNodes(AppStorage.getCompletedNodes('english'));
        } else {
          setIsAuthenticated(false);
        }
      });
    } else {
      const localSess = typeof window !== 'undefined' ? localStorage.getItem('fluentia_user_session') : null;
      setIsAuthenticated(Boolean(localSess));
      setUserProfile(AppStorage.getUserProfile());
      setStreakDays(AppStorage.getStreak('english'));
      setUserXp(AppStorage.getXp('english'));
      setImmersionMinutes(AppStorage.getImmersionMinutes('english'));
      setCompletedEnglishNodes(AppStorage.getCompletedNodes('english'));
    }

    return () => clearInterval(missionInterval);
  }, []);

  // Auto-disparar Onboarding Tour si el usuario es nuevo o no lo ha visto
  useEffect(() => {
    if (!AppStorage.hasSeenTour()) {
      const tourTimer = setTimeout(() => {
        setIsTourOpen(true);
      }, 800);
      return () => clearTimeout(tourTimer);
    }
  }, []);

  const handleTourDismiss = async () => {
    setIsTourOpen(false);
    AppStorage.setHasSeenTour(true);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured) {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user?.id) {
          await client.from('profiles').update({
            has_seen_tour: true,
            updated_at: new Date().toISOString()
          }).eq('id', session.user.id);
        }
      } catch (err) {
        console.warn('Error guardando has_seen_tour en Supabase:', err);
      }
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    AppStorage.saveSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      try { await client.auth.signOut(); } catch {}
    }
    localStorage.removeItem('fluentia_user_session');
    localStorage.removeItem('fluentia_user_profile');
    localStorage.removeItem('nativa_admin_session');
    try { document.cookie = 'nativa_admin_session=; path=/; max-age=0'; } catch {}
    setIsAuthenticated(false);
    soundManager.playClick();
    router.push('/');
  };

  const englishProgressPct = Math.min(100, Math.round((completedEnglishNodes.length / 24) * 100));

  if (isRedirectingToRoute) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-mono text-sm text-slate-300">Cargando tu ruta de aprendizaje en Nativa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      
      {/* Fondo de Profundidad Gamer: Nebulosa Radial + Polvo Estelar */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),rgba(6,182,212,0.06),transparent_70%)] blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,158,11,0.08),rgba(139,92,246,0.04),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-10 -left-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(6,182,212,0.07),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* =====================================================================
          HEADER DEL DASHBOARD DEL ALUMNO
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" title="Ir al Inicio">
            <FluentiaLogo size="md" />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Panel de Estudio
          </span>
        </div>

        {/* Métricas Globales del Alumno + Perfil */}
        <div className="flex items-center gap-3">
          {/* Volver a Landing pública */}
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition"
            title="Ir a la página de inicio"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>

          {/* Stats Gamer (Racha | XP | Tiempo) */}
          <div 
            data-tour="tour-header-stats"
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#0b101c] border border-slate-800/90 text-xs font-mono shadow-inner"
          >
            <div className="flex items-center gap-1.5 text-amber-400" title="Racha de estudio diario">
              <Flame className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
              <span className="font-extrabold">{streakDays}d</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400" title="Experiencia acumulada">
              <Zap className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span className="font-extrabold">{userXp} XP</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-teal-300" title="Minutos de inmersión total">
              <Headphones className="w-4 h-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
              <span className="font-extrabold">{immersionMinutes}m</span>
            </div>
          </div>

          {/* Botón de Ayuda Permanente: Iniciar Onboarding Tour */}
          <button
            onClick={() => {
              setIsTourOpen(true);
              soundManager.playClick();
            }}
            title="Ver Tutorial Interactivo (Tour de Bienvenida)"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer group shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </button>

          {/* Sonido Zen */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido Zen'}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Perfil del Usuario */}
          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              soundManager.playClick();
            }}
            className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-[#0b101c] hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition group shadow-sm cursor-pointer"
            title="Ver y editar mi perfil"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center shrink-0 text-base shadow-sm">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span>{userProfile.avatarEmoji || '👨‍🎓'}</span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-black text-white group-hover:text-emerald-300 transition">{displayName}</span>
              <span className="text-[10px] font-mono text-emerald-400">{userProfile.targetLevel?.split(' ')[0] || 'A1'} • Pro</span>
            </div>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN CONTAINER DEL DASHBOARD
      ===================================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-10">
        
        {/* =====================================================================
            HERO GRID GAMER: SALUDO + RECOMPENSA DIARIA + MISIONES
        ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* HERO SECTION PRINCIPAL (8 COLS) */}
          <section className="lg:col-span-7 xl:col-span-8 relative overflow-hidden rounded-3xl p-6 sm:p-9 bg-gradient-to-br from-[#081220] via-[#070d17] to-[#040810] border border-emerald-500/30 shadow-2xl flex flex-col justify-between space-y-6">
            
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-extrabold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ruta Oficial • Nivel {userProfile.targetLevel?.split(' ')[0] || 'A1'}</span>
              </div>

              {/* Saludo Personalizado Directo */}
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                ¡Hola, {greetingFirstName}! ¿Listo para tu inmersión de hoy?
              </h1>

              {/* Texto Corto Motivador */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Continúa tu camino hacia la fluidez. Has completado el <span className="text-emerald-400 font-bold font-mono">{englishProgressPct}%</span> de tu nivel <span className="text-emerald-300 font-bold font-mono">{userProfile.targetLevel?.split(' ')[0] || 'A1'}</span>.
              </p>

              {/* Estadísticas de Nodos */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-200 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-base leading-none">🇬🇧</span> <strong className="text-white">Inglés General:</strong> {completedEnglishNodes.length} de 24 Nodos
                </span>
                <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
                  <Zap className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  +{userXp} XP acumulados
                </span>
              </div>
            </div>

            {/* BOTONES CALL TO ACTION */}
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              {/* Botón PROTAGONISTA: Continuar Inglés General */}
              <Link
                href="/learn/english"
                data-tour="tour-btn-general"
                onClick={() => soundManager.playClick()}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm sm:text-base transition shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 group border border-emerald-300/40 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-slate-950/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
                </div>
                <span>Continuar Inglés General</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              {/* Botón SECUNDARIO: Call Center BPO */}
              <Link
                href="/learn/english/call-center"
                data-tour="tour-btn-callcenter"
                onClick={() => soundManager.playClick()}
                className="px-5 py-3.5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 active:scale-95 shadow-sm group cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Ruta Call Center BPO</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400/70" />
              </Link>
            </div>
          </section>

          {/* COLUMNA DERECHA: WIDGETS GAMER (4 COLS) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            
            {/* WIDGET 1: COFRE DE VOCABULARIO DIARIO (DAILY DROP) */}
            <div
              data-tour="tour-daily-words"
              onClick={() => {
                setIsDailyVocabOpen(true);
                soundManager.playClick();
              }}
              className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#111622] to-[#070b13] border border-amber-500/40 hover:border-amber-400 shadow-xl shadow-amber-500/10 transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <Gift className="w-6 h-6 text-amber-400 animate-bounce" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-extrabold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Daily Drop
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">+15 XP</span>
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition truncate">
                      Palabras de Hoy: ¡Listas!
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-tight truncate">
                      Abre tu cofre con 3 palabras y audio
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>

            {/* WIDGET 2: MISIONES DE HOY CON BARRA DE PROGRESO */}
            <div 
              data-tour="tour-daily-missions"
              className="flex-1 p-5 rounded-3xl bg-[#090d16]/90 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Misiones de Hoy</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {completedMissionsCount} de {totalMissions} completadas
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  +50 XP Bonus
                </span>
              </div>

              {/* Barra Gamer de Progreso */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${missionsProgressPct}%` }}
                />
              </div>

              {/* Lista Compacta de Misiones */}
              <div className="space-y-1.5 pt-0.5">
                {missionsState.missions.map((mission) => (
                  <Link
                    key={mission.id}
                    href="/learn/english"
                    onClick={() => soundManager.playClick()}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800/80 text-xs transition group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        mission.completed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-900 text-slate-600'
                      }`}>
                        {mission.completed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                      </div>
                      <span className={`truncate text-[11px] ${mission.completed ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-white font-medium'}`}>
                        {mission.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0 ml-2">
                      +{mission.xpReward} XP
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================================
            SECCIÓN DE RUTAS Y ESPECIALIZACIONES DISPONIBLES
        ===================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Rutas de Aprendizaje Disponibles</span>
            </h2>
            <Link
              href="/learn/english"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>Ver mapa completo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Inglés General A1-C2 */}
            <Link
              href="/learn/english"
              onClick={() => soundManager.playClick()}
              className="p-5 rounded-2xl bg-slate-900/40 hover:bg-slate-850/70 border border-slate-800/80 hover:border-emerald-500/40 transition group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇬🇧</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Ruta Universitaria
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  Inglés General (MCER A1 → C2)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  24 Nodos de inmersión total: lectura comprensiva, audios nativos y proyectos universitarios evaluados con rúbricas de Oxford.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                <span>{completedEnglishNodes.length} de 24 Nodos completados</span>
                <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">Entrar →</span>
              </div>
            </Link>

            {/* Card 2: Call Center BPO */}
            <Link
              href="/learn/english/call-center"
              onClick={() => soundManager.playClick()}
              className="p-5 rounded-2xl bg-slate-900/40 hover:bg-slate-850/70 border border-slate-800/80 hover:border-amber-500/40 transition group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🎧</span>
                <span className="text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Especialización Laboral
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  Track Call Center BPO Pro
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Entrenamiento para contratación inmediata en centros de contacto: empathy statements, manejo de llamadas difíciles y terminología CRM.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                <span>4 Módulos Intensivos</span>
                <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">Entrar →</span>
              </div>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs font-mono text-slate-500">
        {APP_NAME} • Ecosistema Multi-Idioma de Adquisición de Segundas Lenguas (SLA) • 2026
      </footer>

      {/* ================= MODALES DEL DASHBOARD ================= */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
        streakDays={streakDays}
        userXp={userXp}
        immersionMinutes={immersionMinutes}
      />

      <DailyVocabularyModal
        isOpen={isDailyVocabOpen}
        onClose={() => setIsDailyVocabOpen(false)}
        userLevel={userProfile.targetLevel?.split(' ')[0] || 'A1'}
        userId={userProfile.id}
        onXpAwarded={(amount) => {
          const nextXp = AppStorage.addXp(amount, 'english');
          setUserXp(nextXp);
        }}
      />

      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        userId={userProfile.id}
        onLevelAssigned={(level, unlockedNodes) => {
          setCompletedEnglishNodes(unlockedNodes);
          setUserProfile(AppStorage.getUserProfile());
          setUserXp(AppStorage.getXp('english'));
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={async (profile) => {
          setIsAuthenticated(true);
          await AppStorage.syncFromSupabase(profile.id);
          setUserProfile(AppStorage.getUserProfile());
          setStreakDays(AppStorage.getStreak('english'));
          setUserXp(AppStorage.getXp('english'));
          setImmersionMinutes(AppStorage.getImmersionMinutes('english'));
          setCompletedEnglishNodes(AppStorage.getCompletedNodes('english'));
          if (!AppStorage.hasSeenTour()) {
            setTimeout(() => setIsTourOpen(true), 600);
          }
        }}
      />

      {/* Tutorial Interactivo de Bienvenida (Onboarding Tour Gamer) */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={handleTourDismiss}
        onComplete={handleTourDismiss}
      />

    </div>
  );
}