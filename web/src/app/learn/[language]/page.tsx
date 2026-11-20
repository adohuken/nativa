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
  ArrowLeft
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
import { RadarSkillsChart } from '@/components/radar-skills-chart';
import { UserProfileModal } from '@/components/user-profile-modal';
import { APP_NAME } from '@/lib/config';

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
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => AppStorage.getUserProfile());

  // Navegación de Vistas del Dashboard: 'PATH' | 'IMMERSION' | 'SYLLABUS' | 'PROJECTS' | 'REVIEW'
  const [currentView, setCurrentView] = useState<'PATH' | 'IMMERSION' | 'SYLLABUS' | 'PROJECTS' | 'REVIEW'>('PATH');
  const [selectedSyllabusLevelId, setSelectedSyllabusLevelId] = useState<string>('level-a1');
  const [routeLevelFilter, setRouteLevelFilter] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('ALL');

  // Sección de Inmersión Masiva (Narrow Reading Krasheniano)
  const [immersionMinutes, setImmersionMinutes] = useState<number>(15);
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
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(['a1-lesson-1']);
  const [completedSubNodeIds, setCompletedSubNodeIds] = useState<string[]>([]);
  const [activeSubNode, setActiveSubNode] = useState<SubNode | null>(null);
  const [activeLesson, setActiveLesson] = useState<IntensiveLesson | null>(null);
  const [activePopoverLessonId, setActivePopoverLessonId] = useState<string | null>(null);
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 a 6 pasos
  const [userXp, setUserXp] = useState(140);
  const [streakDays, setStreakDays] = useState(2);
  const [skillScores, setSkillScores] = useState<SkillMasteryScores>({ listening: 65, speaking: 45, reading: 70, writing: 50 });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [zenMode, setZenMode] = useState<boolean>(true);

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

  // Hidratar progreso desde localStorage al montar
  useEffect(() => {
    // 1. Cargar sesión de usuario
    const savedUser = localStorage.getItem('fluentia_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { }
    }

    // 2. Hidratar progreso desde AppStorage
    const savedNodes = AppStorage.getCompletedNodes();
    setCompletedNodeIds(savedNodes);

    const savedXp = AppStorage.getXp();
    setUserXp(savedXp);

    const savedStreak = AppStorage.getStreak();
    setStreakDays(savedStreak);

    const savedSkills = AppStorage.getSkillScores();
    setSkillScores(savedSkills);

    const savedSound = AppStorage.getSoundEnabled();
    setSoundEnabled(savedSound);
    soundManager.enabled = savedSound;

    const savedZen = AppStorage.getZenMode();
    setZenMode(savedZen);

    const savedSubmissions = AppStorage.getProjectSubmissions();
    setProjectSubmissions(savedSubmissions);

    const savedImmersion = AppStorage.getImmersionMinutes();
    setImmersionMinutes(savedImmersion);

    const savedStarred = AppStorage.getStarredPhrases();
    setStarredPhrases(savedStarred);

    const savedSubNodes = AppStorage.getCompletedSubNodes();
    setCompletedSubNodeIds(savedSubNodes);
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
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    AppStorage.saveSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  const handleToggleStarPhrase = (line: { en: string; es: string; phonetic?: string }, lesson: IntensiveLesson) => {
    const cleanId = `${lesson.id}-${line.en.slice(0, 16).replace(/[^a-zA-Z0-9]/g, '-')}`;
    const isNowStarred = AppStorage.toggleStarredPhrase({
      id: cleanId,
      en: line.en,
      es: line.es,
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
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const endpoint = authMode === 'LOGIN' ? 'http://localhost:4000/auth/login' : 'http://localhost:4000/auth/register';
    const payload = authMode === 'LOGIN'
      ? { email: emailInput, password: passwordInput }
      : { email: emailInput, password: passwordInput, nativeLanguageCode: 'es', targetLanguageCode: 'en' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('fluentia_user_session', JSON.stringify(data.user));
      } else {
        setAuthError(data.message || 'Error en las credenciales.');
      }
    } catch {
      // Fallback local elegante
      const fallbackUser: UserSession = {
        id: 'user-' + Date.now(),
        email: emailInput || `estudiante@${APP_NAME.toLowerCase()}.io`,
        role: 'STUDENT',
      };
      setUser(fallbackUser);
      localStorage.setItem('fluentia_user_session', JSON.stringify(fallbackUser));
    } finally {
      setAuthLoading(false);
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
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fluentia_user_session');
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
    }
    soundManager.playVictory();
    setActiveLesson(null);
  };

  const handleEvaluateProject = (project: AcademicProjectDefinition) => {
    const textToEvaluate = projectTextDraft || projectSubmissions[project.unit]?.content || '';
    if (!textToEvaluate.trim()) return;

    setIsEvaluatingProject(true);
    soundManager.playClick();

    setTimeout(() => {
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
      };

      const updated = { ...projectSubmissions, [project.unit]: submission };
      setProjectSubmissions(updated);
      AppStorage.saveProjectSubmission(submission);

      // Otorgar XP y habilidad de Writing
      const nextXp = userXp + 75;
      setUserXp(nextXp);
      AppStorage.saveXp(nextXp);

      const newSkills = { ...skillScores };
      newSkills.writing = Math.min(100, newSkills.writing + 8);
      setSkillScores(newSkills);
      AppStorage.saveSkillScores(newSkills);

      setIsEvaluatingProject(false);
      soundManager.playVictory();
    }, 1200);
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
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    API Online
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {authMode === 'LOGIN' ? `Bienvenido a ${APP_NAME}` : 'Crea tu Cuenta de Estudio'}
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {authMode === 'LOGIN'
                    ? 'Inicia sesión para sincronizar tu camino y racha de aprendizaje.'
                    : 'Empieza desde el nivel A1 con progreso aislado en PostgreSQL.'}
                </p>
              </div>

              {/* Toggle Login / Register */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setAuthError(null);
                  }}
                  className={`py-2.5 rounded-xl font-bold transition ${authMode === 'LOGIN'
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
                  }}
                  className={`py-2.5 rounded-xl font-bold transition ${authMode === 'REGISTER'
                    ? 'bg-neutral-850 text-white shadow-md border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
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
                      minLength={8}
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

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-neutral-950 font-black py-3 rounded-xl text-xs transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{authLoading ? 'Verificando...' : authMode === 'LOGIN' ? 'Entrar a Mi Cuenta' : 'Crear Cuenta y Comenzar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleGuestDemo}
                  className="text-xs text-neutral-400 hover:text-emerald-400 transition underline underline-offset-4"
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
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-slate-800/80 bg-[#090d16] md:bg-[#090d16]/95 backdrop-blur-2xl flex flex-col shrink-0 p-5 space-y-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isMobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
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

        {/* Navegación al Dashboard & Idioma Activo */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0d131f] border border-slate-800/90 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{currentLanguageEntry.flag}</span>
            <div className="min-w-0">
              <span className="text-xs font-black text-white block truncate">{currentLanguageEntry.name}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold block truncate">{currentLanguageEntry.badgeText}</span>
            </div>
          </div>

          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-bold text-slate-300 hover:text-white transition shadow-xs shrink-0"
            title="Volver al Selector de Idiomas (Dashboard)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Hub</span>
          </Link>
        </div>

        {/* Perfil de Usuario Clickeable */}
        <div 
          onClick={() => { setIsProfileModalOpen(true); soundManager.playClick(); }}
          className="p-3 rounded-2xl bg-[#0d131f] hover:bg-[#121a2a] border border-slate-800/90 hover:border-emerald-500/50 shadow-sm transition cursor-pointer group"
          title="Ver y editar mi perfil de estudiante"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold font-mono text-base shrink-0 shadow-xs">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.avatarEmoji || '👨‍🎓'}</span>
                )}
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 block truncate transition">
                  {userProfile.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block truncate">
                  @{userProfile.username} • {userHighestLevel}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Cerrar Sesión"
              className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 flex items-center justify-center transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Selector de Vista Principal: 5 Modos (Ruta, Inmersión, Temario, Proyectos, Repaso) */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block px-1">
            Modos de Vista
          </span>
          <div className="grid grid-cols-5 gap-1 p-1 bg-[#070a10] rounded-2xl border border-slate-800/80 text-xs shadow-inner">
            <button
              onClick={() => {
                setCurrentView('PATH');
                setIsMobileDrawerOpen(false);
                soundManager.playClick();
              }}
              className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 ${
                currentView === 'PATH' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[9px]">Ruta</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('IMMERSION');
                setIsMobileDrawerOpen(false);
                soundManager.playClick();
              }}
              className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 ${
                currentView === 'IMMERSION' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-md shadow-teal-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-[9px]">Inmersión</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('SYLLABUS');
                setIsMobileDrawerOpen(false);
                soundManager.playClick();
              }}
              className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 ${
                currentView === 'SYLLABUS' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black shadow-md shadow-cyan-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span className="text-[9px]">Temario</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('PROJECTS');
                setIsMobileDrawerOpen(false);
                soundManager.playClick();
              }}
              className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 ${
                currentView === 'PROJECTS' 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-400 text-white font-black shadow-md shadow-purple-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[9px]">Taller</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('REVIEW');
                setIsMobileDrawerOpen(false);
                soundManager.playClick();
              }}
              className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 ${
                currentView === 'REVIEW' 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black shadow-md shadow-amber-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span className="text-[9px]">SRS</span>
            </button>
          </div>
        </div>

        {/* Estadísticas Compactas en una sola línea horizontal (🔥 Racha | ⚡ XP | ⏱️ Input) */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#070b13] border border-slate-800/90 text-xs font-mono shadow-inner">
          <div className="flex items-center gap-1.5 text-amber-400" title="Racha de estudio diario">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold">{streakDays}d</span>
          </div>
          <span className="text-slate-800">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400" title="Puntos de experiencia acumulados">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold">{userXp} XP</span>
          </div>
          <span className="text-slate-800">|</span>
          <div className="flex items-center gap-1.5 text-teal-300" title="Minutos de inmersión acumulados">
            <Headphones className="w-3.5 h-3.5" />
            <span className="font-bold">{immersionMinutes}m</span>
          </div>
          {starredPhrases.length > 0 && (
            <>
              <span className="text-slate-800">|</span>
              <div className="flex items-center gap-1 text-amber-300" title="Frases estrella para repaso SRS">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{starredPhrases.length}</span>
              </div>
            </>
          )}
        </div>

        {/* Gráfico de Radar de Destrezas SLA (Spider Chart - 4 Áreas) */}
        <div className="p-4 rounded-3xl bg-[#0d131f] border border-slate-800/90 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Destrezas SLA (Radar)
            </span>
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido Zen'}
              className="text-slate-400 hover:text-emerald-400 p-1 rounded-lg transition hover:bg-slate-800"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>

          {/* Gráfico de Radar SVG Polígono Translúcido Verde/Cian */}
          <RadarSkillsChart scores={skillScores} />
        </div>

        {/* Tarjeta de Misión Diaria Gamificada */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#0d131f] to-[#090d16] border border-amber-500/30 shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-black flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Misión Diaria
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shadow-xs">
              +30 XP
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-white font-bold leading-snug">
              Potencia tu {bottleneckSkill.name.split(' ')[0]}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Completa una sesión activa de Repaso SRS o práctica de voz para consolidar tu racha.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('REVIEW');
              soundManager.playClick();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Iniciar Práctica SRS / Voz</span>
          </button>
        </div>

        {/* Regla Pedagógica */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtro Afectivo Zen</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Sin vidas punitivas ni estrés. Avanza a tu propio ritmo con input comprensible.
          </p>
        </div>

        {/* Resumen de Módulos */}
        <div className="flex-1 space-y-2 pt-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block px-1">
            Módulos Oficiales (A1 → C2)
          </span>
          {[
            { lvl: 'Módulo 1: A1 Fundamentos', code: 'A1', done: `${completedNodeIds.filter(id => id.startsWith('a1')).length}/4`, active: true, color: 'text-emerald-400', activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-sm', dot: 'bg-emerald-400' },
            { lvl: 'Módulo 2: A2 Comunicación', code: 'A2', done: `${completedNodeIds.filter(id => id.startsWith('a2')).length}/4`, active: completedNodeIds.includes('a1-lesson-4'), color: 'text-cyan-400', activeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-sm', dot: 'bg-cyan-400' },
            { lvl: 'Módulo 3: B1 Independencia', code: 'B1', done: `${completedNodeIds.filter(id => id.startsWith('b1')).length}/4`, active: completedNodeIds.includes('a2-lesson-4'), color: 'text-blue-400', activeBg: 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-bold shadow-sm', dot: 'bg-blue-400' },
            { lvl: 'Módulo 4: B2 Académico', code: 'B2', done: `${completedNodeIds.filter(id => id.startsWith('b2')).length}/4`, active: completedNodeIds.includes('b1-lesson-4'), color: 'text-purple-400', activeBg: 'bg-purple-500/15 border-purple-500/40 text-purple-300 font-bold shadow-sm', dot: 'bg-purple-400' },
            { lvl: 'Módulo 5: C1 Avanzado EAP', code: 'C1', done: `${completedNodeIds.filter(id => id.startsWith('c1')).length}/4`, active: completedNodeIds.includes('b2-lesson-4'), color: 'text-rose-400', activeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-bold shadow-sm', dot: 'bg-rose-400' },
            { lvl: 'Módulo 6: C2 Maestría Doctoral', code: 'C2', done: `${completedNodeIds.filter(id => id.startsWith('c2')).length}/4`, active: completedNodeIds.includes('c1-lesson-4'), color: 'text-amber-400', activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-sm', dot: 'bg-amber-400' },
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
                className={`w-full flex items-center justify-between text-xs p-2.5 rounded-xl border transition text-left ${
                  isSelected
                    ? `${item.activeBg}`
                    : 'bg-[#0d131f] border-slate-800/80 hover:bg-[#121a2c] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.active ? (
                    <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-500" />
                  )}
                  <span className={item.active ? (isSelected ? 'font-bold' : item.color) : 'text-slate-500'}>
                    {item.lvl}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{item.done}</span>
              </button>
            );
          })}
        </div>

      </aside>

      {/* ================= CONTENIDO CENTRAL ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* VISTA 1: CAMINO UNIVERSITARIO DE APRENDIZAJE (MISSION CARDS TIMELINE) */}
        {currentView === 'PATH' && (
          <main className="flex-1 px-4 sm:px-8 py-8 md:py-10 pb-28 md:pb-12 max-w-4xl mx-auto w-full space-y-10">

            {/* Hero Header Gamificado */}
            <div className="text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shadow-md shadow-emerald-500/10">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>ESTÁNDAR MCER A1 → C2 • INPUT COMPRENSIBLE i+1</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Ruta Universitaria de Adquisición
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Supera cada misión comunicativa sin traducir mentalmente. Cada lección desbloquea la siguiente con inmersión sonora nativa y evaluación automática.
              </p>
            </div>

            {/* Barra de Filtro por Nivel CEFR */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 bg-[#0b101b] rounded-2xl border border-slate-800/90 text-xs shadow-md">
              {[
                { id: 'ALL', label: 'Todos (24)', dot: 'bg-slate-400', tabActive: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 border-emerald-400', tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#12192b]' },
                { id: 'A1', label: 'A1 Fundamentos', dot: 'bg-emerald-400', tabActive: LEVEL_THEMES.A1.tabActive, tabInactive: LEVEL_THEMES.A1.tabInactive },
                { id: 'A2', label: 'A2 Comunicación', dot: 'bg-cyan-400', tabActive: LEVEL_THEMES.A2.tabActive, tabInactive: LEVEL_THEMES.A2.tabInactive },
                { id: 'B1', label: 'B1 Independencia', dot: 'bg-blue-400', tabActive: LEVEL_THEMES.B1.tabActive, tabInactive: LEVEL_THEMES.B1.tabInactive },
                { id: 'B2', label: 'B2 Académico', dot: 'bg-purple-400', tabActive: LEVEL_THEMES.B2.tabActive, tabInactive: LEVEL_THEMES.B2.tabInactive },
                { id: 'C1', label: 'C1 Avanzado', dot: 'bg-rose-400', tabActive: LEVEL_THEMES.C1.tabActive, tabInactive: LEVEL_THEMES.C1.tabInactive },
                { id: 'C2', label: 'C2 Maestría', dot: 'bg-amber-400', tabActive: LEVEL_THEMES.C2.tabActive, tabInactive: LEVEL_THEMES.C2.tabInactive },
              ].map((tab) => {
                const isSelected = routeLevelFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRouteLevelFilter(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-2 border ${
                      isSelected ? tab.tabActive : tab.tabInactive
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Camino de Aventura estilo Duolingo Pro con Nodos Circulares y Curvas Onduladas */}
            <div className="relative pt-2 pb-12 w-full max-w-2xl mx-auto flex flex-col items-center">
              {filteredLessons.map((lesson, index) => {
                const status = getNodeStatus(lesson);
                const isCompleted = status === 'COMPLETED';
                const isActive = status === 'ACTIVE';
                const isLocked = status === 'LOCKED';
                const shouldShowBanner = index === 0 || filteredLessons[index - 1].unit !== lesson.unit;
                const theme = LEVEL_THEMES[lesson.level] || LEVEL_THEMES.A1;

                // Verificación de bloqueo por sub-nodos pendientes del nodo anterior
                const prereqLesson = lesson.prerequisiteId ? filteredLessons.find(l => l.id === lesson.prerequisiteId) : null;
                const prereqSubNodesStatus = prereqLesson ? getSubNodesCompletionStatus(prereqLesson.id) : null;
                const isLockedBySubNodes = isLocked && prereqLesson && completedNodeIds.includes(prereqLesson.id) && !prereqSubNodesStatus?.allDone;

                // Sub-Nodos de inmersión para esta lección madre
                const subNodes = getSubNodesForLesson(lesson.id, languageId);
                const subNodesStatus = getSubNodesCompletionStatus(lesson.id);
                const areSubNodesUnlocked = isCompleted;

                // Desplazamiento serpenteante: 0 -> Centro, 1 -> Derecha, 2 -> Izquierda
                const cycle = index % 3;
                const serpentineClass = cycle === 0 
                  ? 'translate-x-0' 
                  : cycle === 1 
                    ? 'translate-x-20 sm:translate-x-28' 
                    : '-translate-x-20 sm:-translate-x-28';

                // Popover abierto si hovered o clickeado
                const isPopoverOpen = hoveredLessonId === lesson.id || activePopoverLessonId === lesson.id;

                return (
                  <div key={lesson.id} className="w-full flex flex-col items-center">

                    {/* Banner de Unidad con Proyecto Universitario Oficial */}
                    {shouldShowBanner && (
                      <div className={`w-full max-w-xl my-8 p-6 rounded-3xl bg-gradient-to-br ${theme.bannerBg} border border-slate-800/90 shadow-xl space-y-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-base shadow-lg bg-gradient-to-br ${theme.btnGradient} ${theme.btnText}`}>
                              U{lesson.unit}
                            </div>
                            <div>
                              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${theme.accentText}`}>
                                Módulo Curricular • Nivel {lesson.level} ({theme.name})
                              </span>
                              <h2 className="text-base sm:text-lg font-black text-white">{lesson.unitTitle}</h2>
                            </div>
                          </div>

                          {isLocked ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 font-medium shadow-sm">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Siguiente</span>
                            </div>
                          ) : (
                            <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm border ${theme.badgeBg}`}>
                              <span className={`w-2 h-2 rounded-full ${theme.dotColor} animate-pulse`} />
                              En Progreso
                            </span>
                          )}
                        </div>

                        {lesson.academicProject && (
                          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                            <GraduationCap className={`w-4 h-4 shrink-0 mt-0.5 ${theme.accentText}`} />
                            <span className="leading-relaxed">
                              <strong className="text-white">Proyecto Universitario:</strong> {lesson.academicProject}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* =========================================================================
                        NODO MADRE (Círculo 80x80px Aislado y Centrado con Popover Flotante)
                    ========================================================================= */}
                    <div className={`relative flex flex-col items-center my-3 transition-transform ${serpentineClass}`}>

                      {/* Píldora de XP flotando sobre el nodo si está activo */}
                      {isActive && (
                        <div className="absolute -top-7 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-md animate-bounce z-10 pointer-events-none">
                          +{lesson.xpReward} XP
                        </div>
                      )}

                      {/* Círculo Grande del Nodo Madre (aprox 80x80px) con botón táctil 3D */}
                      <button
                        onMouseEnter={() => setHoveredLessonId(lesson.id)}
                        onMouseLeave={() => setHoveredLessonId(null)}
                        onClick={() => {
                          setActivePopoverLessonId(activePopoverLessonId === lesson.id ? null : lesson.id);
                          soundManager.playClick();
                        }}
                        title={isCompleted ? `Ver misión: ${lesson.title}` : isActive ? `Comenzar: ${lesson.title}` : `Bloqueado: ${lesson.title}`}
                        className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all select-none relative group ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 text-white border-4 border-emerald-300 shadow-[0_8px_0_#065f46] shadow-emerald-500/30 hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#065f46] cursor-pointer'
                            : isActive
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-4 border-emerald-300 shadow-[0_8px_0_#065f46] ring-4 ring-emerald-400/40 animate-pulse hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#065f46] cursor-pointer'
                              : 'bg-[#0d131f] border-4 border-slate-800 text-slate-600 shadow-[0_8px_0_#080c14] hover:border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        {isCompleted ? (
                          (() => {
                            const Icon = lesson.code === '1.1' ? Briefcase : lesson.code === '1.2' ? Compass : lesson.code === '1.3' ? Coffee : lesson.code === '1.4' ? FileText : Compass;
                            return <Icon className="w-9 h-9 stroke-[2.2] text-white drop-shadow-md group-hover:scale-110 transition-transform" />;
                          })()
                        ) : isActive ? (
                          (() => {
                            const Icon = lesson.code === '1.1' ? Briefcase : lesson.code === '1.2' ? Compass : lesson.code === '1.3' ? Coffee : lesson.code === '1.4' ? FileText : Compass;
                            return <Icon className="w-9 h-9 stroke-[2.2] text-white drop-shadow-md group-hover:scale-110 transition-transform" />;
                          })()
                        ) : (
                          <Lock className="w-8 h-8 stroke-[2] text-slate-600" />
                        )}

                        {/* Check verde brillante si el Nodo Madre está completado */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 border-2 border-[#07090e] flex items-center justify-center font-black shadow-lg">
                            <Check className="w-4 h-4 stroke-[3.5] text-slate-950" />
                          </div>
                        )}
                      </button>

                      {/* Popover / Tooltip Flotante (Aparece al hacer Clic o pasar el Ratón) */}
                      <AnimatePresence>
                        {isPopoverOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.94 }}
                            transition={{ duration: 0.16, ease: 'easeOut' }}
                            className="absolute bottom-full mb-3.5 z-40 w-72 sm:w-80 p-4 rounded-2xl bg-[#0c1322]/95 backdrop-blur-xl border border-slate-700/90 shadow-2xl shadow-black/90 flex flex-col gap-2 text-left pointer-events-auto select-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header del Popover */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                                  Lección {lesson.code}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900 text-slate-400 font-bold">
                                  {lesson.level}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>+{lesson.xpReward} XP</span>
                              </div>
                            </div>

                            {/* Título y Subtítulo */}
                            <div className="space-y-1">
                              <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                                {lesson.subtitle}
                              </p>
                            </div>

                            {/* Botón de Acción Principal */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                              {isCompleted ? (
                                <button
                                  onClick={() => {
                                    setActivePopoverLessonId(null);
                                    startLesson(lesson);
                                  }}
                                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Repasar Lección (+{lesson.xpReward} XP)</span>
                                </button>
                              ) : isActive ? (
                                <button
                                  onClick={() => {
                                    setActivePopoverLessonId(null);
                                    startLesson(lesson);
                                  }}
                                  className={`w-full py-2 px-3 rounded-xl bg-gradient-to-r ${theme.btnGradient} hover:opacity-95 ${theme.btnText} font-black text-xs transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer`}
                                >
                                  <span>Comenzar Lección (6 Etapas)</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              ) : isLockedBySubNodes ? (
                                <div className="w-full text-[11px] text-amber-300 bg-amber-500/15 border border-amber-500/30 p-2 rounded-xl flex items-center gap-1.5 font-medium leading-tight">
                                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span>Completa los 3 sub-nodos de la Lección {prereqLesson?.code} ({prereqSubNodesStatus?.completedCount}/3)</span>
                                </div>
                              ) : (
                                <div className="w-full text-center text-xs text-slate-500 font-mono py-1 flex items-center justify-center gap-1.5">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Lección Bloqueada</span>
                                </div>
                              )}
                            </div>

                            {/* Flecha indicadora apuntando al círculo */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#0c1322]" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* =========================================================================
                        SUB-NODOS (40x40px) CONECTADOS AL NODO 1.1 (Reading, Listening, SRS)
                    ========================================================================= */}
                    {areSubNodesUnlocked && (
                      <div className={`flex flex-col items-center my-1 transition-transform ${serpentineClass}`}>
                        {/* Línea vertical conectora desde el nodo madre */}
                        <div className="flex justify-center my-1 select-none pointer-events-none">
                          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                            <line
                              x1="12"
                              y1="0"
                              x2="12"
                              y2="20"
                              stroke="#10b981"
                              strokeWidth="2.5"
                              strokeDasharray="4 4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        {/* Los 3 Círculos de 40x40px de Inmersión */}
                        <div className="flex items-center justify-center gap-4 sm:gap-5 my-1">
                          {subNodes.map((sub) => {
                            const isSubDone = completedSubNodeIds.includes(sub.id);
                            const SubIcon = sub.type === 'reading' ? BookOpen : sub.type === 'listening' ? Headphones : RotateCw;
                            const subTitle = sub.type === 'reading' ? 'Lectura Inmersiva' : sub.type === 'listening' ? 'Escucha Receptiva' : 'Repaso SRS';

                            return (
                              <div key={sub.id} className="relative flex flex-col items-center group">
                                <button
                                  onClick={() => {
                                    setActiveSubNode(sub);
                                    soundManager.playClick();
                                  }}
                                  title={`${subTitle} (+${sub.xpReward} XP)`}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all select-none relative shadow-md active:translate-y-0.5 cursor-pointer ${
                                    isSubDone
                                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-2 border-emerald-300 shadow-[0_3px_0_#065f46] shadow-emerald-500/25 hover:scale-115'
                                      : 'bg-[#0c1a2e] border-2 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.45)] ring-4 ring-cyan-500/25 hover:scale-115 animate-pulse'
                                  }`}
                                >
                                  <SubIcon className="w-4 h-4 stroke-[2.2]" />

                                  {/* Badge: Check verde o chispa activa */}
                                  {isSubDone ? (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 border border-[#07090e] flex items-center justify-center font-bold shadow-xs">
                                      <Check className="w-2.5 h-2.5 stroke-[3.5] text-slate-950" />
                                    </div>
                                  ) : (
                                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-[#07090e] flex items-center justify-center shadow-xs">
                                      <Sparkles className="w-2 h-2 text-slate-950" />
                                    </div>
                                  )}
                                </button>

                                {/* Micro-label flotante al pasar el ratón */}
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 text-[9px] font-mono font-bold whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 pointer-events-none z-20 shadow-sm">
                                  {sub.type === 'reading' ? 'Reading' : sub.type === 'listening' ? 'Listening' : 'SRS'} (+{sub.xpReward} XP)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* =========================================================================
                        TRAZO SVG SERPENTEANTE QUE CONECTA ESTE NODO CON EL SIGUIENTE
                    ========================================================================= */}
                    {index < filteredLessons.length - 1 && (
                      <div className="flex justify-center select-none pointer-events-none my-2">
                        {cycle === 0 ? (
                          // De Centro (1.1) hacia la Derecha (1.2)
                          <svg width="150" height="75" viewBox="0 0 150 75" fill="none">
                            <path
                              d="M 25 0 C 25 40, 125 35, 125 75"
                              stroke={subNodesStatus.allDone ? '#10b981' : '#334155'}
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : cycle === 1 ? (
                          // De la Derecha (1.2) hacia la Izquierda (1.3)
                          <svg width="220" height="85" viewBox="0 0 220 85" fill="none">
                            <path
                              d="M 175 0 C 175 50, 45 35, 45 85"
                              stroke="#334155"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          // De la Izquierda (1.3) de vuelta hacia el Centro (1.4)
                          <svg width="150" height="75" viewBox="0 0 150 75" fill="none">
                            <path
                              d="M 35 0 C 35 40, 115 35, 115 75"
                              stroke="#334155"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </main>
        )}

        {/* VISTA: BIBLIOTECA DE INMERSIÓN MASIVA (NARROW READING KRASHENIANO) */}
        {currentView === 'IMMERSION' && (
          <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 pb-28 md:pb-8">

            {/* Header de la Sección de Inmersión */}
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                    Input Masivo i+1 • Narrow Reading
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">Adquisición Natural por Exposición Graduada</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-teal-300 bg-[#0b101b] border border-slate-800 px-3 py-1 rounded-xl shadow-xs">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">{immersionMinutes} Minutos de Inmersión Registrados</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Biblioteca de Inmersión y Lectura Graduada
                </h1>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
                  Textos narrativos ricos en contexto (200 a 450 palabras) diseñados bajo la hipótesis del <strong className="text-slate-200">Input Comprensible de Krashen</strong>. Sin exámenes punitivos: lee a tu ritmo, activa el audio nativo y consolida tu adquisición mediante <em className="text-emerald-300">narrow reading</em> (series que reciclan vocabulario común).
                </p>
              </div>

              {/* Filtro por Nivel CEFR */}
              {!selectedImmersionStory && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                    const isSelected = immersionLevelFilter === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => {
                          setImmersionLevelFilter(lvl);
                          soundManager.playClick();
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition border ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-transparent shadow-md shadow-emerald-500/20 font-black'
                            : 'bg-[#0c111c] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {lvl === 'ALL' ? 'Todas las Historias (6 Niveles)' : `Nivel ${lvl}`}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LECTOR ENFOCADO DE HISTORIA DE INMERSIÓN */}
            {selectedImmersionStory ? (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    if (isPlayingAudio) window.speechSynthesis.cancel();
                    setSelectedImmersionStory(null);
                    soundManager.playClick();
                  }}
                  className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-[#0c111c] hover:bg-[#111928] border border-slate-800 hover:border-slate-700 transition"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Volver a la Biblioteca de Inmersión</span>
                </button>

                <div className="p-6 md:p-8 rounded-3xl bg-[#0c111c]/95 border border-slate-800/80 shadow-2xl space-y-6 backdrop-blur-xl">
                  {/* Encabezado del Texto */}
                  <div className="space-y-2 border-b border-slate-800/80 pb-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          Nivel {selectedImmersionStory.level}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                          {selectedImmersionStory.themeSeries}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span>{selectedImmersionStory.wordCount} palabras</span>
                        <span>•</span>
                        <span>⏱️ ~{selectedImmersionStory.readingMinutes} min de lectura</span>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {selectedImmersionStory.title}
                    </h2>
                    <p className="text-sm text-slate-400 italic">
                      {selectedImmersionStory.subtitle}
                    </p>

                    {/* Botón de Audio Narrativo */}
                    <div className="pt-3 flex items-center gap-3">
                      <button
                        onClick={() => {
                          const fullText = selectedImmersionStory.paragraphs.join(' ');
                          speakText(fullText);
                        }}
                        className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white transition shadow-md shadow-emerald-500/20"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Escuchar Narración Completa en Audio Nativo</span>
                      </button>
                      {isPlayingAudio && (
                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                            setIsPlayingAudio(false);
                          }}
                          className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-[#0e1626] hover:bg-[#152033] text-slate-300 border border-slate-700 transition"
                        >
                          <VolumeX className="w-4 h-4" />
                          <span>Pausar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Párrafos del Texto Comprensible */}
                  <div className="space-y-4 text-slate-200 leading-relaxed text-base font-normal">
                    {selectedImmersionStory.paragraphs.map((p, idx) => (
                      <p key={idx} className="p-3 rounded-2xl hover:bg-slate-900/40 transition duration-150 border border-transparent hover:border-slate-800">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Spotlight de Vocabulario en Contexto */}
                  <div className="p-5 rounded-2xl bg-[#080c14] border border-slate-800/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                        Vocabulario Clave Reciclado en Contexto
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedImmersionStory.vocabularySpotlight.map((v, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 shadow-xs">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-white text-xs">{v.word}</strong>
                            <span className="text-[10px] font-mono text-slate-400">{v.phonetic}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">{v.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chequeo Voluntario de Sentido */}
                  {selectedImmersionStory.voluntaryCheck && (
                    <div className="p-5 rounded-2xl bg-blue-950/25 border border-blue-500/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider font-mono">
                          Comprobación Voluntaria de Sentido (Sin Nota ni Penalización)
                        </span>
                      </div>
                      <p className="text-xs text-blue-100 font-semibold">
                        {selectedImmersionStory.voluntaryCheck.question}
                      </p>
                      <div className="space-y-2">
                        {selectedImmersionStory.voluntaryCheck.options.map((opt, i) => (
                          <div key={i} className="p-3 rounded-xl bg-[#0b1325] border border-blue-900/40 text-xs text-blue-100">
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-blue-300 italic pt-1">
                        💡 {selectedImmersionStory.voluntaryCheck.insight}
                      </p>
                    </div>
                  )}

                  {/* Botón de Finalización de Inmersión */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Al terminar, registrarás {selectedImmersionStory.readingMinutes} minutos de exposición comprensible.
                    </span>
                    <button
                      onClick={() => handleFinishImmersionStory(selectedImmersionStory)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Completar Lectura (+{selectedImmersionStory.readingMinutes}m Inmersión / +30 XP)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* GRID DE HISTORIAS DE INMERSIÓN */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {IMMERSION_STORIES.filter(
                  (s) => immersionLevelFilter === 'ALL' || s.level === immersionLevelFilter
                ).map((story) => (
                  <div
                    key={story.id}
                    className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800/80 shadow-sm hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          Nivel {story.level}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                          ⏱️ {story.readingMinutes} min lectura
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                          {story.themeSeries}
                        </span>
                        <h3 className="text-base font-black text-white mt-0.5">
                          {story.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {story.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                        <span>{story.wordCount} palabras</span>
                        <span>•</span>
                        <span>Audio: {story.audioDurationText}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedImmersionStory(story);
                        soundManager.playClick();
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0e1626] hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition border border-slate-700/80 flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Leer en Inmersión Activa</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

          </main>
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
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                        isSelected 
                          ? 'bg-purple-950/60 text-purple-200 border-2 border-purple-500 shadow-sm ring-1 ring-purple-500/20' 
                          : 'bg-[#0c111c] text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-[#111928]'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] ${
                        isSubmitted ? 'bg-emerald-500 text-slate-950 font-black' : isSelected ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-400'
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
                              className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition flex items-center gap-1.5 ${
                                isMatched 
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

        {/* =========================================================================
            VISTA 4: REPASO ESPACIADO INTELIGENTE (SRS FLASHCARDS & MONITOR SLA)
        ========================================================================= */}
        {currentView === 'REVIEW' && (
          <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6 pb-28 md:pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-950/60 text-blue-300 border border-blue-500/30">
                    SRS & Spaced Retrieval
                  </span>
                  <span className="text-xs text-slate-400">
                    {srsDeck.length} tarjetas generadas
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <Brain className="w-7 h-7 text-blue-400" />
                  Repaso Inteligente Espaciado
                </h1>
                <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Refuerza el léxico de situaciones reales, expresiones idiomáticas y tus frases estrella (⭐). Voltea la tarjeta, escucha la pronunciación nativa con transcripción IPA y evalúa tu retención sin castigo.
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <div className="p-3 rounded-2xl bg-[#080c14] border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Repasadas Hoy</span>
                  <span className="text-lg font-black text-blue-400 font-mono">+{srsCardsReviewedCount}</span>
                </div>
              </div>
            </div>

            {/* Filtro por Nivel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSrsLevelFilter(lvl);
                    soundManager.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                    srsLevelFilter === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#0c111c] text-slate-300 hover:text-white border border-slate-800 hover:bg-[#111928]'
                  }`}
                >
                  {lvl === 'ALL' ? 'Todos los Niveles' : `Nivel ${lvl}`}
                </button>
              ))}
            </div>

            {/* Tarjeta Flashcard Interactiva */}
            {srsDeck.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0c111c]/90 border border-slate-800 space-y-3 shadow-sm">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No hay tarjetas disponibles para este filtro</h3>
                <p className="text-xs text-slate-400">Completa lecciones en tu Ruta de Adquisición o marca frases con estrella (⭐) para repasar.</p>
              </div>
            ) : (
              (() => {
                const card = srsDeck[currentCardIndex % srsDeck.length];
                return (
                  <div className="space-y-6">
                    {/* Barra de progreso de la baraja */}
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                      <span>Tarjeta {(currentCardIndex % srsDeck.length) + 1} de {srsDeck.length}</span>
                      <span>Nivel {card.level} • Unidad {card.unit}</span>
                    </div>

                    {/* Tarjeta con Efecto Flip / Toca para Revelar */}
                    <div
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="cursor-pointer min-h-[300px] md:min-h-[340px] rounded-3xl p-6 md:p-10 border transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0e1626] to-[#0c111c] border-2 border-slate-700/80 hover:border-cyan-500/50"
                    >
                      {/* Top Tag & Audio */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-950/60 text-blue-300 border border-blue-500/30">
                          {card.categoryLabel}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(card.audioText);
                          }}
                          className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-400 border border-blue-500/30 transition shadow-xs"
                          title="Escuchar pronunciación nativa"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Contenido Central */}
                      <div className="my-auto py-6 text-center space-y-4">
                        {!isCardFlipped ? (
                          <div className="space-y-3">
                            <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-snug whitespace-pre-line">
                              {card.front}
                            </h2>
                            {card.audioText && (
                              <div className="pt-2 flex flex-col items-center gap-2">
                                <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-cyan-300 bg-cyan-950/60 px-3.5 py-1.5 rounded-xl border border-cyan-500/40 shadow-xs">
                                  <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400 bg-cyan-900/40 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                    IPA
                                  </span>
                                  <span>{card.phonetic || '/.../'}</span>
                                </span>

                                {/* Tarjeta opcional de aproximación fonética */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFigurativeHelper(!showFigurativeHelper);
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-amber-300 transition underline underline-offset-4 flex items-center gap-1"
                                >
                                  <span>{showFigurativeHelper ? 'Ocultar ayuda fonética en español' : '¿Te cuesta? Ver aproximación opcional'}</span>
                                </button>

                                {showFigurativeHelper && (
                                  <span className="text-[11px] italic text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-lg">
                                    Suena parecido a: &ldquo;{getFigurativePronunciation(card.audioText, card.phonetic)}&rdquo;
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-slate-400 pt-3 flex items-center justify-center gap-1.5">
                              <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                              <span>Haz clic o toca para ver el significado y contexto</span>
                            </p>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-blue-100 font-bold text-xl md:text-2xl whitespace-pre-line">
                              {card.back}
                            </div>

                            {card.explanation && (
                              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                                {card.explanation}
                              </p>
                            )}

                            {card.exampleSentence && (
                              <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 text-left max-w-xl mx-auto">
                                <span className="text-[10px] uppercase font-mono text-slate-400 block">Ejemplo en Contexto:</span>
                                <p className="text-xs text-white font-medium italic">&ldquo;{card.exampleSentence}&rdquo;</p>
                                {card.exampleTranslation && (
                                  <p className="text-[11px] text-slate-400 pt-0.5">{card.exampleTranslation}</p>
                                )}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* Footer de Tarjeta */}
                      <div className="text-center pt-2 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {isCardFlipped ? '¿Qué tan bien lo recordabas?' : 'Intenta recordarlo antes de voltear'}
                        </span>
                      </div>
                    </div>

                    {/* Botones de Autoevaluación SRS */}
                    {isCardFlipped ? (
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            soundManager.playGentleError();
                            setIsCardFlipped(false);
                            setCurrentCardIndex((prev) => (prev + 1) % srsDeck.length);
                            setSrsCardsReviewedCount((c) => c + 1);
                          }}
                          className="p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 transition font-bold text-xs flex flex-col items-center gap-1 shadow-xs"
                        >
                          <span className="text-sm">⚠️ Difícil</span>
                          <span className="text-[10px] text-rose-400 font-normal">Repetir pronto</span>
                        </button>

                        <button
                          onClick={() => {
                            soundManager.playSuccess();
                            setIsCardFlipped(false);
                            setCurrentCardIndex((prev) => (prev + 1) % srsDeck.length);
                            const nextXp = userXp + 5;
                            setUserXp(nextXp);
                            AppStorage.saveXp(nextXp);
                            setSrsCardsReviewedCount((c) => c + 1);
                          }}
                          className="p-3.5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 transition font-bold text-xs flex flex-col items-center gap-1 shadow-xs"
                        >
                          <span className="text-sm">👍 Bien</span>
                          <span className="text-[10px] text-blue-400 font-normal">+5 XP</span>
                        </button>

                        <button
                          onClick={() => {
                            soundManager.playVictory();
                            setIsCardFlipped(false);
                            setCurrentCardIndex((prev) => (prev + 1) % srsDeck.length);
                            const nextXp = userXp + 10;
                            setUserXp(nextXp);
                            AppStorage.saveXp(nextXp);
                            setSrsCardsReviewedCount((c) => c + 1);
                          }}
                          className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 transition font-bold text-xs flex flex-col items-center gap-1 shadow-xs"
                        >
                          <span className="text-sm">⭐ Fácil</span>
                          <span className="text-[10px] text-emerald-400 font-normal">+10 XP</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setIsCardFlipped(true)}
                          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs transition shadow-md shadow-blue-600/30"
                        >
                          Voltear Tarjeta
                        </button>
                        <button
                          onClick={() => {
                            setCurrentCardIndex((prev) => (prev + 1) % srsDeck.length);
                            soundManager.playClick();
                          }}
                          className="px-5 py-3 rounded-2xl bg-[#0c111c] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition"
                        >
                          Saltar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </main>
        )}

        {/* Barra de Navegación Inferior para Móviles (md:hidden) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => {
              setCurrentView('PATH');
              soundManager.playClick();
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${
              currentView === 'PATH' ? 'text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
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
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${
              currentView === 'IMMERSION' ? 'text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
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
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${
              currentView === 'SYLLABUS' ? 'text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
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
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${
              currentView === 'PROJECTS' ? 'text-purple-300 font-bold bg-purple-950/60 border border-purple-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
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
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition ${
              currentView === 'REVIEW' ? 'text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30 shadow-sm' : 'text-slate-400 hover:text-white'
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

      {/* =========================================================================
          LESSON RUNNER DE 6 ETAPAS INTERACTIVAS (A PANTALLA COMPLETA)
      ========================================================================= */}
      <AnimatePresence>
        {activeLesson && (
          <div className="fixed inset-0 z-50 bg-[#07090e] flex flex-col text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">

            {/* Top Bar de Progreso Segmentada Estilo Duolingo Pro */}
            <header className="border-b border-slate-800 px-4 md:px-8 py-3.5 bg-[#090d16]/95 backdrop-blur-xl flex items-center justify-between gap-4 shadow-sm">
              <button
                onClick={() => {
                  stopContinuousDialogue();
                  setActiveLesson(null);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c111c] hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-700 text-xs font-semibold"
                title="Cerrar lección (Esc)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Ruta</span>
              </button>

              {/* Segmented Progress Bar */}
              <div className="flex-1 max-w-xl mx-auto space-y-1.5 text-center">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`${activeTheme.accentText} font-bold uppercase tracking-wider`}>
                    {currentStep === 1 && '1/6 • Inmersión Sonora (Input Comprensible i+1)'}
                    {currentStep === 2 && '2/6 • Comprensión Global e Inferencia'}
                    {currentStep === 3 && '3/6 • Reconstruye la Historia (Significado Primero)'}
                    {currentStep === 4 && '4/6 • Laboratorio de Shadowing y Fonética IPA'}
                    {currentStep === 5 && '5/6 • Noticing Comunicativo (Atención Consciente Opcional)'}
                    {currentStep === 6 && '6/6 • Reto de Desbloqueo y Producción'}
                  </span>
                  <span className="text-slate-400 font-medium truncate max-w-[200px]">
                    {activeLesson.code} • {activeLesson.title}
                  </span>
                </div>

                {/* 6 Segmentos Visuales */}
                <div className="grid grid-cols-6 gap-1.5 h-2">
                  {[1, 2, 3, 4, 5, 6].map((stepNum) => {
                    const isDone = currentStep > stepNum;
                    const isCurrent = currentStep === stepNum;
                    return (
                      <div
                        key={stepNum}
                        className={`h-full rounded-full transition-all duration-300 ${isDone
                          ? activeTheme.progressDone
                          : isCurrent
                            ? `${activeTheme.progressCurrent} animate-pulse`
                            : 'bg-slate-800/80'
                          }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Controles de Velocidad, Atajos y XP */}
              <div className="flex items-center gap-2.5">
                <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-[#0c111c] border border-slate-800 px-2.5 py-1 rounded-xl">
                  <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[Espacio] Audio • [1-4] Opciones • [Enter] Siguiente</span>
                </div>

                <div className="hidden sm:flex items-center bg-[#0c111c] border border-slate-800 rounded-xl p-0.5 text-[10px] font-mono font-bold">
                  <button
                    onClick={() => setAudioSpeed(0.8)}
                    className={`px-2 py-1 rounded-lg transition ${audioSpeed === 0.8 ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    0.8x
                  </button>
                  <button
                    onClick={() => setAudioSpeed(1.0)}
                    className={`px-2 py-1 rounded-lg transition ${audioSpeed === 1.0 ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    1.0x
                  </button>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>+{activeLesson.xpReward} XP</span>
                </div>
              </div>
            </header>

            {/* Contenedor Principal con Scroll Limpio */}
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-3xl mx-auto w-full space-y-6">
              <AnimatePresence mode="wait">

                {/* =========================================================
                    ETAPA 1: INMERSIÓN SONORA EXTENSA (CHAT VIVO INTERACTIVO)
                ========================================================= */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-6"
                  >
                    {/* Tarjeta de la Escena Contextual */}
                    <div className="p-4 rounded-2xl bg-[#0c111c]/90 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                            Inmersión Contextual • Input Comprensible
                          </span>
                          <p className="text-xs text-slate-300 font-medium">
                            {activeLesson.step1_dialogue.context}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Toggle de Traducciones para evitar traducción mental */}
                        <button
                          onClick={() => setShowTranslations(!showTranslations)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${showTranslations
                            ? 'bg-[#0e1626] text-slate-300 border-slate-700 hover:text-white'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            }`}
                          title="Alternar visibilidad del español"
                        >
                          {showTranslations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{showTranslations ? 'Ocultar Español' : 'Ver Español'}</span>
                        </button>

                        {/* Toggle de Ayuda Fonética Opcional */}
                        <button
                          onClick={() => setShowFigurativeHelper(!showFigurativeHelper)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${showFigurativeHelper
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-[#0e1626] text-slate-300 hover:text-amber-300 border-slate-700'
                            }`}
                          title="Mostrar/Ocultar ayuda fonética aproximada como apoyo secundario"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px]">{showFigurativeHelper ? 'Ocultar Apoyo' : 'Apoyo Fonético'}</span>
                        </button>

                        {/* Reproductor de Diálogo Continuo e Inmersivo */}
                        <button
                          onClick={playContinuousDialogue}
                          className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-md ${
                            isContinuousPlaying
                              ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-slate-950 font-black shadow-emerald-500/20'
                          }`}
                        >
                          {isContinuousPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span>{isContinuousPlaying ? 'Detener Diálogo' : 'Todo el Diálogo'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Flujo Conversacional en Formato de Chat */}
                    <div className="space-y-4 pt-1">
                      {activeLesson.step1_dialogue.lines.map((line, idx) => {
                        const isStudent = line.speaker.toLowerCase().includes('david') || line.speaker.toLowerCase().includes('learner') || line.speaker.toLowerCase().includes('candidate');
                        const isPlayingThisLine = activeAudioIndex === idx;
                        const isRevealed = showTranslations || revealedLineIndexes.includes(idx);
                        const isStarred = starredPhrases.some(
                          (p) => p.en.trim().toLowerCase() === line.en.trim().toLowerCase()
                        );

                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
                          >
                            {/* Avatar del Hablante */}
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border transition-transform ${isPlayingThisLine ? 'scale-110 ring-2 ring-emerald-400' : ''} ${isStudent
                              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 shadow-sm'
                              : 'bg-[#0e1626] border-slate-700 text-slate-300 shadow-sm'
                              }`}>
                              {isStudent ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            {/* Burbuja del Mensaje con Iluminación Activa */}
                            <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition duration-200 border-2 shadow-sm ${
                              isPlayingThisLine
                                ? 'ring-2 ring-emerald-500 shadow-md border-emerald-500'
                                : ''
                            } ${isStudent
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 rounded-tr-sm hover:border-emerald-400'
                              : 'bg-[#0e1626]/90 border-slate-800 text-slate-100 rounded-tl-sm hover:border-slate-700'
                              }`}>
                              <div className="flex items-center justify-between gap-4 pb-1.5">
                                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isStudent ? 'text-emerald-300' : 'text-slate-400'
                                  }`}>
                                  {line.speaker}
                                </span>

                                <div className="flex items-center gap-2">
                                  {/* Botón Frase Estrella ⭐ para Repaso SRS */}
                                  <button
                                    onClick={() => handleToggleStarPhrase(line, activeLesson)}
                                    className={`p-1.5 rounded-lg transition ${
                                      isStarred
                                        ? 'text-amber-400 bg-amber-500/20 ring-1 ring-amber-400/40 shadow-xs'
                                        : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                                    }`}
                                    title={isStarred ? "Frase Estrella guardada en tu mazo SRS (⭐)" : "Añadir a mi mazo SRS como Frase Estrella (⭐)"}
                                  >
                                    <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                                  </button>

                                  {/* Botón de Audio con Visualizador de Onda */}
                                  <button
                                    onClick={() => {
                                      if (isContinuousPlaying) stopContinuousDialogue();
                                      speakText(line.en, idx, isStudent ? 1.08 : 0.94);
                                    }}
                                    className={`p-1.5 rounded-lg transition ${isPlayingThisLine
                                      ? 'text-emerald-300 bg-emerald-950/80 ring-2 ring-emerald-500/40'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                      }`}
                                    title="Escuchar pronunciación nativa"
                                  >
                                    {isPlayingThisLine ? (
                                      <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                                        <span className="w-0.5 bg-emerald-400 h-2.5 animate-pulse rounded-full" />
                                        <span className="w-0.5 bg-emerald-300 h-3.5 animate-bounce rounded-full" />
                                        <span className="w-0.5 bg-emerald-400 h-2 animate-pulse rounded-full" />
                                      </div>
                                    ) : (
                                      <Volume2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Texto en Inglés (Tipografía Limpia y Grande) */}
                              <p className="text-base text-white font-semibold leading-relaxed">
                                {line.en}
                              </p>

                              {/* Apoyo Fonético Opcional (solo visible si el usuario activa el botón de ayuda) */}
                              {showFigurativeHelper && line.phonetic && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[11px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                                    IPA: {line.phonetic}
                                  </span>
                                </div>
                              )}

                              {/* Traducción con Revelación Gradual */}
                              {isRevealed ? (
                                <p className="text-xs text-slate-400 font-normal pt-2 mt-1.5 border-t border-slate-800 leading-normal">
                                  {line.es}
                                </p>
                              ) : (
                                <button
                                  onClick={() => toggleLineTranslation(idx)}
                                  className="text-[10px] text-slate-400 hover:text-emerald-400 transition pt-1.5 flex items-center gap-1 block font-medium"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Toca para ver traducción</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* =========================================================
                    ETAPA 2: COMPRENSIÓN AUDITIVA GIST
                ========================================================= */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-6"
                  >
                    {/* Caja de Audio Clave */}
                    <div className="p-5 rounded-2xl bg-[#0c111c]/90 border border-slate-800 flex items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                            Pasaje Auditivo Clave
                          </span>
                          <span className="text-xs text-slate-400">
                            Escucha la pista sonora y deduce el sentido global:
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => speakText(activeLesson.step2_comprehension.audioContextText)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-slate-950 font-black text-xs transition shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Reproducir Pasaje</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Pregunta de Comprensión
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                        {activeLesson.step2_comprehension.prompt}
                      </h2>
                    </div>

                    {/* Opciones con Letras Grandes */}
                    <div className="space-y-3">
                      {activeLesson.step2_comprehension.options.map((opt, idx) => {
                        const isSelected = step2SelectedIdx === idx;
                        const isCorrect = idx === activeLesson.step2_comprehension.correctIndex;
                        const letters = ['A', 'B', 'C', 'D'];

                        let style = 'bg-[#0c111c] border-2 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#111928] shadow-xs';
                        if (isSelected) {
                          style = isCorrect
                            ? 'bg-emerald-950/50 border-2 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/40 font-semibold'
                            : 'bg-amber-950/50 border-2 border-amber-500 text-amber-100 ring-1 ring-amber-500/40 font-semibold';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setStep2SelectedIdx(idx);
                              if (isCorrect) {
                                soundManager.playSuccess();
                              } else {
                                soundManager.playGentleError();
                              }
                            }}
                            className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition flex items-center justify-between gap-4 shadow-sm ${style}`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs border ${isSelected
                                ? (isCorrect ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black' : 'bg-amber-500 text-slate-950 border-amber-400 font-black')
                                : 'bg-[#080c14] border-slate-800 text-slate-400'
                                }`}>
                                {letters[idx]}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {step2SelectedIdx !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed space-y-1 shadow-xs"
                      >
                        <span className="font-bold font-mono uppercase text-[10px] text-emerald-300 block">
                          💡 Explicación del Sentido Global:
                        </span>
                        <p>{activeLesson.step2_comprehension.explanation}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* =========================================================
                    ETAPA 3: RECONSTRUYE LA HISTORIA (SIGNIFICADO PRIMERO)
                ========================================================= */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-6"
                  >
                    {activeLesson.step3_story_sequence?.events && activeLesson.step3_story_sequence.events.length > 0 ? (
                      /* MODO PRINCIPAL: RECONSTRUYE LA HISTORIA NARRATIVA */
                      <div className="space-y-6">
                        <div className="space-y-2 text-center max-w-xl mx-auto">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
                            Etapa 3 • Reconstruye la Historia (Significado Primero)
                          </span>
                          <h2 className="text-base md:text-lg font-bold text-white pt-1">
                            {activeLesson.step3_story_sequence.instruction || "Ordena los eventos según ocurrieron en la conversación"}
                          </h2>
                          <p className="text-xs text-slate-400">
                            Toca cada evento en orden cronológico (1º, 2º, 3º). La sintaxis emerge de la narrativa.
                          </p>
                        </div>

                        {/* Secuencia seleccionada */}
                        <div className="p-4 rounded-2xl bg-[#080c14] border-2 border-dashed border-slate-700 min-h-[90px] flex flex-col gap-2">
                          {selectedStoryEventIds.length === 0 ? (
                            <div className="text-center text-xs text-slate-500 py-4 italic">
                              Toca los sucesos de abajo en el orden temporal en que sucedieron...
                            </div>
                          ) : (
                            selectedStoryEventIds.map((id, index) => {
                              const ev = activeLesson.step3_story_sequence?.events.find((e: StoryEvent) => e.id === id);
                              if (!ev) return null;
                              return (
                                <div
                                  key={id}
                                  onClick={() => handleSelectStoryEvent(id)}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0e1626] border border-teal-500/40 shadow-xs cursor-pointer hover:border-teal-400 transition"
                                  title="Toca para remover de la secuencia"
                                >
                                  <span className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">
                                    {index + 1}º
                                  </span>
                                  <div className="text-left flex-1">
                                    <p className="text-xs font-bold text-white">{ev.en}</p>
                                    <p className="text-[11px] text-slate-400 italic">{ev.es}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Eventos disponibles para ordenar */}
                        <div className="space-y-3">
                          {activeLesson.step3_story_sequence.events.map((ev: StoryEvent) => {
                            const isChosen = selectedStoryEventIds.includes(ev.id);
                            const orderNum = selectedStoryEventIds.indexOf(ev.id) + 1;
                            return (
                              <button
                                key={ev.id}
                                onClick={() => handleSelectStoryEvent(ev.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                                  isChosen
                                    ? 'bg-[#0e1626]/40 border-slate-800 opacity-50'
                                    : 'bg-[#0c111c] hover:bg-[#111928] border-slate-800 hover:border-teal-500/40 shadow-xs'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <p className="text-sm font-semibold text-white">{ev.en}</p>
                                  <p className="text-xs text-slate-400 italic">{ev.es}</p>
                                </div>
                                {isChosen ? (
                                  <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                                    {orderNum}
                                  </span>
                                ) : (
                                  <span className="w-6 h-6 rounded-full border border-slate-700 text-slate-400 text-xs font-mono flex items-center justify-center shrink-0">
                                    +
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Botón de Reset y Feedback */}
                        <div className="flex justify-center items-center gap-3 pt-1">
                          <button
                            onClick={handleResetStoryEvents}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c111c] text-slate-300 hover:text-white hover:bg-slate-800 text-xs border border-slate-700 transition font-medium"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reiniciar Orden</span>
                          </button>
                        </div>

                        {storyOrderCorrect === true && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 text-center font-bold shadow-xs"
                          >
                            ✨ ¡Excelente Reconstrucción! Has capturado con precisión la cronología y el significado de los eventos del diálogo.
                          </motion.div>
                        )}
                        {storyOrderCorrect === false && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 text-center font-medium shadow-xs"
                          >
                            💡 Revisa qué ocurrió al inicio de la conversación y qué se dijo hacia el final. Puedes tocar cualquier elemento para ajustar.
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      /* FALLBACK: CONSTRUCTOR SINTÁCTICO DE PALABRAS */
                      <>
                        <div className="space-y-2 text-center max-w-xl mx-auto">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
                            Etapa 3 • Sintaxis y Automatización
                          </span>
                          <h2 className="text-base md:text-lg font-bold text-white pt-1">
                            {activeLesson.step3_builder.instruction}
                          </h2>
                          <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 text-emerald-300 font-semibold text-sm shadow-xs">
                            &ldquo;{activeLesson.step3_builder.targetTranslationEs}&rdquo;
                          </div>
                        </div>

                        {/* Zona Magnética de Palabras Seleccionadas */}
                        <div className="min-h-[85px] p-4 rounded-2xl bg-[#080c14] border-2 border-dashed border-slate-700 flex flex-wrap gap-2.5 items-center justify-center transition shadow-inner">
                          {selectedTokens.length === 0 ? (
                            <span className="text-xs text-slate-500 italic">
                              Toca las palabras de abajo en el orden natural en inglés...
                            </span>
                          ) : (
                            selectedTokens.map((token) => (
                              <motion.button
                                key={token.id}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={() => handleDeselectToken(token.id)}
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-sm hover:opacity-90 transition active:scale-95"
                                title="Toca para remover"
                              >
                                {token.text}
                              </motion.button>
                            ))
                          )}
                        </div>

                        {/* Banco de Palabras Disponibles (Mapeo por ID único) */}
                        <div className="flex flex-wrap gap-2.5 justify-center pt-1">
                          {availableTokens.map((token) => {
                            const isUsed = selectedTokens.some((t) => t.id === token.id);
                            return (
                              <button
                                key={token.id}
                                onClick={() => handleSelectToken(token)}
                                disabled={isUsed}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition duration-150 ${isUsed
                                  ? 'opacity-30 border-slate-800 bg-[#080c14] cursor-not-allowed text-slate-600'
                                  : 'bg-[#0c111c] hover:bg-[#111928] border-2 border-slate-800 hover:border-slate-700 text-slate-200 shadow-xs active:translate-y-0.5'
                                  }`}
                              >
                                {token.text}
                              </button>
                            );
                          })}
                        </div>

                        {/* Botones de Control */}
                        <div className="flex justify-center items-center gap-3 pt-2">
                          <button
                            onClick={handleResetTokens}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0c111c] text-slate-300 hover:text-white hover:bg-slate-800 text-xs border border-slate-700 transition font-medium"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reiniciar</span>
                          </button>

                          <button
                            onClick={checkSentenceBuilder}
                            disabled={selectedTokens.length === 0}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 disabled:opacity-30 text-slate-950 font-black text-xs transition shadow-sm"
                          >
                            Comprobar Frase
                          </button>
                        </div>

                        {builderStatus === 'CORRECT' && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 text-center font-bold shadow-xs"
                          >
                            ✨ ¡Sintaxis Perfecta! Has ensamblado los elementos respetando el orden natural del inglés.
                          </motion.div>
                        )}
                        {builderStatus === 'WRONG' && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 text-center font-medium shadow-xs"
                          >
                            Casi. Revisa la colocación de los adverbios y auxiliares y vuelve a intentarlo.
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* =========================================================
                    ETAPA 4: SHADOWING STUDIO (LABORATORIO FONÉTICO)
                ========================================================= */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                        Etapa 4 • Fonética Enlazada & Shadowing
                      </span>
                      <h2 className="text-base md:text-lg font-bold text-white pt-1">
                        {activeLesson.step4_shadowing.instruction}
                      </h2>
                    </div>

                    {/* Selector de Frases de Shadowing */}
                    <div className="space-y-3.5">
                      {activeLesson.step4_shadowing.phrases.map((phrase, idx) => {
                        const isCurrentActivePhrase = activeShadowingPhraseIdx === idx;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setActiveShadowingPhraseIdx(idx);
                              setPronunciationResult(null);
                              setSpokenTranscript('');
                              soundManager.playClick();
                            }}
                            className={`p-4 md:p-5 rounded-2xl cursor-pointer transition space-y-2.5 shadow-xs border-2 ${
                              isCurrentActivePhrase
                                ? 'bg-[#0e1626] border-cyan-500 ring-2 ring-cyan-500/20 shadow-md text-white'
                                : 'bg-[#0c111c]/90 border-slate-800 hover:border-slate-700 hover:bg-[#111928] text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-md font-bold uppercase">
                                {phrase.levelLabel} {isCurrentActivePhrase && '• Seleccionada'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakText(phrase.en);
                                }}
                                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 transition bg-[#080c14] px-3 py-1.5 rounded-xl border border-slate-800 font-medium"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Escuchar Modelo</span>
                              </button>
                            </div>

                            <h3 className="text-base md:text-lg font-bold text-white">
                              &ldquo;{phrase.en}&rdquo;
                            </h3>

                            {/* Fonética IPA Técnica como Estándar */}
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/40 shadow-xs" title="Alfabeto Fonético Internacional">
                                IPA: {phrase.phonetic}
                              </span>
                              {showFigurativeHelper && (
                                <span className="text-xs font-medium text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30 italic">
                                  💡 Suena parecido a: &ldquo;{getFigurativePronunciation(phrase.en, phrase.phonetic)}&rdquo;
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{phrase.tip}</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Consola de Grabación y Reconocimiento de Voz Real (Web Speech API) */}
                    {(() => {
                      const activePhrase = activeLesson.step4_shadowing.phrases[activeShadowingPhraseIdx] || activeLesson.step4_shadowing.phrases[0];
                      return (
                        <div className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 flex flex-col items-center justify-center gap-4 text-center shadow-sm">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                              Práctica Activa de Voz (Frase {activeShadowingPhraseIdx + 1} de {activeLesson.step4_shadowing.phrases.length})
                            </span>
                            <p className="text-xs text-slate-400">
                              Activa tu micrófono, emula la entonación y habla claramente en inglés:
                            </p>
                          </div>

                          {/* Botón Principal de Micrófono */}
                          <div className="flex items-center gap-3">
                            {isRecording ? (
                              <button
                                onClick={handleStopSpeechPractice}
                                className="flex items-center gap-2.5 text-xs font-black px-7 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-lg shadow-rose-600/30 transition"
                              >
                                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                                <span>Detener Grabación y Evaluar</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartSpeechPractice(activePhrase.en)}
                                className="flex items-center gap-2.5 text-xs font-black px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 shadow-md shadow-cyan-500/20 transition"
                              >
                                <Mic className="w-4 h-4 text-slate-950" />
                                <span>Grabar Mi Voz con Micrófono Real</span>
                              </button>
                            )}
                          </div>

                          {/* Transcripción en vivo mientras habla */}
                          {isRecording && (
                            <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 max-w-md w-full">
                              <span className="text-[10px] text-slate-400 font-mono block">Capturando tu voz en vivo:</span>
                              <p className="text-sm font-bold text-cyan-300 italic">
                                &ldquo;{spokenTranscript || 'Habla ahora...'}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Mensaje de Error / Fallback amigable */}
                          {speechError && (
                            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 max-w-md">
                              {speechError}
                            </div>
                          )}

                          {/* Resultados de Evaluación Fonética Tokenizada */}
                          {pronunciationResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-5 rounded-2xl bg-[#080c14] border-2 border-cyan-500/40 w-full max-w-lg space-y-3.5 text-left shadow-xs"
                            >
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <Activity className="w-4 h-4 text-cyan-400" />
                                  <span>Diagnóstico de Articulación y Ritmo</span>
                                </span>
                                <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                                  pronunciationResult.accuracyScore >= 70
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                    : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                }`}>
                                  {pronunciationResult.accuracyScore}% Precisión
                                </span>
                              </div>

                              {/* Fichas de Palabras Identificadas */}
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                                  Validación por Término:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {pronunciationResult.wordResults.map((wRes, wIdx) => (
                                    <span
                                      key={wIdx}
                                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-medium ${
                                        wRes.isMatched
                                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold'
                                          : wRes.isPartial
                                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 font-bold'
                                          : 'bg-slate-900 border-slate-800 text-slate-600 line-through'
                                      }`}
                                    >
                                      {wRes.word}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                                {pronunciationResult.feedbackMessage}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {/* =========================================================
                    ETAPA 5: NOTICING OPCIONAL (ATENCIÓN CONSCIENTE SIN CASTIGO)
                ========================================================= */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 text-center max-w-xl mx-auto">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
                        Etapa 5 • Noticing Opcional (Atención Consciente)
                      </span>
                      <h2 className="text-base md:text-lg font-bold text-white pt-1">
                        {activeLesson.step5_noticing?.concept || activeLesson.step5_monitor.explanationConcept}
                      </h2>
                      <p className="text-xs text-slate-400">
                        Paso voluntario de baja ansiedad. Explora los matices pragmáticos si deseas reflexionar, o avanza directamente a la etapa 6.
                      </p>
                    </div>

                    {/* Tarjeta Desplegable de Noticing (Reflexión Pragmática) */}
                    <div className="p-5 md:p-6 rounded-3xl bg-[#0c111c]/90 border border-purple-500/40 shadow-sm space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-xs">
                            💡
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block">
                              Frase Observada en el Diálogo:
                            </span>
                            <strong className="text-sm text-white">
                              &ldquo;{activeLesson.step5_noticing?.quoteEn || activeLesson.step1_dialogue.lines[0]?.en}&rdquo;
                            </strong>
                            {activeLesson.step5_noticing?.quoteEs && (
                              <span className="text-xs text-slate-400 block italic">
                                &ldquo;{activeLesson.step5_noticing.quoteEs}&rdquo;
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setNoticingExpanded(!noticingExpanded)}
                          className="text-xs font-bold text-purple-300 hover:text-white px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 transition"
                        >
                          {noticingExpanded ? 'Ocultar Análisis' : '¿Por qué se dice así?'}
                        </button>
                      </div>

                      {noticingExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-3 border-t border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed"
                        >
                          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
                            <span className="font-bold text-purple-200 block text-[11px] font-mono uppercase">
                              🌱 Razón Pragmática y Comunicativa:
                            </span>
                            <p>
                              {activeLesson.step5_noticing?.explanation || activeLesson.step5_monitor.ruleInsight}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Comprensión Pragmática: Intención del Hablante (Sin penalización) */}
                    {activeLesson.step5_noticing?.pragmaticChoice ? (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-300">
                            {activeLesson.step5_noticing.pragmaticChoice.prompt}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {activeLesson.step5_noticing.pragmaticChoice.options.map((opt: string, optIdx: number) => {
                            const isChosen = step5SelectedIdx === optIdx;
                            const isCorrect = optIdx === activeLesson.step5_noticing?.pragmaticChoice?.correctIndex;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setStep5SelectedIdx(optIdx);
                                  if (isCorrect) soundManager.playSuccess();
                                  else soundManager.playClick();
                                }}
                                className={`p-4 rounded-2xl border text-left transition space-y-2 shadow-xs ${
                                  isChosen
                                    ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/40 text-purple-100'
                                    : 'bg-[#0c111c] hover:bg-[#111928] border-slate-800 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#080c14] border border-slate-800 text-slate-400">
                                    Opción {optIdx === 0 ? 'A' : 'B'}
                                  </span>
                                  {isCorrect && isChosen && (
                                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                      Recomendada
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-bold text-white">
                                  {opt}
                                </p>
                              </button>
                            );
                          })}
                        </div>

                        {step5SelectedIdx !== null && activeLesson.step5_noticing?.pragmaticChoice?.insight && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200"
                          >
                            💡 {activeLesson.step5_noticing.pragmaticChoice.insight}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      /* Fallback con opciones existentes bajo enfoque reflexivo */
                      <div className="space-y-3">
                        <div className="text-center text-xs text-slate-400 font-medium pb-1">
                          ¿Cuál de estas formulaciones refleja mejor el uso natural angloparlante?
                        </div>
                        {activeLesson.step5_monitor.options.map((opt, idx) => {
                          const isSelected = step5SelectedIdx === idx;
                          const isCorrect = idx === activeLesson.step5_monitor.correctIndex;
                          const letters = ['A', 'B', 'C'];

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setStep5SelectedIdx(idx);
                                if (isCorrect) soundManager.playSuccess();
                                else soundManager.playClick();
                              }}
                              className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition flex items-center justify-between gap-4 shadow-sm ${
                                isSelected
                                  ? 'bg-purple-950/60 border-2 border-purple-500 text-purple-100 font-semibold'
                                  : 'bg-[#0c111c] border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#111928]'
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs border ${
                                  isSelected ? 'bg-purple-500 text-white border-purple-400' : 'bg-[#080c14] border-slate-800 text-slate-400'
                                }`}>
                                  {letters[idx]}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* =========================================================
                    ETAPA 6: RETO DE MAESTRÍA FINAL Y VICTORIA
                ========================================================= */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-6"
                  >
                    {!lessonFinished ? (
                      <>
                        <div className="space-y-2 text-center">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                            Etapa 6 • Reto de Desbloqueo Final
                          </span>
                          <h2 className="text-lg md:text-xl font-bold text-white pt-1">
                            {activeLesson.step6_mastery.question}
                          </h2>
                        </div>

                        <div className="space-y-3">
                          {activeLesson.step6_mastery.options.map((opt, idx) => {
                            const isSelected = step6SelectedIdx === idx;
                            const isCorrect = idx === activeLesson.step6_mastery.correctIndex;
                            const letters = ['A', 'B', 'C'];

                            let style = 'bg-[#0c111c] border-2 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#111928] shadow-xs';
                            if (isSelected) {
                              style = isCorrect
                                ? 'bg-emerald-950/50 border-2 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/40 font-semibold'
                                : 'bg-amber-950/50 border-2 border-amber-500 text-amber-100 ring-1 ring-amber-500/40 font-semibold';
                            }

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setStep6SelectedIdx(idx);
                                  if (isCorrect) {
                                    setLessonFinished(true);
                                    soundManager.playSuccess();
                                  } else {
                                    soundManager.playGentleError();
                                  }
                                }}
                                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition flex items-center justify-between gap-4 shadow-sm ${style}`}
                              >
                                <div className="flex items-center gap-3.5">
                                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs border ${isSelected
                                    ? (isCorrect ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black' : 'bg-amber-500 text-slate-950 border-amber-400 font-black')
                                    : 'bg-[#080c14] border-slate-800 text-slate-400'
                                    }`}>
                                    {letters[idx]}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                                {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      /* PANTALLA DE CELEBRACIÓN Y DESBLOQUEO */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-8 rounded-3xl bg-[#0c111c]/95 border-2 border-emerald-500/40 shadow-2xl space-y-6 max-w-lg mx-auto"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                          <Trophy className="w-10 h-10 stroke-[2.5]" />
                        </div>

                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white">¡Clase Intensiva Conquistada!</h2>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {activeLesson.step6_mastery.successMessage}
                          </p>
                        </div>

                        <div className="flex justify-center gap-4 text-xs font-mono">
                          <div className="p-3.5 rounded-2xl bg-[#080c14] border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">RECOMPENSA</span>
                            <span className="text-emerald-400 font-extrabold text-base">+{activeLesson.xpReward} XP</span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#080c14] border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">RACHA ACTIVA</span>
                            <span className="text-amber-400 font-extrabold text-base">3 Días 🔥</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={completeLessonAndUnlockNext}
                            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2"
                          >
                            <span>Continuar Ruta de Adquisición</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              completeLessonAndUnlockNext();
                              setCurrentView('IMMERSION');
                              soundManager.playClick();
                            }}
                            className="px-5 py-3.5 rounded-2xl bg-[#0e1626] hover:bg-slate-800 text-slate-200 font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            <span>Explorar Inmersión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom Bar de Navegación entre Etapas */}
            {!lessonFinished && (
              <footer className="border-t border-slate-800 px-4 md:px-8 py-3.5 bg-[#090d16]/95 backdrop-blur-xl flex items-center justify-between shadow-xs">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-4 py-2 rounded-xl bg-[#0c111c] text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold disabled:opacity-20 transition border border-slate-700"
                >
                  ← Etapa Anterior
                </button>

                <button
                  onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                  disabled={currentStep === 6}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r ${activeTheme.btnGradient} ${activeTheme.btnText} font-black text-xs transition shadow-md hover:opacity-95 disabled:opacity-20`}
                >
                  <span>Siguiente Etapa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </footer>
            )}

          </div>
        )}
      </AnimatePresence>

      {/* Modal de Perfil de Usuario Completo */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
        streakDays={streakDays}
        userXp={userXp}
        immersionMinutes={immersionMinutes}
      />

    </div>
  );
}
