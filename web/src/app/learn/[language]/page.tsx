'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  CheckCircle2,
  Play,
  Headphones,
  Mic,
  BookOpen,
  Flame,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronRight,
  X,
  Award,
  Zap,
  Compass,
  Sliders,
  Eye,
  EyeOff,
  Trophy,
  Star,
  Check,
  CheckCheck,
  ArrowRight,
  BookMarked,
  User,
  LogOut,
  Mail,
  KeyRound,
  AlertCircle,
  Globe,
  BrainCircuit,
  GraduationCap,
  Activity,
  Layers,
  Radio,
  RotateCcw,
  Sparkle,
  Clock,
  Target,
  ListTree,
  MapPin,
  Calendar,
  Bot,
  MessageSquare,
  FileText,
  FileCheck,
  Send,
  BarChart3,
  RefreshCw,
  Menu,
  Brain,
  RotateCw,
  Keyboard,
  Briefcase,
  CreditCard,
  Coffee,
  ArrowLeft,
  Lightbulb,
  Bold,
  Italic,
  List,
  Quote,
  Crown,
  Gift,
  Settings,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { COMPREHENSIVE_CURRICULUM, IntensiveLesson, StoryEvent, NoticingInsight } from '@/lib/curriculum-data';
import { COMPLETE_SYLLABUS, DAILY_STUDY_PLAN, UNIVERSITY_PEDAGOGICAL_FRAMEWORK } from '@/lib/syllabus-data';
import { soundManager } from '@/lib/sound-effects';
import { speechEvaluator, PronunciationEvaluation } from '@/lib/speech-recognition';
import { AppStorage, SkillMasteryScores, ProjectSubmission, UserProfile } from '@/lib/storage';
import { ACADEMIC_PROJECTS, AcademicProjectDefinition, evaluateProjectSubmission } from '@/lib/project-data';
import { generateSrsDeck, FlashcardItem } from '@/lib/srs-review';
import { getFigurativePronunciation } from '@/lib/phonetics';
import { IMMERSION_STORIES, ImmersionStory } from '@/lib/immersion-data';
import { FluentiaLogo, FluentiaGlyph } from '@/components/fluentia-logo';
import { SubNode, getSubNodesForLesson, getSubNodeById, getLanguageEntry } from '@/content/course-content';
import { ImmersionViewerModal } from '@/components/immersion-viewer-modal';
import { TopicLibraryModal } from '@/components/topic-library-modal';
import { DailyMissionsWidget } from '@/components/daily-missions-widget';
import { RadarSkillsChart } from '@/components/radar-skills-chart';
import { UserProfileModal } from '@/components/user-profile-modal';
import { PlacementTestModal } from '@/components/placement-test-modal';
import { PremiumPaywallModal } from '@/components/premium-paywall-modal';
import { DailyVocabularyModal } from '@/components/learn';
import { CertificatesModal } from '@/components/certificates-modal';
import { APP_NAME } from '@/lib/config';
import { getSupabaseClient, isSupabaseConfigured, DatabaseProfile } from '@/lib/supabase';
import { AiConfigService } from '@/lib/ai-config';
import { LearningMap, ImmersionViewer, SrsGame, LessonRunner } from '@/components/learn';

interface BuilderToken {
  id: string;
  text: string;
}

interface UserSession {
  id: string;
  email: string;
  role: string;
}

interface LevelTheme {
  name: string;
  badgeBg: string;
  borderActive: string;
  ringActive: string;
  cardGlow: string;
  btnGradient: string;
  btnText: string;
  beaconCompleted: string;
  beaconActive: string;
  lineCompleted: string;
  accentText: string;
  dotColor: string;
  tabColor: string;
  tabActive: string;
  tabInactive: string;
  bannerBg: string;
  progressDone: string;
  progressCurrent: string;
}

const LEVEL_THEMES: Record<string, LevelTheme> = {
  A1: {
    name: 'Fundamentos',
    badgeBg: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40 font-bold',
    borderActive: 'border-emerald-500',
    ringActive: 'ring-emerald-500/30',
    cardGlow: 'shadow-2xl shadow-emerald-500/15',
    btnGradient: 'from-emerald-500 via-teal-400 to-emerald-600',
    btnText: 'text-slate-950 font-black',
    beaconCompleted: 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400/40',
    beaconActive: 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 shadow-xl shadow-emerald-500/60 ring-4 ring-emerald-400/50',
    lineCompleted: 'bg-emerald-500 shadow-sm shadow-emerald-500/60',
    accentText: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    tabColor: 'text-emerald-400',
    tabActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-emerald-950/60 via-teal-950/30 to-[#0b101b] border-emerald-500/40',
    progressDone: 'bg-emerald-500 shadow-sm shadow-emerald-500/40',
    progressCurrent: 'bg-gradient-to-r from-emerald-400 to-teal-300 ring-2 ring-emerald-400/50',
  },
  A2: {
    name: 'Comunicación',
    badgeBg: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/40 font-bold',
    borderActive: 'border-cyan-500',
    ringActive: 'ring-cyan-500/30',
    cardGlow: 'shadow-2xl shadow-cyan-500/15',
    btnGradient: 'from-cyan-500 via-sky-400 to-blue-600',
    btnText: 'text-slate-950 font-black',
    beaconCompleted: 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/50 ring-2 ring-cyan-400/40',
    beaconActive: 'bg-gradient-to-tr from-cyan-400 to-sky-300 text-slate-950 shadow-xl shadow-cyan-500/60 ring-4 ring-cyan-400/50',
    lineCompleted: 'bg-cyan-500 shadow-sm shadow-cyan-500/60',
    accentText: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    tabColor: 'text-cyan-400',
    tabActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-cyan-950/60 via-sky-950/30 to-[#0b101b] border-cyan-500/40',
    progressDone: 'bg-cyan-500 shadow-sm shadow-cyan-500/40',
    progressCurrent: 'bg-gradient-to-r from-cyan-400 to-sky-300 ring-2 ring-cyan-400/50',
  },
  B1: {
    name: 'Independencia',
    badgeBg: 'text-blue-300 bg-blue-500/15 border-blue-500/40 font-bold',
    borderActive: 'border-blue-500',
    ringActive: 'ring-blue-500/30',
    cardGlow: 'shadow-2xl shadow-blue-500/15',
    btnGradient: 'from-blue-500 via-indigo-500 to-blue-700',
    btnText: 'text-white font-black',
    beaconCompleted: 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/40',
    beaconActive: 'bg-gradient-to-tr from-blue-400 to-indigo-300 text-slate-950 shadow-xl shadow-blue-500/60 ring-4 ring-blue-400/50',
    lineCompleted: 'bg-blue-500 shadow-sm shadow-blue-500/60',
    accentText: 'text-blue-400',
    dotColor: 'bg-blue-400',
    tabColor: 'text-blue-400',
    tabActive: 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-blue-950/60 via-indigo-950/30 to-[#0b101b] border-blue-500/40',
    progressDone: 'bg-blue-500 shadow-sm shadow-blue-500/40',
    progressCurrent: 'bg-gradient-to-r from-blue-400 to-indigo-300 ring-2 ring-blue-400/50',
  },
  B2: {
    name: 'Académico',
    badgeBg: 'text-purple-300 bg-purple-500/15 border-purple-500/40 font-bold',
    borderActive: 'border-purple-500',
    ringActive: 'ring-purple-500/30',
    cardGlow: 'shadow-2xl shadow-purple-500/15',
    btnGradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    btnText: 'text-white font-black',
    beaconCompleted: 'bg-purple-500 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/40',
    beaconActive: 'bg-gradient-to-tr from-purple-400 to-violet-300 text-slate-950 shadow-xl shadow-purple-500/60 ring-4 ring-purple-400/50',
    lineCompleted: 'bg-purple-500 shadow-sm shadow-purple-500/60',
    accentText: 'text-purple-400',
    dotColor: 'bg-purple-400',
    tabColor: 'text-purple-400',
    tabActive: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-purple-950/60 via-violet-950/30 to-[#0b101b] border-purple-500/40',
    progressDone: 'bg-purple-500 shadow-sm shadow-purple-500/40',
    progressCurrent: 'bg-gradient-to-r from-purple-400 to-violet-300 ring-2 ring-purple-400/50',
  },
  C1: {
    name: 'Avanzado',
    badgeBg: 'text-rose-300 bg-rose-500/15 border-rose-500/40 font-bold',
    borderActive: 'border-rose-500',
    ringActive: 'ring-rose-500/30',
    cardGlow: 'shadow-2xl shadow-rose-500/15',
    btnGradient: 'from-rose-500 via-pink-500 to-red-600',
    btnText: 'text-white font-black',
    beaconCompleted: 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 ring-2 ring-rose-400/40',
    beaconActive: 'bg-gradient-to-tr from-rose-400 to-pink-300 text-slate-950 shadow-xl shadow-rose-500/60 ring-4 ring-rose-400/50',
    lineCompleted: 'bg-rose-500 shadow-sm shadow-rose-500/60',
    accentText: 'text-rose-400',
    dotColor: 'bg-rose-400',
    tabColor: 'text-rose-400',
    tabActive: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-rose-950/60 via-pink-950/30 to-[#0b101b] border-rose-500/40',
    progressDone: 'bg-rose-500 shadow-sm shadow-rose-500/40',
    progressCurrent: 'bg-gradient-to-r from-rose-400 to-pink-300 ring-2 ring-rose-400/50',
  },
  C2: {
    name: 'Maestría',
    badgeBg: 'text-amber-300 bg-amber-500/15 border-amber-500/40 font-bold',
    borderActive: 'border-amber-500',
    ringActive: 'ring-amber-500/30',
    cardGlow: 'shadow-2xl shadow-amber-500/15',
    btnGradient: 'from-amber-400 via-yellow-400 to-orange-500',
    btnText: 'text-slate-950 font-black',
    beaconCompleted: 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/50 ring-2 ring-amber-300/40',
    beaconActive: 'bg-gradient-to-tr from-amber-300 to-yellow-200 text-slate-950 shadow-xl shadow-amber-500/60 ring-4 ring-amber-300/50',
    lineCompleted: 'bg-amber-400 shadow-sm shadow-amber-400/60',
    accentText: 'text-amber-400',
    dotColor: 'bg-amber-400',
    tabColor: 'text-amber-400',
    tabActive: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-amber-950/60 via-yellow-950/30 to-[#0b101b] border-amber-500/40',
    progressDone: 'bg-amber-400 shadow-sm shadow-amber-400/40',
    progressCurrent: 'bg-gradient-to-r from-amber-300 to-yellow-300 ring-2 ring-amber-300/50',
  },
};

export default function FluentiaPathPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-emerald-400 font-mono text-xs">
        Cargando ruta de aprendizaje...
      </div>
    }>
      <FluentiaPathContent />
    </Suspense>
  );
}

function FluentiaPathContent() {
  const params = useParams();
  const languageId = (params?.language as string) || 'english';
  const currentLanguageEntry = getLanguageEntry(languageId);

  // Estado de usuario y autenticación
  const [user, setUser] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string>('');
  const [isCertificatesModalOpen, setIsCertificatesModalOpen] = useState(false);
  const [isDailyVocabOpen, setIsDailyVocabOpen] = useState(false);
  const [b2c2AlertModalOpen, setB2c2AlertModalOpen] = useState(false);
  const [b2c2AlertLevel, setB2c2AlertLevel] = useState('B2');
  const [isUserPremium, setIsUserPremium] = useState<boolean>(() => AppStorage.isUserPremium());
  const [isPaywallActive, setIsPaywallActive] = useState<boolean>(() => AppStorage.getPaywallEnabled());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => AppStorage.getUserProfile());

  // Navegación de Vistas del Dashboard: 'PATH' | 'IMMERSION' | 'SYLLABUS' | 'PROJECTS' | 'REVIEW'
  const [currentView, setCurrentView] = useState<'PATH' | 'IMMERSION' | 'SYLLABUS' | 'PROJECTS' | 'REVIEW'>('PATH');
  const [selectedSyllabusLevelId, setSelectedSyllabusLevelId] = useState<string>('level-a1');
  const [routeLevelFilter, setRouteLevelFilter] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('ALL');

  // Sección de Inmersión Masiva (Narrow Reading Krasheniano)
  const [immersionMinutes, setImmersionMinutes] = useState<number>(() => AppStorage.getImmersionMinutes(languageId));
  const [selectedImmersionStory, setSelectedImmersionStory] = useState<ImmersionStory | null>(null);
  const [immersionLevelFilter, setImmersionLevelFilter] = useState<string>('ALL');

  // Frases Estrella Seleccionadas por el Alumno (⭐)
  const [starredPhrases, setStarredPhrases] = useState<any[]>([]);

  // Ayuda Fonética Opcional
  const [showFigurativeHelper, setShowFigurativeHelper] = useState<boolean>(false);

  // Menú Móvil & Repaso SRS
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [srsDeck, setSrsDeck] = useState<FlashcardItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [srsLevelFilter, setSrsLevelFilter] = useState<string>('ALL');
  const [srsCardsReviewedCount, setSrsCardsReviewedCount] = useState(0);

  // Estado del camino de aprendizaje y progreso (Nodos Madre y Sub-Nodos)
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(() => AppStorage.getCompletedNodes(languageId));
  const [completedSubNodeIds, setCompletedSubNodeIds] = useState<string[]>(() => AppStorage.getCompletedSubNodes(languageId));
  const [activeSubNode, setActiveSubNode] = useState<SubNode | null>(null);
  const [activeLesson, setActiveLesson] = useState<IntensiveLesson | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedLibraryLesson, setSelectedLibraryLesson] = useState<{ id: string; code: string; title: string; level: string } | null>(null);
  const [activePopoverLessonId, setActivePopoverLessonId] = useState<string | null>(null);
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 a 6 pasos
  const [userXp, setUserXp] = useState<number>(() => AppStorage.getXp(languageId));
  const [streakDays, setStreakDays] = useState<number>(() => AppStorage.getStreak(languageId));
  const [skillScores, setSkillScores] = useState<SkillMasteryScores>(() => AppStorage.getSkillScores(languageId));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [zenMode, setZenMode] = useState<boolean>(true);

  // Estados para UI / Sidebar Gamer Compacto
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);
  const [slaViewMode, setSlaViewMode] = useState<'BARS' | 'RADAR'>('BARS');
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reconocimiento de Voz Real (Web Speech API)
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationEvaluation | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [activeShadowingPhraseIdx, setActiveShadowingPhraseIdx] = useState<number>(0);

  // Taller de Proyectos Universitarios
  const [selectedProjectUnit, setSelectedProjectUnit] = useState<number>(1);
  const [projectTextDraft, setProjectTextDraft] = useState<string>('');
  const [projectSubmissions, setProjectSubmissions] = useState<Record<number, ProjectSubmission>>({});
  const [isEvaluatingProject, setIsEvaluatingProject] = useState(false);

  // Estados interactivos dentro del Lesson Runner
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [revealedLineIndexes, setRevealedLineIndexes] = useState<number[]>([]);

  // Diálogo Continuo Paso 1
  const [isContinuousPlaying, setIsContinuousPlaying] = useState(false);
  const continuousStopRef = useRef<boolean>(false);

  // Paso 2 (Comprensión)
  const [step2SelectedIdx, setStep2SelectedIdx] = useState<number | null>(null);

  // Paso 3 (Reconstruye la Historia y Sentence Builder)
  const [selectedTokens, setSelectedTokens] = useState<BuilderToken[]>([]);
  const [builderStatus, setBuilderStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [selectedStoryEventIds, setSelectedStoryEventIds] = useState<string[]>([]);
  const [storyOrderCorrect, setStoryOrderCorrect] = useState<boolean | null>(null);

  // Paso 4 (Shadowing)
  const [isRecording, setIsRecording] = useState(false);
  const [shadowingSuccess, setShadowingSuccess] = useState(false);

  // Paso 5 (Noticing Opcional)
  const [step5SelectedIdx, setStep5SelectedIdx] = useState<number | null>(null);
  const [noticingExpanded, setNoticingExpanded] = useState<boolean>(false);
  const [noticingPragmaticSelection, setNoticingPragmaticSelection] = useState<'A' | 'B' | null>(null);

  // Paso 6 (Mastery)
  const [step6SelectedIdx, setStep6SelectedIdx] = useState<number | null>(null);
  const [lessonFinished, setLessonFinished] = useState(false);

  // Sincronización en la nube con Supabase
  const triggerCloudSync = (targetUser?: UserSession | null) => {
    const active = targetUser !== undefined ? targetUser : user;
    if (active?.id) {
      AppStorage.syncToSupabase(active.id).catch(err => {
        console.error('Error syncing to Supabase:', err);
      });
    }
  };

  // Hidratar progreso desde Supabase y localStorage al montar
  useEffect(() => {
    // 1. Cargar progreso base desde AppStorage
    const hydrateLocalState = () => {
      setCompletedNodeIds(AppStorage.getCompletedNodes());
      setUserXp(AppStorage.getXp());
      setStreakDays(AppStorage.getStreak());
      setSkillScores(AppStorage.getSkillScores());
      setSoundEnabled(AppStorage.getSoundEnabled());
      soundManager.enabled = AppStorage.getSoundEnabled();
      setZenMode(AppStorage.getZenMode());
      setProjectSubmissions(AppStorage.getProjectSubmissions());
      setImmersionMinutes(AppStorage.getImmersionMinutes());
      setStarredPhrases(AppStorage.getStarredPhrases());
      setCompletedSubNodeIds(AppStorage.getCompletedSubNodes());
      setUserProfile(AppStorage.getUserProfile());
    };

    hydrateLocalState();

    // 4. Mostrar Test de Nivelación si acaba de registrarse
    try {
      if (localStorage.getItem('nativa_should_show_placement') === 'true') {
        localStorage.removeItem('nativa_should_show_placement');
        setIsPlacementTestOpen(true);
      }
    } catch { }
    const savedUser = localStorage.getItem('fluentia_user_session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch { }
    }

    // 3. Conexión en vivo con Supabase Auth (si está configurado)
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured) {
      client.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const cloudSession: UserSession = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'STUDENT',
          };
          setUser(cloudSession);
          localStorage.setItem('fluentia_user_session', JSON.stringify(cloudSession));
          await AppStorage.syncFromSupabase(session.user.id);
          hydrateLocalState();
        }
      });

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const cloudSession: UserSession = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'STUDENT',
          };
          setUser(cloudSession);
          localStorage.setItem('fluentia_user_session', JSON.stringify(cloudSession));
          await AppStorage.syncFromSupabase(session.user.id);
          hydrateLocalState();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('fluentia_user_session');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleCompleteSubNode = (subNodeId: string, xpReward: number) => {
    const updated = AppStorage.completeSubNode(subNodeId);
    setCompletedSubNodeIds(updated);

    const nextXp = userXp + xpReward;
    setUserXp(nextXp);
    AppStorage.saveXp(nextXp);

    const updatedMins = AppStorage.addImmersionMinutes(3);
    setImmersionMinutes(updatedMins);

    setActiveSubNode(null);
    soundManager.playVictory();
    triggerCloudSync();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    AppStorage.saveSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  const handleToggleStarPhrase = (line: { en: string; es?: string; phonetic?: string }, lesson: IntensiveLesson) => {
    const cleanId = `${lesson.id}-${line.en.slice(0, 16).replace(/[^a-zA-Z0-9]/g, '-')}`;
    const isNowStarred = AppStorage.toggleStarredPhrase({
      id: cleanId,
      en: line.en,
      es: line.es || '',
      phonetic: line.phonetic,
      context: lesson.step1_dialogue.context,
      lessonId: lesson.id,
      level: lesson.level,
    });
    const updated = AppStorage.getStarredPhrases();
    setStarredPhrases(updated);
    setSrsDeck(generateSrsDeck(completedNodeIds, srsLevelFilter));
    if (isNowStarred) {
      soundManager.playSuccess();
    } else {
      soundManager.playClick();
    }
  };

  const handleFinishImmersionStory = (story: ImmersionStory) => {
    const updatedMins = AppStorage.addImmersionMinutes(story.readingMinutes);
    setImmersionMinutes(updatedMins);
    const addedXp = story.readingMinutes * 10;
    const nextXp = userXp + addedXp;
    setUserXp(nextXp);
    AppStorage.saveXp(nextXp);
    soundManager.playVictory();
    setSelectedImmersionStory(null);
    triggerCloudSync();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);
    setAuthLoading(true);
    soundManager.playClick();

    const client = getSupabaseClient();

    // MODO LOCAL / DEMO SI SUPABASE AÚN NO TIENE CREDENCIALES
    if (!client || !isSupabaseConfigured) {
      setTimeout(() => {
        const fallbackUser: UserSession = {
          id: 'user-' + Date.now(),
          email: emailInput || `estudiante@${APP_NAME.toLowerCase()}.io`,
          role: 'STUDENT',
        };
        setUser(fallbackUser);
        localStorage.setItem('fluentia_user_session', JSON.stringify(fallbackUser));

        AppStorage.saveUserProfile({
          ...AppStorage.getUserProfile(),
          name: fullNameInput.trim() || emailInput.split('@')[0] || 'Estudiante Nativa',
          email: fallbackUser.email
        });

        soundManager.playVictory();
        setAuthLoading(false);
        if (authMode === 'REGISTER') {
          setIsPlacementTestOpen(true);
        }
      }, 500);
      return;
    }

    try {
      if (authMode === 'REGISTER') {
        const { data, error } = await client.auth.signUp({
          email: emailInput.trim(),
          password: passwordInput.trim(),
          options: {
            data: {
              full_name: fullNameInput.trim() || emailInput.split('@')[0]
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          const userSession: UserSession = {
            id: data.user.id,
            email: data.user.email || emailInput,
            role: 'STUDENT'
          };
          setUser(userSession);
          localStorage.setItem('fluentia_user_session', JSON.stringify(userSession));
          await AppStorage.syncToSupabase(data.user.id);
          soundManager.playVictory();
          setAuthSuccessMessage('✓ Cuenta creada exitosamente. Bienvenido a Nativa.');
          setIsPlacementTestOpen(true);
        } else {
          setAuthSuccessMessage('✓ Revisa tu correo electrónico para confirmar tu cuenta.');
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email: emailInput.trim(),
          password: passwordInput.trim()
        });

        if (error) throw error;

        if (data.user) {
          const userSession: UserSession = {
            id: data.user.id,
            email: data.user.email || emailInput,
            role: 'STUDENT'
          };
          setUser(userSession);
          localStorage.setItem('fluentia_user_session', JSON.stringify(userSession));
          await AppStorage.syncFromSupabase(data.user.id);
          // Actualizar estados
          setCompletedNodeIds(AppStorage.getCompletedNodes());
          setCompletedSubNodeIds(AppStorage.getCompletedSubNodes());
          setUserXp(AppStorage.getXp());
          setStreakDays(AppStorage.getStreak());
          setSkillScores(AppStorage.getSkillScores());
          setImmersionMinutes(AppStorage.getImmersionMinutes());
          soundManager.playVictory();
        }
      }
    } catch (err: any) {
      soundManager.playGentleError();
      setAuthError(err?.message || 'Error al conectar con el servidor de autenticación.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    soundManager.playClick();
    const client = getSupabaseClient();

    if (!client || !isSupabaseConfigured) {
      setAuthError('Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en web/.env.local para usar Google OAuth.');
      soundManager.playGentleError();
      return;
    }

    try {
      setAuthLoading(true);
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthLoading(false);
      soundManager.playGentleError();
      setAuthError(err?.message || 'Error al iniciar sesión con Google.');
    }
  };

  const handleGuestDemo = () => {
    const guestUser: UserSession = {
      id: 'guest-session',
      email: `explorador@${APP_NAME.toLowerCase()}.io`,
      role: 'STUDENT',
    };
    setUser(guestUser);
    localStorage.setItem('fluentia_user_session', JSON.stringify(guestUser));
    soundManager.playClick();
  };

  const handleLogout = async () => {
    try {
      const client = getSupabaseClient();
      if (client && isSupabaseConfigured) {
        await client.auth.signOut();
      }
    } catch { }
    setUser(null);
    localStorage.removeItem('fluentia_user_session');
    soundManager.playClick();
  };

  const speakText = (text: string, lineIdx?: number, pitch: number = 1.0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);
    if (lineIdx !== undefined) setActiveAudioIndex(lineIdx);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = audioSpeed;
    utterance.pitch = pitch;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setActiveAudioIndex(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setActiveAudioIndex(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  const stopContinuousDialogue = () => {
    continuousStopRef.current = true;
    setIsContinuousPlaying(false);
    setActiveAudioIndex(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playContinuousDialogue = () => {
    if (!activeLesson || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isContinuousPlaying) {
      stopContinuousDialogue();
      return;
    }

    continuousStopRef.current = false;
    setIsContinuousPlaying(true);
    const lines = activeLesson.step1_dialogue.lines;

    const playLineAt = (index: number) => {
      if (continuousStopRef.current || index >= lines.length) {
        setIsContinuousPlaying(false);
        setActiveAudioIndex(null);
        return;
      }

      setActiveAudioIndex(index);
      const line = lines[index];
      const utterance = new SpeechSynthesisUtterance(line.en);
      utterance.lang = 'en-US';
      utterance.rate = audioSpeed;

      // Variación de tono para distinguir al estudiante del interlocutor
      const isStudent = line.speaker.toLowerCase().includes('david') || line.speaker.toLowerCase().includes('learner');
      utterance.pitch = isStudent ? 1.08 : 0.94;

      utterance.onend = () => {
        if (continuousStopRef.current) {
          setIsContinuousPlaying(false);
          setActiveAudioIndex(null);
          return;
        }
        setTimeout(() => {
          if (!continuousStopRef.current) {
            playLineAt(index + 1);
          }
        }, 450);
      };

      utterance.onerror = () => {
        setIsContinuousPlaying(false);
        setActiveAudioIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    window.speechSynthesis.cancel();
    playLineAt(0);
  };

  // Efecto para sincronizar baraja SRS dinámica según niveles y progreso
  useEffect(() => {
    setSrsDeck(generateSrsDeck(completedNodeIds, srsLevelFilter));
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
  }, [completedNodeIds, srsLevelFilter]);

  // Atajos de teclado accesibles en el Lesson Studio
  useEffect(() => {
    if (!activeLesson) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveLesson(null);
        stopContinuousDialogue();
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (currentStep === 1) {
          if (activeAudioIndex !== null && activeLesson.step1_dialogue.lines[activeAudioIndex]) {
            speakText(activeLesson.step1_dialogue.lines[activeAudioIndex].en, activeAudioIndex);
          } else {
            speakText(activeLesson.step1_dialogue.lines[0]?.en || '', 0);
          }
        } else if (currentStep === 2) {
          speakText(activeLesson.step2_comprehension.audioContextText);
        } else if (currentStep === 3) {
          speakText(activeLesson.step3_builder.correctWords.join(' '));
        } else if (currentStep === 4) {
          speakText(activeLesson.step4_shadowing.phrases[activeShadowingPhraseIdx]?.en || '');
        } else if (currentStep === 5) {
          speakText(activeLesson.step5_monitor.options[activeLesson.step5_monitor.correctIndex]);
        } else if (currentStep === 6) {
          speakText(activeLesson.step6_mastery.options[activeLesson.step6_mastery.correctIndex]);
        }
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        if (currentStep === 2 && activeLesson.step2_comprehension.options[optionIdx]) {
          e.preventDefault();
          setStep2SelectedIdx(optionIdx);
          if (optionIdx === activeLesson.step2_comprehension.correctIndex) {
            soundManager.playSuccess();
          } else {
            soundManager.playGentleError();
          }
        } else if (currentStep === 5 && activeLesson.step5_monitor.options[optionIdx]) {
          e.preventDefault();
          setStep5SelectedIdx(optionIdx);
          if (optionIdx === activeLesson.step5_monitor.correctIndex) {
            soundManager.playSuccess();
          } else {
            soundManager.playGentleError();
          }
        } else if (currentStep === 6 && activeLesson.step6_mastery.options[optionIdx]) {
          e.preventDefault();
          setStep6SelectedIdx(optionIdx);
          if (optionIdx === activeLesson.step6_mastery.correctIndex) {
            soundManager.playSuccess();
          } else {
            soundManager.playGentleError();
          }
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentStep === 3 && builderStatus === 'IDLE' && selectedTokens.length > 0) {
          checkSentenceBuilder();
        } else if (currentStep < 6) {
          setCurrentStep(prev => Math.min(6, prev + 1));
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLesson, currentStep, activeAudioIndex, activeShadowingPhraseIdx, builderStatus, selectedTokens, step2SelectedIdx, step6SelectedIdx]);

  const toggleLineTranslation = (idx: number) => {
    if (revealedLineIndexes.includes(idx)) {
      setRevealedLineIndexes(revealedLineIndexes.filter(i => i !== idx));
    } else {
      setRevealedLineIndexes([...revealedLineIndexes, idx]);
    }
  };

  const getSubNodesCompletionStatus = (lessonId: string) => {
    const required = [
      `${lessonId}-reading`,
      `${lessonId}-listening`,
      `${lessonId}-srs`
    ];
    const completedCount = required.filter(id => completedSubNodeIds.includes(id)).length;
    return {
      completedCount,
      totalCount: 3,
      allDone: completedCount === 3,
    };
  };

  const getNodeStatus = (node: IntensiveLesson) => {
    if (completedNodeIds.includes(node.id)) {
      return 'COMPLETED';
    }
    // Si no tiene prerrequisito (ej. Lección 1.1), está desbloqueada
    if (!node.prerequisiteId) {
      return 'ACTIVE';
    }
    // Regla de Desbloqueo Arquitectura de Nodos Madre:
    // El siguiente Nodo Madre solo se desbloquea si el Nodo Madre anterior está superado
    // Y sus 3 Sub-Nodos de inmersión (reading, listening, srs) están completados
    const prereqMotherDone = completedNodeIds.includes(node.prerequisiteId);
    const prereqSubNodes = getSubNodesCompletionStatus(node.prerequisiteId);

    if (prereqMotherDone && prereqSubNodes.allDone) {
      return 'ACTIVE';
    }
    return 'LOCKED';
  };

  const userHighestLevel = useMemo(() => {
    if (completedNodeIds.some(id => id.startsWith('c2'))) return 'C2';
    if (completedNodeIds.some(id => id.startsWith('c1'))) return 'C1';
    if (completedNodeIds.some(id => id.startsWith('b2'))) return 'B2';
    if (completedNodeIds.some(id => id.startsWith('b1'))) return 'B1';
    if (completedNodeIds.some(id => id.startsWith('a2'))) return 'A2';
    return 'A1';
  }, [completedNodeIds]);

  const bottleneckSkill = useMemo(() => {
    const list = [
      { name: 'Listening (Inmersión Auditiva)', key: 'listening', score: skillScores.listening, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
      { name: 'Speaking (Fonética & Shadowing)', key: 'speaking', score: skillScores.speaking, color: 'text-cyan-400', barBg: 'bg-cyan-500' },
      { name: 'Reading (Lectura Comprensiva)', key: 'reading', score: skillScores.reading, color: 'text-sky-400', barBg: 'bg-sky-500' },
      { name: 'Writing (Proyectos & Cohesión)', key: 'writing', score: skillScores.writing, color: 'text-purple-400', barBg: 'bg-purple-500' },
    ];
    return [...list].sort((a, b) => a.score - b.score)[0];
  }, [skillScores]);

  const filteredLessons = useMemo(() => {
    if (routeLevelFilter === 'ALL') {
      return COMPREHENSIVE_CURRICULUM;
    }
    return COMPREHENSIVE_CURRICULUM.filter(l => l.level === routeLevelFilter);
  }, [routeLevelFilter]);

  const getNodeButtonClass = (lesson: IntensiveLesson, isCompleted: boolean, isActive: boolean, isLocked: boolean) => {
    if (isCompleted) {
      return 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/20 hover:scale-105 active:scale-95';
    }
    if (isLocked) {
      return 'bg-neutral-900 border-2 border-neutral-800 text-neutral-600 cursor-not-allowed opacity-60';
    }
    switch (lesson.level) {
      case 'A1':
        return 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-neutral-950 ring-4 ring-emerald-500/30 shadow-emerald-500/40 hover:scale-105 active:scale-95';
      case 'A2':
        return 'bg-gradient-to-tr from-teal-400 via-cyan-400 to-sky-400 text-neutral-950 ring-4 ring-cyan-500/30 shadow-cyan-500/40 hover:scale-105 active:scale-95';
      case 'B1':
        return 'bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-400 text-white ring-4 ring-sky-500/30 shadow-sky-500/40 hover:scale-105 active:scale-95';
      case 'B2':
        return 'bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-400 text-white ring-4 ring-indigo-500/30 shadow-indigo-500/40 hover:scale-105 active:scale-95';
      case 'C1':
        return 'bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-400 text-white ring-4 ring-purple-500/30 shadow-purple-500/40 hover:scale-105 active:scale-95';
      case 'C2':
        return 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-neutral-950 ring-4 ring-amber-500/30 shadow-amber-500/40 hover:scale-105 active:scale-95';
      default:
        return 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-neutral-950';
    }
  };

  const startLesson = (lesson: IntensiveLesson) => {
    // Verificación de Paywall (Fase 5)
    const isPaywallOn = AppStorage.getPaywallEnabled();
    const isPremium = AppStorage.isUserPremium();
    const isRestrictedLevel = ['B1', 'B2', 'C1', 'C2'].includes(lesson.level.toUpperCase());
    const isCallCenterTrack = languageId === 'call-center' || languageId.includes('call-center');

    if (isPaywallOn && !isPremium && (isRestrictedLevel || isCallCenterTrack)) {
      setPaywallReason(
        isCallCenterTrack
          ? 'El Track de Call Center BPO requiere una suscripción Nativa Premium activa.'
          : `El nivel ${lesson.level} forma parte del plan Nativa Premium (B1 a C2).`
      );
      setIsPaywallModalOpen(true);
      soundManager.playWrong();
      return;
    }

    setActiveLesson(lesson);
    setCurrentStep(1);
    setStep2SelectedIdx(null);
    setSelectedTokens([]);
    setBuilderStatus('IDLE');
    setSelectedStoryEventIds([]);
    setStoryOrderCorrect(null);
    setShadowingSuccess(false);
    setStep5SelectedIdx(null);
    setNoticingExpanded(false);
    setNoticingPragmaticSelection(null);
    setStep6SelectedIdx(null);
    setLessonFinished(false);
    setActiveAudioIndex(null);
    setRevealedLineIndexes([]);
    setSpokenTranscript('');
    setPronunciationResult(null);
    setSpeechError(null);
    setActiveShadowingPhraseIdx(0);
    stopContinuousDialogue();
    soundManager.playClick();
  };

  // Generador de Tokens Únicos para el Sentence Builder (evita conflicto por palabras duplicadas)
  const availableTokens: BuilderToken[] = useMemo(() => {
    if (!activeLesson?.step3_builder) return [];
    return activeLesson.step3_builder.scrambledWords.map((word, idx) => ({
      id: `tok-${idx}-${word}`,
      text: word
    }));
  }, [activeLesson]);

  const handleSelectToken = (token: BuilderToken) => {
    soundManager.playClick();
    setSelectedTokens(prev => [...prev, token]);
    setBuilderStatus('IDLE');
  };

  const handleDeselectToken = (tokenId: string) => {
    soundManager.playClick();
    setSelectedTokens(prev => prev.filter(t => t.id !== tokenId));
    setBuilderStatus('IDLE');
  };

  const handleResetTokens = () => {
    soundManager.playClick();
    setSelectedTokens([]);
    setBuilderStatus('IDLE');
  };

  const handleSelectStoryEvent = (eventId: string) => {
    if (selectedStoryEventIds.includes(eventId)) {
      soundManager.playClick();
      setSelectedStoryEventIds(prev => prev.filter(id => id !== eventId));
      setStoryOrderCorrect(null);
    } else {
      soundManager.playClick();
      const updated = [...selectedStoryEventIds, eventId];
      setSelectedStoryEventIds(updated);
      if (activeLesson?.step3_story_sequence && updated.length === activeLesson.step3_story_sequence.events.length) {
        const events = activeLesson.step3_story_sequence.events;
        const isCorrect = updated.every((id, idx) => {
          const ev = events.find((e: StoryEvent) => e.id === id);
          return ev && ev.order === idx + 1;
        });
        setStoryOrderCorrect(isCorrect);
        if (isCorrect) soundManager.playSuccess();
        else soundManager.playGentleError();
      }
    }
  };

  const handleResetStoryEvents = () => {
    soundManager.playClick();
    setSelectedStoryEventIds([]);
    setStoryOrderCorrect(null);
  };

  const checkSentenceBuilder = () => {
    if (!activeLesson) return;
    const userWords = selectedTokens.map(t => t.text.toLowerCase().trim());
    const correctWords = activeLesson.step3_builder.correctWords.map(w => w.toLowerCase().trim());
    const isCorrect = userWords.length === correctWords.length &&
      userWords.every((word, idx) => word === correctWords[idx]);

    if (isCorrect) {
      setBuilderStatus('CORRECT');
      soundManager.playSuccess();
    } else {
      setBuilderStatus('WRONG');
      soundManager.playGentleError();
    }
  };

  // Reconocimiento de Voz Real (Web Speech API)
  const handleStartSpeechPractice = (targetPhrase: string) => {
    setSpeechError(null);
    setSpokenTranscript('');
    setPronunciationResult(null);
    setIsRecording(true);
    soundManager.playClick();

    const isAvailable = speechEvaluator.initRecognition(
      (interim) => {
        setSpokenTranscript(interim);
      },
      (evaluation) => {
        setIsRecording(false);
        setPronunciationResult(evaluation);
        if (evaluation.isPassing) {
          soundManager.playSuccess();
          setShadowingSuccess(true);
        } else {
          soundManager.playGentleError();
        }
      },
      (err) => {
        setIsRecording(false);
        setSpeechError(err);
      },
      targetPhrase
    );

    if (isAvailable) {
      speechEvaluator.startListening();
    } else {
      // Simulación suave si el navegador no permite acceso al micrófono
      setTimeout(() => {
        setIsRecording(false);
        const sim = speechEvaluator.evaluatePronunciation(targetPhrase, targetPhrase);
        setPronunciationResult(sim);
        setShadowingSuccess(true);
        soundManager.playSuccess();
      }, 2200);
    }
  };

  const handleStopSpeechPractice = () => {
    speechEvaluator.stopListening();
    setIsRecording(false);
    soundManager.playClick();
  };

  const completeLessonAndUnlockNext = () => {
    if (!activeLesson) return;
    if (!completedNodeIds.includes(activeLesson.id)) {
      const nextNodes = [...completedNodeIds, activeLesson.id];
      setCompletedNodeIds(nextNodes);
      AppStorage.saveCompletedNodes(nextNodes);

      const nextXp = userXp + activeLesson.xpReward;
      setUserXp(nextXp);
      AppStorage.saveXp(nextXp);

      // Incrementar scores de habilidades según la lección
      const newSkills = { ...skillScores };
      newSkills.listening = Math.min(100, newSkills.listening + 4);
      newSkills.speaking = Math.min(100, newSkills.speaking + 5);
      newSkills.reading = Math.min(100, newSkills.reading + 3);
      newSkills.writing = Math.min(100, newSkills.writing + 3);
      setSkillScores(newSkills);
      AppStorage.saveSkillScores(newSkills);
      triggerCloudSync();
    }
    soundManager.playVictory();
    setActiveLesson(null);
  };

  const handleEvaluateProject = async (project: AcademicProjectDefinition) => {
    const textToEvaluate = projectTextDraft || projectSubmissions[project.unit]?.content || '';
    if (!textToEvaluate.trim()) return;

    setIsEvaluatingProject(true);
    soundManager.playClick();

    const aiSettings = AiConfigService.getSettings();
    const primary = aiSettings.primaryProvider;
    const activeKey = aiSettings.providers[primary]?.key || '';
    const activeModel = aiSettings.providers[primary]?.model || '';

    try {
      const res = await fetch('/api/ai/evaluate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            unit: project.unit,
            level: project.level,
            title: project.title,
            context: project.context,
            instructions: project.instructions,
            minWords: project.minWords,
            maxWords: project.maxWords,
            requiredKeywords: project.requiredKeywords,
          },
          studentText: textToEvaluate,
          userId: user?.id,
          aiProvider: primary,
          apiKey: activeKey,
          model: activeModel
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const submission: ProjectSubmission = {
          unit: project.unit,
          level: project.level,
          title: project.title,
          submittedAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
          content: textToEvaluate,
          overallScore: data.overallScore,
          wordCount: data.wordCount,
          rubricScores: data.rubricScores,
          feedback: data.feedback,
          tips: data.tips,
          providerUsed: data.providerUsed
        };

        const updated = { ...projectSubmissions, [project.unit]: submission };
        setProjectSubmissions(updated);
        AppStorage.saveProjectSubmission(submission);

        // Otorgar XP y habilidad de Writing
        const nextXp = userXp + 100;
        setUserXp(nextXp);
        AppStorage.saveXp(nextXp);

        const newSkills = { ...skillScores };
        newSkills.writing = Math.min(100, newSkills.writing + 10);
        setSkillScores(newSkills);
        AppStorage.saveSkillScores(newSkills);
        triggerCloudSync();

        soundManager.playVictory();
      } else {
        throw new Error(data.message || 'Error en la respuesta del evaluador.');
      }
    } catch (err) {
      console.error('Error evaluating project with AI:', err);
      // Fallback heurístico inteligente si no hay red o faltan llaves
      const evaluation = evaluateProjectSubmission(project, textToEvaluate);
      const submission: ProjectSubmission = {
        unit: project.unit,
        level: project.level,
        title: project.title,
        submittedAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        content: textToEvaluate,
        overallScore: evaluation.overallScore,
        wordCount: evaluation.wordCount,
        rubricScores: evaluation.rubricScores,
        feedback: evaluation.feedback,
        tips: [
          `1. Meta Comunicativa: Asegúrate de responder de forma exhaustiva a cada requerimiento de la tarea.`,
          `2. Cohesión y Conectores: Incluye nexos discursivos formales como "Furthermore", "Nevertheless" o "Consequently".`,
          `3. Léxico Específico: Incorpora más términos del vocabulario obligatorio de la unidad (${project.requiredKeywords.slice(0, 3).join(', ')}).`
        ],
        providerUsed: 'Evaluador Local TBLT'
      };

      const updated = { ...projectSubmissions, [project.unit]: submission };
      setProjectSubmissions(updated);
      AppStorage.saveProjectSubmission(submission);
      triggerCloudSync();
      soundManager.playVictory();
    } finally {
      setIsEvaluatingProject(false);
    }
  };

  const getNodeXOffset = (index: number) => {
    const offsets = ['justify-center', 'justify-start pl-24', 'justify-center', 'justify-end pr-24'];
    return offsets[index % offsets.length];
  };

  const currentSyllabusLevel = COMPLETE_SYLLABUS.find(l => l.id === selectedSyllabusLevelId) || COMPLETE_SYLLABUS[0];

  // =========================================================================
  // VISTA 1: PANTALLA DE BIENVENIDA Y ACCESO PREMIUM (FLUENTIA)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#05070c] text-neutral-100 flex flex-col font-sans relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300">

        {/* Glow de Fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

        {/* Patrón de Rejilla */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Header */}
        <header className="relative z-20 border-b border-neutral-800/60 bg-[#070a10]/70 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
          <FluentiaLogo size="lg" />

          <div className="flex items-center gap-4">
            <button
              onClick={handleGuestDemo}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 transition shadow-sm hover:border-emerald-500/40"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Explorar Modo Invitado</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Teoría Stephen Krashen (SLA) • Clases Intensivas de 6 Etapas</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Adquiere el idioma de forma intuitiva,{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  con inmersión activa profunda.
                </span>
              </h1>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                Cada lección es una sesión completa de 6 etapas: Inmersión Sonora, Comprensión Gist, Constructor de Frases, Laboratorio de Shadowing, Reparación del Monitor y Reto de Desbloqueo.
              </p>
            </div>

            {/* Vitrina Curricular del Manual */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0b0f18] to-[#080b11] border border-neutral-800/90 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Estructura Curricular Universitaria (MCER A1 hasta C2 • 24 Lecciones)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Progresión Bloqueada
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <span className="font-extrabold text-emerald-400 font-mono text-[11px] block">MÓDULO 1 • A1</span>
                  <p className="text-[11px] text-neutral-300">To Be, Identidad, Demostrativos y Rutinas.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <span className="font-extrabold text-teal-400 font-mono text-[11px] block">MÓDULO 2 • A2</span>
                  <p className="text-[11px] text-neutral-300">Pasado Simple, Comparativos y Planes Futuros.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <span className="font-extrabold text-sky-400 font-mono text-[11px] block">MÓDULO 3 • B1</span>
                  <p className="text-[11px] text-neutral-300">Presente Perfecto, Condicionales y Procesos.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <span className="font-extrabold text-indigo-400 font-mono text-[11px] block">MÓDULO 4 • B2</span>
                  <p className="text-[11px] text-neutral-300">Cleft Sentences, Debate Oxford y Pasiva Avanzada.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <span className="font-extrabold text-purple-400 font-mono text-[11px] block">MÓDULO 5 • C1</span>
                  <p className="text-[11px] text-neutral-300">Inversión Enfática, Subjuntivo y Hedging Científico.</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1">
                  <span className="font-extrabold text-amber-400 font-mono text-[11px] block">MÓDULO 6 • C2</span>
                  <p className="text-[11px] text-neutral-300">Pragmática, Papers Indexados y Defensa Doctoral.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Formulario de Acceso */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#090d15]/95 border border-neutral-800/90 rounded-[28px] p-8 shadow-2xl backdrop-blur-2xl space-y-6">

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold">
                    Portal de Estudiantes
                  </span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border ${isSupabaseConfigured ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30' : 'text-amber-300 bg-amber-950/60 border-amber-500/30'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    {isSupabaseConfigured ? 'Supabase Cloud' : 'Modo Demo Local'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {authMode === 'LOGIN' ? `Bienvenido a ${APP_NAME}` : 'Crea tu Cuenta de Estudio'}
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {authMode === 'LOGIN'
                    ? 'Inicia sesión para sincronizar tu camino y racha de aprendizaje en la nube.'
                    : 'Regístrate para guardar tu progreso con Supabase PostgreSQL.'}
                </p>
              </div>

              {/* Botón de Autenticación con Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-neutral-800 w-full" />
                <span className="bg-[#090d15] px-3 text-[10px] font-mono text-neutral-500 uppercase shrink-0">o con email</span>
                <div className="border-t border-neutral-800 w-full" />
              </div>

              {/* Toggle Login / Register */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setAuthError(null);
                    setAuthSuccessMessage(null);
                  }}
                  className={`py-2 rounded-xl font-bold transition ${authMode === 'LOGIN'
                    ? 'bg-neutral-850 text-white shadow-md border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('REGISTER');
                    setAuthError(null);
                    setAuthSuccessMessage(null);
                  }}
                  className={`py-2 rounded-xl font-bold transition ${authMode === 'REGISTER'
                    ? 'bg-neutral-850 text-white shadow-md border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'REGISTER' && (
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        placeholder="David Abarca"
                        className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="tu-correo@ejemplo.com"
                      className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{authSuccessMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-neutral-950 font-black py-3 rounded-xl text-xs transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{authLoading ? 'Verificando...' : authMode === 'LOGIN' ? 'Entrar a Mi Cuenta' : 'Crear Cuenta y Comenzar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleGuestDemo}
                  className="text-xs text-neutral-400 hover:text-emerald-400 transition underline underline-offset-4 cursor-pointer"
                >
                  O explora directamente como Invitado sin registrarte
                </button>
              </div>

            </div>
          </div>

        </main>
      </div>
    );
  }

  const activeTheme = activeLesson ? (LEVEL_THEMES[activeLesson.level] || LEVEL_THEMES.A1) : LEVEL_THEMES.A1;

  // =========================================================================
  // VISTA 2: DASHBOARD PRINCIPAL CON NAVEGADOR DE VISTAS (PATH vs SYLLABUS vs TBLT vs SRS)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300 relative">

      {/* Luz Ambiental Premium Dark Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#07090e] to-[#040609] -z-10" />
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[180px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[180px] pointer-events-none -z-10" />

      {/* Header Superior Móvil */}
      <header className="md:hidden sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <FluentiaGlyph size="xs" />
            <span className="font-outfit font-black text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {APP_NAME.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-bold">
              {userHighestLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{streakDays}d</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-xl shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>{userXp} XP</span>
          </div>
        </div>
      </header>

      {/* Backdrop Móvil */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR DE CONTROL (Desktop + Mobile Drawer) ================= */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-slate-800/80 bg-[#090d16] md:bg-[#090d16]/95 backdrop-blur-2xl flex flex-col shrink-0 p-5 space-y-4 overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}>

        {/* Brand & Botón Cerrar en Móvil */}
        <div className="flex items-center justify-between">
          <FluentiaLogo size="md" />

          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Header Unificado: Perfil + Nivel + Bandera / Idioma + Menú de Cuenta */}
        <div className="relative" ref={accountMenuRef}>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition shadow-xs">
            {/* Avatar + Nombre + Nivel */}
            <button
              onClick={() => {
                setIsAccountMenuOpen(!isAccountMenuOpen);
                soundManager.playClick();
              }}
              className="flex items-center gap-2 min-w-0 text-left cursor-pointer flex-1 group"
              title="Opciones de cuenta y configuración"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.avatarEmoji || '👨‍🎓'}</span>
                )}
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white block truncate transition">
                    {userProfile.name}
                  </span>
                  {isUserPremium ? (
                    <span title="Nativa Premium Activo" className="inline-flex items-center">
                      <Crown className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaywallReason('Desbloquea los niveles B1 a C2 y todas las funciones PRO.');
                        setIsPaywallModalOpen(true);
                        soundManager.playClick();
                      }}
                      title="Obtener Nativa Premium (B1-C2)"
                      className="text-amber-400/70 hover:text-amber-400 hover:scale-110 transition shrink-0"
                    >
                      <Crown className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {userHighestLevel} • @{userProfile.username}
                </span>
              </div>
            </button>

            {/* Bandera / Hub + Botón Ajustes */}
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <Link
                href="/dashboard"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
                title={`Volver a Mi Panel de Estudio (Idioma: ${currentLanguageEntry.name})`}
              >
                <span className="text-sm leading-none">{currentLanguageEntry.flag}</span>
              </Link>
              <button
                onClick={() => {
                  setIsAccountMenuOpen(!isAccountMenuOpen);
                  soundManager.playClick();
                }}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${isAccountMenuOpen ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}`}
                title="Menú de Cuenta y Ajustes"
                aria-expanded={isAccountMenuOpen}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Dropdown de Acciones Secundarias (Test Nivelación, Premium, Certificados, Perfil, Salir) */}
          <AnimatePresence>
            {isAccountMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-1.5 z-40 p-1.5 bg-[#0c1017] border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl space-y-0.5"
              >
                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsPlacementTestOpen(true);
                    soundManager.playClick();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Test de Nivelación</span>
                  </div>
                  <span className="text-[9px] font-mono bg-purple-950/60 border border-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded font-bold">
                    Adaptativo
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (!isUserPremium) {
                      setPaywallReason('Desbloquea los niveles B1 a C2 y soporte IA avanzado.');
                    }
                    setIsPaywallModalOpen(true);
                    soundManager.playClick();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUserPremium ? 'Suscripción Premium' : 'Obtener Premium'}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${isUserPremium ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-950/60 border border-amber-500/30 text-amber-300'}`}>
                    {isUserPremium ? 'ACTIVO' : 'PRO'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsCertificatesModalOpen(true);
                    soundManager.playClick();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mis Certificados</span>
                  </div>
                  <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    PDF
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsProfileModalOpen(true);
                    soundManager.playClick();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mi Perfil</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    Editar
                  </span>
                </button>

                <div className="h-px bg-slate-800/80 my-1" />

                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Stats Gamer: Barra horizontal limpia y luminosa */}
        <div className="flex items-center justify-between px-2 py-1 text-xs font-mono select-none">
          <div className="flex items-center gap-1.5 text-amber-400" title="Racha de estudio diario">
            <Flame className="w-3.5 h-3.5 fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            <span className="font-extrabold tracking-tight">{streakDays}d</span>
          </div>
          <span className="text-slate-700 font-mono text-[11px]">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400" title="Puntos de experiencia acumulados">
            <Zap className="w-3.5 h-3.5 fill-current drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="font-extrabold tracking-tight">{userXp} XP</span>
          </div>
          <span className="text-slate-700 font-mono text-[11px]">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400" title="Minutos de inmersión acumulados">
            <Headphones className="w-3.5 h-3.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
            <span className="font-extrabold tracking-tight">{immersionMinutes}m</span>
          </div>
        </div>

        {/* 4. Misión Diaria Gamer (Elemento llamativo destacado para no perder la racha) */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-black flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              Misión Diaria
            </span>
            <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded-full shadow-xs">
              +30 XP
            </span>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-white font-bold leading-snug">
              Potencia tu {bottleneckSkill.name.split(' ')[0]}
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Consolida tu racha hoy con práctica activa de repaso SRS o voz.
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={() => {
                setCurrentView('REVIEW');
                soundManager.playClick();
              }}
              className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Iniciar Práctica</span>
            </button>
            <button
              onClick={() => {
                setIsDailyVocabOpen(true);
                soundManager.playClick();
              }}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-amber-500/30 text-amber-300 transition shrink-0 cursor-pointer"
              title="Cofre de Palabras Diarias (+15 XP)"
            >
              <Gift className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* 5. Selector de Vista Principal: 5 Modos con estilo sutil gamer */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block px-1">
            Modos de Vista
          </span>
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs shadow-inner">
            {[
              { id: 'PATH', label: 'Ruta', icon: MapPin },
              { id: 'IMMERSION', label: 'Inmersión', icon: BookOpen },
              { id: 'SYLLABUS', label: 'Temario', icon: ListTree },
              { id: 'PROJECTS', label: 'Taller', icon: FileText },
              { id: 'REVIEW', label: 'SRS', icon: Brain },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentView(tab.id as any);
                    setIsMobileDrawerOpen(false);
                    soundManager.playClick();
                  }}
                  className={`py-1.5 px-1 rounded-lg font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white font-black shadow-xs border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[9px]">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Destrezas SLA Compactas: 4 Barras Horizontales con Toggle a Radar */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Destrezas SLA
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSlaViewMode(slaViewMode === 'BARS' ? 'RADAR' : 'BARS')}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Alternar entre barras y gráfico radar"
              >
                {slaViewMode === 'BARS' ? 'Radar' : 'Barras'}
              </button>
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido Zen'}
                className="text-slate-400 hover:text-emerald-400 p-0.5 rounded transition hover:bg-slate-800 cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>

          {slaViewMode === 'BARS' ? (
            <div className="space-y-1.5 pt-0.5">
              {[
                { label: 'Listening', score: skillScores.listening, color: 'bg-emerald-400', textColor: 'text-emerald-400', icon: Headphones },
                { label: 'Speaking', score: skillScores.speaking, color: 'bg-cyan-400', textColor: 'text-cyan-400', icon: Mic },
                { label: 'Reading', score: skillScores.reading, color: 'bg-sky-400', textColor: 'text-sky-400', icon: BookOpen },
                { label: 'Writing', score: skillScores.writing, color: 'bg-purple-400', textColor: 'text-purple-400', icon: FileText },
              ].map((skill) => (
                <div key={skill.label} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <skill.icon className={`w-3 h-3 ${skill.textColor}`} />
                      {skill.label}
                    </span>
                    <span className={`font-bold ${skill.textColor}`}>{skill.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(5, skill.score))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="origin-top scale-90 py-1">
              <RadarSkillsChart scores={skillScores} />
            </div>
          )}
        </div>

        {/* 7. Módulos Oficiales (A1 → C2) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block px-1">
            Módulos Oficiales (A1 → C2)
          </span>
          <div className="space-y-1">
            {[
              { lvl: 'Módulo 1: A1 Fundamentos', code: 'A1', done: `${completedNodeIds.filter(id => id.startsWith('a1')).length}/4`, active: true, dot: 'bg-emerald-400' },
              { lvl: 'Módulo 2: A2 Comunicación', code: 'A2', done: `${completedNodeIds.filter(id => id.startsWith('a2')).length}/4`, active: completedNodeIds.includes('a1-lesson-4'), dot: 'bg-cyan-400' },
              { lvl: 'Módulo 3: B1 Independencia', code: 'B1', done: `${completedNodeIds.filter(id => id.startsWith('b1')).length}/4`, active: completedNodeIds.includes('a2-lesson-4'), dot: 'bg-blue-400' },
              { lvl: 'Módulo 4: B2 Académico', code: 'B2', done: `${completedNodeIds.filter(id => id.startsWith('b2')).length}/4`, active: completedNodeIds.includes('b1-lesson-4'), dot: 'bg-purple-400' },
              { lvl: 'Módulo 5: C1 Avanzado EAP', code: 'C1', done: `${completedNodeIds.filter(id => id.startsWith('c1')).length}/4`, active: completedNodeIds.includes('b2-lesson-4'), dot: 'bg-rose-400' },
              { lvl: 'Módulo 6: C2 Maestría Doctoral', code: 'C2', done: `${completedNodeIds.filter(id => id.startsWith('c2')).length}/4`, active: completedNodeIds.includes('c1-lesson-4'), dot: 'bg-amber-400' },
            ].map((item, idx) => {
              const isSelected = routeLevelFilter === item.code && currentView === 'PATH';
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setRouteLevelFilter(item.code as any);
                    setCurrentView('PATH');
                    soundManager.playClick();
                  }}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-2 rounded-xl border transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-slate-700 text-white font-bold shadow-xs'
                      : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.active ? (
                      <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                    <span className={item.active ? (isSelected ? 'font-bold text-white' : 'text-slate-300') : 'text-slate-500'}>
                      {item.lvl}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.done}</span>
                </button>
              );
            })}
          </div>
        </div>

      </aside>

      {/* ================= CONTENIDO CENTRAL ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* VISTA 1: CAMINO UNIVERSITARIO DE APRENDIZAJE (MODULAR) */}
        {currentView === 'PATH' && (
          <LearningMap
            lessons={COMPREHENSIVE_CURRICULUM}
            completedNodeIds={completedNodeIds}
            completedSubNodeIds={completedSubNodeIds}
            languageId={languageId}
            routeLevelFilter={routeLevelFilter}
            onFilterChange={setRouteLevelFilter}
            activePopoverLessonId={activePopoverLessonId}
            hoveredLessonId={hoveredLessonId}
            onHoverLesson={setHoveredLessonId}
            onSelectLesson={setActivePopoverLessonId}
            onStartLesson={(lesson) => {
              startLesson(lesson);
            }}
            onSubNodeClick={(subNode) => {
              setActiveSubNode(subNode);
            }}
            onOpenTopicLibrary={(lesson) => {
              setSelectedLibraryLesson(lesson);
              setIsLibraryOpen(true);
            }}
          />
        )}

        {/* VISTA 2: BIBLIOTECA DE INMERSIÓN MASIVA (MODULAR) */}
        {currentView === 'IMMERSION' && (
          <ImmersionViewer
            immersionMinutes={immersionMinutes}
            selectedStory={selectedImmersionStory}
            immersionLevelFilter={immersionLevelFilter}
            isPlayingAudio={activeAudioIndex !== null}
            onSelectStory={setSelectedImmersionStory}
            onFilterChange={setImmersionLevelFilter}
            onSpeakText={(text) => speakText(text)}
            onStopAudio={() => stopContinuousDialogue()}
            onFinishStory={(story) => handleFinishImmersionStory(story)}
          />
        )}

        {/* VISTA 2: TEMARIO Y NIVELES DETALLADOS (SYLLABUS & LEVELS EXPLORER) */}
        {currentView === 'SYLLABUS' && (
          <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 pb-28 md:pb-8">

            {/* Header del Temario Universitario */}
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                    Currículo Universitario • Estándar MCER (A1 – C2)
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">6 Niveles de Educación Superior & EAP</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Estándar Oxford, Cambridge & Krashen SLA</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Temario Universitario Completo y Proyectos por Tareas
              </h1>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Estructura curricular universitaria basada en <strong className="text-slate-200">Task-Based Learning</strong> y el Marco Común Europeo de Referencia. Cada nivel integra comprensión auditiva (Listening), lectura crítica (Reading), oratoria académica (Speaking) y redacción técnica (Writing), complementada con la hipótesis $i+1$ y el filtro afectivo de Stephen Krashen.
              </p>

              {/* Selector de Nivel CEFR (6 Niveles: A1 a C2) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
                {COMPLETE_SYLLABUS.map((lvl) => {
                  const isSelected = selectedSyllabusLevelId === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedSyllabusLevelId(lvl.id)}
                      className={`p-3 rounded-2xl border text-left transition duration-200 relative overflow-hidden ${isSelected
                        ? 'bg-[#0f172a] border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-[#0c111c] border-slate-800 hover:border-slate-700 hover:bg-[#111928] text-slate-300 shadow-xs'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded ${lvl.colorScheme.badgeBg} ${lvl.colorScheme.badgeText}`}>
                          {lvl.level}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                      </div>
                      <h4 className="text-xs font-bold text-white mt-2 line-clamp-1">
                        {lvl.title.split('•')[1] || lvl.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">
                        {lvl.mcerBadge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalle del Nivel Seleccionado */}
            <div className="space-y-8">

              {/* Tarjeta de Resumen del Nivel */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      {currentSyllabusLevel.mcerBadge}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white mt-0.5">
                      {currentSyllabusLevel.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#080c14] px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentSyllabusLevel.sublevels.reduce((a, b) => a + b.estimatedHours, 0)} Horas Lectivas</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
                  {currentSyllabusLevel.globalObjective}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                    <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-200 block">Cuello de Botella Pedagógico (SLA):</span>
                      <p className="text-[11px] text-amber-300/80 leading-relaxed">
                        {currentSyllabusLevel.pedagogicalBottleneck}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3">
                    <GraduationCap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-blue-200 block">Alcance Académico Universitario:</span>
                      <p className="text-[11px] text-blue-300/80 leading-relaxed">
                        {currentSyllabusLevel.academicScope}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose de Subniveles Oficiales */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>Módulos de Especialidad y Habilidades Comunicativas</span>
                </h3>

                <div className="space-y-6">
                  {currentSyllabusLevel.sublevels.map((sublevel) => (
                    <div
                      key={sublevel.code}
                      className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-6 shadow-sm"
                    >
                      {/* Cabecera del Subnivel */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black font-mono px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm">
                            {sublevel.code}
                          </span>
                          <div>
                            <h4 className="text-sm md:text-base font-bold text-white">{sublevel.title}</h4>
                            <p className="text-xs text-slate-400">{sublevel.summary}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-slate-300 bg-[#080c14] px-2.5 py-1 rounded-lg border border-slate-800">{sublevel.estimatedHours} horas</span>
                          <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg text-[10px] font-bold">
                            {sublevel.targetCompetence}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Temas del Subnivel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sublevel.topics.map((topic) => (
                          <div
                            key={topic.number}
                            className="p-5 rounded-2xl bg-[#080c14] border border-slate-800/80 space-y-3.5 hover:border-emerald-500/40 hover:bg-[#0b101b] transition flex flex-col justify-between shadow-xs"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                  Tema {topic.number}
                                </span>
                                <Target className="w-3.5 h-3.5 text-slate-400" />
                              </div>

                              <h5 className="text-sm font-bold text-white">{topic.title}</h5>

                              <div className="space-y-2 text-xs">
                                <div>
                                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Gramática Clave</span>
                                  <p className="text-slate-300 leading-relaxed">{topic.grammarFocus}</p>
                                </div>
                                <div>
                                  <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block">Vocabulario y Léxico</span>
                                  <p className="text-slate-300 leading-relaxed">{topic.vocabularyLexicon}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                                  <span className="text-purple-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 block">
                                    <Award className="w-3.5 h-3.5" />
                                    <span>Proyecto / Habilidad Comunicativa:</span>
                                  </span>
                                  <p className="text-purple-200 text-xs mt-1 leading-snug">{topic.academicProject}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3 pt-2">
                              {/* Ejemplos Clave */}
                              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Modelos de Inmersión:</span>
                                {topic.keyExamples.map((ex, i) => (
                                  <div key={i} className="text-[11px] space-y-0.5 bg-[#0e1626] p-2.5 rounded-xl border border-slate-800 shadow-xs">
                                    <p className="text-slate-100 font-medium">&ldquo;{ex.en}&rdquo;</p>
                                    <p className="text-slate-400 text-[10px]">{ex.es}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Píldora Krashen SLA */}
                              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed">
                                💡 <strong>Insight SLA:</strong> {topic.slaInsight}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Marco de Evaluación Universitaria Oficial (Rúbricas MCER) */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Criterios de Evaluación Universitaria Internacional</h3>
                    <p className="text-xs text-slate-400">Rúbricas aplicadas por universidades prestigiosas para Speaking y Writing</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {UNIVERSITY_PEDAGOGICAL_FRAMEWORK.rubrics.map((rubric, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#080c14] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                          PESO {rubric.weightPercentage}%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white pt-1">{rubric.criterion}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{rubric.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metodología Pedagógica: Flipped Classroom & Krashen SLA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">{UNIVERSITY_PEDAGOGICAL_FRAMEWORK.methodology.flippedClassroom.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30 inline-block">
                    {UNIVERSITY_PEDAGOGICAL_FRAMEWORK.methodology.flippedClassroom.ratio}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {UNIVERSITY_PEDAGOGICAL_FRAMEWORK.methodology.flippedClassroom.principle}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">{UNIVERSITY_PEDAGOGICAL_FRAMEWORK.methodology.authenticMaterials.title}</h4>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {UNIVERSITY_PEDAGOGICAL_FRAMEWORK.methodology.authenticMaterials.stages.map((stg, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold shrink-0">
                          {stg.level}
                        </span>
                        <span className="text-slate-400 text-[11px]">{stg.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plan de Estudio Diario de 45 Minutos */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c111c]/90 border border-emerald-500/30 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold font-mono">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Plan Diario Universitario de Adquisición (45 Minutos)</h3>
                    <p className="text-xs text-slate-400">Rutina calibrada bajo los 3 principios de Stephen Krashen (Input $i+1$, Filtro Zen y Monitor)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {DAILY_STUDY_PLAN.blocks.map((block, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#080c14] border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {block.timeMinutes} MINUTOS
                      </span>
                      <h4 className="text-xs font-bold text-white pt-1">{block.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{block.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </main>
        )}

        {/* =========================================================================
            VISTA 3: TALLER DE PROYECTOS ACADÉMICOS UNIVERSITARIOS (TBLT)
        ========================================================================= */}
        {currentView === 'PROJECTS' && (
          <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 pb-28 md:pb-8">

            {/* Header del Taller de Proyectos */}
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30 font-bold uppercase">
                    Metodología TBLT • Enfoque por Tareas Reales
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">6 Proyectos Oficiales Universitarios (A1 – C2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{Object.keys(projectSubmissions).length} de 6 Evaluados</span>
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <FileText className="w-7 h-7 text-purple-400" />
                  <span>Taller de Proyectos y Producción Académica</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
                  Aplica lo adquirido en tus clases redactando tareas reales (Cartas de admisión, normas de laboratorio, CVs ejecutivos, debates Oxford, papers indexados y defensa doctoral) evaluadas por las 4 rúbricas de Oxford/Cambridge.
                </p>
              </div>

              {/* Selector de Unidades de Proyectos */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {ACADEMIC_PROJECTS.map((proj) => {
                  const isSelected = selectedProjectUnit === proj.unit;
                  const isSubmitted = !!projectSubmissions[proj.unit];
                  return (
                    <button
                      key={proj.unit}
                      onClick={() => {
                        setSelectedProjectUnit(proj.unit);
                        setProjectTextDraft(projectSubmissions[proj.unit]?.content || '');
                        soundManager.playClick();
                      }}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 shrink-0 ${isSelected
                        ? 'bg-purple-950/60 text-purple-200 border-2 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                        : 'bg-[#0c111c] text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-[#111928]'
                        }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] ${isSubmitted ? 'bg-emerald-500 text-slate-950 font-black' : isSelected ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}>
                        U{proj.unit}
                      </span>
                      <span>{proj.level} • {proj.badge}</span>
                      {isSubmitted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Espacio de Trabajo del Proyecto Seleccionado */}
            {(() => {
              const currentProj = ACADEMIC_PROJECTS.find(p => p.unit === selectedProjectUnit) || ACADEMIC_PROJECTS[0];
              const submission = projectSubmissions[currentProj.unit];
              const draftText = projectTextDraft !== undefined ? projectTextDraft : (submission?.content || '');
              const wordCount = draftText.trim().split(/\s+/).filter(Boolean).length;
              const isLengthValid = wordCount >= currentProj.minWords && wordCount <= currentProj.maxWords * 1.3;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Columna Izquierda: Editor y Pautas */}
                  <div className="lg:col-span-7 space-y-6">

                    {/* Tarjeta de Instrucciones del Proyecto */}
                    <div className="p-5 rounded-2xl bg-[#0c111c]/90 border border-slate-800 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-md">
                          Unidad {currentProj.unit} • Nivel MCER {currentProj.level}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Meta: {currentProj.minWords} – {currentProj.maxWords} palabras
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-white">{currentProj.title}</h2>
                      <p className="text-xs text-slate-400 leading-relaxed">{currentProj.context}</p>

                      <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-[10px] uppercase font-mono tracking-wider block text-emerald-400">
                          📋 Instrucción de la Tarea:
                        </span>
                        <p>{currentProj.instructions}</p>
                      </div>
                    </div>

                    {/* Palabras Clave Obligatorias (Live Match) */}
                    <div className="p-4 rounded-2xl bg-[#0c111c]/90 border border-slate-800 space-y-2 shadow-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                        Léxico Académico Requerido (AWL):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentProj.requiredKeywords.map((kw, kwIdx) => {
                          const isMatched = draftText.toLowerCase().includes(kw.toLowerCase());
                          return (
                            <span
                              key={kwIdx}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition flex items-center gap-1.5 ${isMatched
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold shadow-xs'
                                : 'bg-[#080c14] border-slate-800 text-slate-500'
                                }`}
                            >
                              {isMatched ? <Check className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3 text-slate-500" />}
                              <span>{kw}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Área de Redacción */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="font-bold text-slate-300">Tu Redacción en Inglés:</span>
                        <span className={`font-mono font-bold ${isLengthValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {wordCount} palabras {wordCount < currentProj.minWords && `(mínimo ${currentProj.minWords})`}
                        </span>
                      </div>

                      {/* Barra de Herramientas de Formato (Rich Text) y Conectores de Discurso */}
                      <div className="p-2.5 rounded-xl bg-[#090e18] border border-slate-800 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">Formato:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectTextDraft((prev) => (prev || '') + ' **texto** ');
                                soundManager.playClick();
                              }}
                              title="Negrita"
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono transition"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectTextDraft((prev) => (prev || '') + ' *texto* ');
                                soundManager.playClick();
                              }}
                              title="Cursiva"
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-serif italic transition"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectTextDraft((prev) => (prev || '') + '\n- ');
                                soundManager.playClick();
                              }}
                              title="Lista de Puntos"
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                            >
                              <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectTextDraft((prev) => (prev || '') + '\n> ');
                                soundManager.playClick();
                              }}
                              title="Cita Académica"
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                            >
                              <Quote className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded-md">
                            Rúbrica TBLT Cambridge
                          </span>
                        </div>

                        {/* Conectores Académicos de Alta Cohesión */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold mr-1">Conectores:</span>
                          {[
                            'Furthermore,',
                            'Nevertheless,',
                            'Consequently,',
                            'In contrast,',
                            'Moreover,',
                            'Therefore,'
                          ].map((connector) => (
                            <button
                              key={connector}
                              type="button"
                              onClick={() => {
                                setProjectTextDraft((prev) => {
                                  const cur = prev || '';
                                  const space = cur && !cur.endsWith(' ') ? ' ' : '';
                                  return cur + space + connector + ' ';
                                });
                                soundManager.playClick();
                              }}
                              className="px-2 py-0.5 rounded-md bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-mono transition hover:scale-105"
                            >
                              +{connector}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={draftText}
                        onChange={(e) => setProjectTextDraft(e.target.value)}
                        placeholder={`Escribe aquí tu proyecto... Ejemplo:\n${currentProj.suggestedPrompt}`}
                        rows={8}
                        className="w-full p-4 rounded-2xl bg-[#080c14] border-2 border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition resize-y font-sans leading-relaxed shadow-sm"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            setProjectTextDraft(currentProj.suggestedPrompt);
                            soundManager.playClick();
                          }}
                          className="text-xs text-slate-400 hover:text-purple-400 transition underline underline-offset-4"
                        >
                          Cargar borrador modelo guiado
                        </button>

                        <button
                          onClick={() => handleEvaluateProject(currentProj)}
                          disabled={isEvaluatingProject || wordCount < 5}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-purple-600/20"
                        >
                          {isEvaluatingProject ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Analizando Rúbricas...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Evaluar y Enviar Proyecto</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Columna Derecha: Rúbricas Oficiales y Evaluación */}
                  <div className="lg:col-span-5 space-y-5">

                    {submission ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-3xl bg-[#0c111c]/95 border-2 border-purple-500/40 shadow-xl space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                              <Award className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                                Rúbrica Oficial Calificada
                              </span>
                              <span className="text-xs text-slate-400">Entregado el {submission.submittedAt}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-black text-white font-mono">{submission.overallScore}</span>
                            <span className="text-xs text-slate-400 font-mono">/100</span>
                          </div>
                        </div>

                        {/* Desglose de las 4 Dimensiones */}
                        <div className="space-y-3 pt-2 border-t border-slate-800">
                          {[
                            { name: 'Task Achievement (Logro)', score: submission.rubricScores.taskAchievement, max: 25, color: 'text-emerald-400', bg: 'bg-emerald-500' },
                            { name: 'Coherence & Cohesion (Cohesión)', score: submission.rubricScores.coherenceCohesion, max: 25, color: 'text-cyan-400', bg: 'bg-cyan-500' },
                            { name: 'Lexical Resource (Léxico AWL)', score: submission.rubricScores.lexicalResource, max: 25, color: 'text-blue-400', bg: 'bg-blue-500' },
                            { name: 'Grammatical Accuracy (Gramática)', score: submission.rubricScores.grammaticalAccuracy, max: 25, color: 'text-purple-400', bg: 'bg-purple-500' },
                          ].map((dim, dIdx) => (
                            <div key={dIdx} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300 font-medium">{dim.name}</span>
                                <span className={`font-mono font-bold ${dim.color}`}>{dim.score} / {dim.max}</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div className={`h-full rounded-full ${dim.bg}`} style={{ width: `${(dim.score / dim.max) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Feedback Pedagógico del Tribunal */}
                        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed space-y-1.5">
                          <span className="font-bold font-mono text-[10px] text-purple-300 uppercase tracking-wider block flex items-center gap-1.5">
                            <CheckCheck className="w-3.5 h-3.5 text-purple-400" />
                            Dictamen del Comité Académico:
                          </span>
                          <p>{submission.feedback}</p>
                        </div>

                        {/* 3 Consejos Específicos de Mejora (Rúbrica TBLT) */}
                        {submission.tips && submission.tips.length > 0 && (
                          <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/40 text-xs text-amber-200 leading-relaxed space-y-2.5">
                            <span className="font-bold font-mono text-[10px] text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              3 Consejos de Mejora Inmediata (Oxford/Cambridge):
                            </span>
                            <ul className="space-y-2">
                              {submission.tips.map((tip, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2 text-slate-300">
                                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {tIdx + 1}
                                  </span>
                                  <span className="leading-snug">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Proveedor de IA utilizado */}
                        {submission.providerUsed && (
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                            <span>Motor IA Evaluador:</span>
                            <span className="text-purple-300 bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded text-[10px]">
                              {submission.providerUsed}
                            </span>
                          </div>
                        )}

                        {/* Botón para Reescribir / Perfeccionar */}
                        <button
                          onClick={() => {
                            setProjectTextDraft(submission.content);
                            soundManager.playClick();
                          }}
                          className="w-full py-2.5 rounded-xl border border-purple-500/40 hover:bg-purple-950/40 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reescribir / Perfeccionar con los Consejos</span>
                        </button>

                        <div className="text-center pt-2">
                          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                            ✓ Certificación de Unidad Acreditada (+75 XP)
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Guía de Rúbricas antes de enviar */
                      <div className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-4 shadow-sm">
                        <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold block flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          Rúbricas de Evaluación (Oxford Standard)
                        </span>

                        <div className="space-y-3 text-xs">
                          <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 space-y-1">
                            <span className="font-bold text-white block">1. Task Achievement (25%)</span>
                            <p className="text-slate-400 leading-normal">{currentProj.rubricGuidance.taskAchievementTip}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 space-y-1">
                            <span className="font-bold text-white block">2. Coherence & Cohesion (25%)</span>
                            <p className="text-slate-400 leading-normal">{currentProj.rubricGuidance.coherenceTip}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 space-y-1">
                            <span className="font-bold text-white block">3. Lexical Resource (25%)</span>
                            <p className="text-slate-400 leading-normal">{currentProj.rubricGuidance.lexicalTip}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 space-y-1">
                            <span className="font-bold text-white block">4. Grammatical Accuracy (25%)</span>
                            <p className="text-slate-400 leading-normal">{currentProj.rubricGuidance.accuracyTip}</p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })()}

          </main>
        )}

        {/* VISTA 4: REPASO ESPACIADO INTELIGENTE (MODULAR) */}
        {currentView === 'REVIEW' && (
          <SrsGame
            srsDeck={srsDeck}
            currentCardIndex={currentCardIndex}
            isCardFlipped={isCardFlipped}
            srsLevelFilter={srsLevelFilter}
            srsCardsReviewedCount={srsCardsReviewedCount}
            userXp={userXp}
            onFilterChange={(lvl) => setSrsLevelFilter(lvl)}
            onCardFlip={(flipped) => setIsCardFlipped(flipped)}
            onNextCard={() => setCurrentCardIndex(prev => (prev + 1) % Math.max(1, srsDeck.length))}
            onReviewCard={(difficulty) => {
              const xpBonus = difficulty === 'easy' ? 15 : difficulty === 'good' ? 10 : 5;
              const nextXp = userXp + xpBonus;
              setUserXp(nextXp);
              AppStorage.saveXp(nextXp);
              setSrsCardsReviewedCount(prev => prev + 1);
              setIsCardFlipped(false);
              setCurrentCardIndex(prev => (prev + 1) % Math.max(1, srsDeck.length));
              soundManager.playSuccess();
              triggerCloudSync();
            }}
            onSpeakText={(text) => speakText(text)}
          />
        )}

        {/* Barra de Navegación Inferior para Móviles (md:hidden) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => {
              setCurrentView('PATH');
              soundManager.playClick();
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${currentView === 'PATH' ? 'text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px]">Ruta</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('IMMERSION');
              soundManager.playClick();
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${currentView === 'IMMERSION' ? 'text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Inmersión</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('SYLLABUS');
              soundManager.playClick();
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${currentView === 'SYLLABUS' ? 'text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
          >
            <ListTree className="w-5 h-5" />
            <span className="text-[10px]">Temario</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('PROJECTS');
              soundManager.playClick();
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${currentView === 'PROJECTS' ? 'text-purple-300 font-bold bg-purple-950/60 border border-purple-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">Taller</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('REVIEW');
              soundManager.playClick();
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${currentView === 'REVIEW' ? 'text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-[10px]">Repaso</span>
          </button>
        </nav>

      </div>

      {/* Modal de Visor de Sub-Nodo de Inmersión (Reading, Listening, SRS) */}
      <AnimatePresence>
        {activeSubNode && (
          <ImmersionViewerModal
            subNode={activeSubNode}
            isCompleted={completedSubNodeIds.includes(activeSubNode.id)}
            onClose={() => setActiveSubNode(null)}
            onComplete={(subNodeId, xpReward) => {
              handleCompleteSubNode(subNodeId, xpReward);
            }}
            onAddMinutes={(addedMins) => {
              const updated = AppStorage.addImmersionMinutes(addedMins);
              setImmersionMinutes(updated);
            }}
          />
        )}
      </AnimatePresence>

      {/* LESSON RUNNER DE 6 ETAPAS INTERACTIVAS (MODULAR) */}
      <AnimatePresence>
        {activeLesson && (
          <LessonRunner
            lesson={activeLesson}
            starredPhrases={starredPhrases}
            onClose={() => setActiveLesson(null)}
            onComplete={(action) => {
              completeLessonAndUnlockNext();
              if (action === 'immersion') {
                setCurrentView('IMMERSION');
              }
            }}
            onToggleStarPhrase={handleToggleStarPhrase}
          />
        )}
      </AnimatePresence>

      {/* Modal de Perfil de Usuario Completo */}
      <DailyVocabularyModal
        isOpen={isDailyVocabOpen}
        onClose={() => setIsDailyVocabOpen(false)}
        userLevel={userHighestLevel}
        userId={user?.id}
        onXpAwarded={(amount) => {
          const next = userXp + amount;
          setUserXp(next);
          AppStorage.saveXp(next);
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
        streakDays={streakDays}
        userXp={userXp}
        immersionMinutes={immersionMinutes}
      />

      {/* Modal de la Biblioteca de Inmersión y Content Lake */}
      <TopicLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        lessonId={selectedLibraryLesson?.id || activeLesson?.id || 'a1-lesson-1'}
        lessonCode={selectedLibraryLesson?.code || activeLesson?.code || '1.1'}
        lessonTitle={selectedLibraryLesson?.title || activeLesson?.title || 'Tema de Inmersión'}
        level={selectedLibraryLesson?.level || activeLesson?.level || 'A1'}
        onMinutesAdded={(mins) => {
          setImmersionMinutes((prev) => prev + mins);
        }}
      />

      {/* Modal del Test de Nivelación Adaptativo */}
      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        userId={user?.id}
        onLevelAssigned={(level, unlockedNodes) => {
          setCompletedNodeIds(unlockedNodes);
          setUserProfile(AppStorage.getUserProfile());
          setUserXp(AppStorage.getXp());
          triggerCloudSync();
        }}
      />

      {/* Modal de Venta y Activación de Nativa Premium (Fase 5) */}
      <PremiumPaywallModal
        isOpen={isPaywallModalOpen}
        onClose={() => setIsPaywallModalOpen(false)}
        reason={paywallReason}
        onUnlocked={() => {
          setIsUserPremium(true);
          triggerCloudSync();
        }}
      />

      {/* Modal de Mis Certificados Oficiales PDF (Tarea 2) */}
      <CertificatesModal
        isOpen={isCertificatesModalOpen}
        onClose={() => setIsCertificatesModalOpen(false)}
        completedNodeIds={completedNodeIds}
        studentName={userProfile.name || 'David Abarca'}
        currentLevel={userProfile.targetLevel || 'A1'}
      />

      {/* Modal de Alerta: Contenido B2-C2 en Curaduría (Tarea 4) */}
      <AnimatePresence>
        {b2c2AlertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#080d18] border border-purple-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setB2c2AlertModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-black bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-md">
                  Nivel {b2c2AlertLevel} • En Curaduría
                </span>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Lecturas Avanzadas en Curaduría Pedagógica
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Los textos científicos y artículos indexados de lectura para el nivel <strong className="text-purple-300">{b2c2AlertLevel}</strong> están siendo curados bajo estándares de Oxford Academic, Nature y The Economist.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-1.5">
                <span className="font-bold block text-[11px] text-purple-300 font-mono">
                  💡 Actividades Disponibles para este Nivel:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>Las 6 etapas de la lección troncal con audio y pronunciación.</li>
                  <li>El Taller de Proyectos TBLT evaluado con rúbricas de IA.</li>
                </ul>
              </div>

              <button
                onClick={() => setB2c2AlertModalOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-purple-600/20"
              >
                Entendido, Continuar con la Lección
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
