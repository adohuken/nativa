'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Headphones,
  Phone,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  BookOpen,
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck,
  Award,
  Clock,
  Layers,
  ArrowRight,
  User,
  Star,
  Check,
  Mic,
  AlertTriangle,
  Radio,
  Activity,
  FileText,
  RotateCw
} from 'lucide-react';
import { FluentiaLogo } from '@/components/fluentia-logo';
import { ImmersionViewerModal } from '@/components/immersion-viewer-modal';
import { UserProfileModal } from '@/components/user-profile-modal';
import { RadarSkillsChart, SkillScores } from '@/components/radar-skills-chart';
import { soundManager } from '@/lib/sound-effects';
import { AppStorage, UserProfile } from '@/lib/storage';
import { SubNode } from '@/content/course-content';
import {
  getTrackBySlug,
  getTrackCourseContent,
  SpecializedTrack
} from '@/lib/specialized-tracks';

export default function SpecializedTrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-amber-400 font-mono text-xs">
        Cargando track de especialización BPO...
      </div>
    }>
      <SpecializedTrackContent />
    </Suspense>
  );
}

function SpecializedTrackContent() {
  const params = useParams();
  const router = useRouter();
  const language = (params?.language as string) || 'english';
  const trackSlug = (params?.track as string) || 'call-center';

  // Obtener track y contenido
  const track: SpecializedTrack = useMemo(() => getTrackBySlug(trackSlug), [trackSlug]);
  const [courseContent, setCourseContent] = useState(() => getTrackCourseContent(trackSlug));

  // Estado del usuario y persistencia
  const [userProfile, setUserProfile] = useState<UserProfile>(() => AppStorage.getUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userXp, setUserXp] = useState(380);
  const [streakDays, setStreakDays] = useState(5);
  const [immersionMinutes, setImmersionMinutes] = useState(45);

  // Subnodos y Nodos completados
  const [completedSubNodes, setCompletedSubNodes] = useState<string[]>([]);
  const [selectedSubNode, setSelectedSubNode] = useState<SubNode | null>(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');

  // Destrezas para el Radar BPO
  const [skillScores, setSkillScores] = useState<SkillScores>(() => {
    try {
      const saved = AppStorage.getSkillScores();
      if (saved) return saved;
    } catch {}
    return { listening: 75, speaking: 60, reading: 80, writing: 65 };
  });

  // Estado del reproductor de cliente enojado (Módulo 4)
  const [isPlayingAngryAudio, setIsPlayingAngryAudio] = useState(false);
  const [showAngryTranscript, setShowAngryTranscript] = useState(false);
  const [angrySimulationNotice, setAngrySimulationNotice] = useState<string | null>(null);

  const angryAudioText = "Listen to me! I have been on hold for forty-five minutes and your representative hung up on me! My flight leaves in three hours and your booking system canceled my ticket without my authorization! If this is not resolved right now, I am calling my lawyer and filing a fraud report!";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedXp = AppStorage.getXp('english');
        if (storedXp) setUserXp(storedXp);

        const storedStreak = AppStorage.getStreak('english');
        if (storedStreak) setStreakDays(storedStreak);

        const storedMins = AppStorage.getImmersionMinutes('english');
        if (storedMins) setImmersionMinutes(storedMins);

        const storedSubNodes = AppStorage.getCompletedSubNodes();
        if (storedSubNodes) setCompletedSubNodes(storedSubNodes);

        const storedSkills = AppStorage.getSkillScores();
        if (storedSkills) setSkillScores(storedSkills);

        setCourseContent(getTrackCourseContent(trackSlug));
      } catch {}
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [trackSlug]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  // Nodos y módulos
  const modulesList = useMemo(() => {
    return Object.values(courseContent.modules).sort((a, b) => a.unitNumber - b.unitNumber);
  }, [courseContent]);

  const allLessons = useMemo(() => {
    const list: any[] = [];
    modulesList.forEach((mod) => {
      Object.values(mod.lessons || {}).forEach((lesson) => {
        list.push({ ...lesson, moduleTitle: mod.title, moduleId: mod.moduleId });
      });
    });
    return list;
  }, [modulesList]);

  // Cálculo de progreso BPO
  const totalSubNodesCount = useMemo(() => {
    let count = 0;
    allLessons.forEach((l) => {
      count += l.subNodes?.length || 0;
    });
    return count || 1;
  }, [allLessons]);

  const completedTrackSubNodesCount = useMemo(() => {
    let count = 0;
    allLessons.forEach((l) => {
      l.subNodes?.forEach((sn: SubNode) => {
        if (completedSubNodes.includes(sn.id)) count++;
      });
    });
    return count;
  }, [allLessons, completedSubNodes]);

  const progressPercentage = Math.round((completedTrackSubNodesCount / totalSubNodesCount) * 100);

  // Reproductor de llamada de cliente enfurecido
  const playAngryCallerAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAngryAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAngryAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAngryAudio(true);
    const utter = new SpeechSynthesisUtterance(angryAudioText);
    utter.lang = 'en-US';
    utter.rate = 1.15; // Ritmo agitado y urgente
    utter.pitch = 1.1; // Tono tenso
    utter.onend = () => setIsPlayingAngryAudio(false);
    utter.onerror = () => setIsPlayingAngryAudio(false);
    window.speechSynthesis.speak(utter);
  };

  const handleStartRoleplaySimulation = () => {
    setAngrySimulationNotice("La conexión con micrófono en vivo mediante Gemini Live Audio API se activará en el próximo release. Mientras tanto, escucha la llamada del cliente enojado arriba y practica tu respuesta con la fórmula de desescalada HEAT.");
    soundManager.playClick();
    setTimeout(() => setAngrySimulationNotice(null), 8000);
  };

  // Manejador para abrir el visor de inmersión
  const handleOpenSubNode = (subNode: SubNode) => {
    setSelectedSubNode(subNode);
    setIsViewerModalOpen(true);
    soundManager.playClick();
  };

  // Completar subnodo
  const handleCompleteSubNode = (subNodeId: string) => {
    if (!completedSubNodes.includes(subNodeId)) {
      const next = [...completedSubNodes, subNodeId];
      setCompletedSubNodes(next);
      AppStorage.saveCompletedSubNodes(next);

      const nextXp = userXp + 25;
      setUserXp(nextXp);
      AppStorage.saveXp(nextXp, 'english');

      const nextMins = AppStorage.addImmersionMinutes(3, 'english');
      setImmersionMinutes(nextMins);

      // Mejorar radar BPO ligeramente
      const updatedSkills = {
        ...skillScores,
        listening: Math.min(100, skillScores.listening + 1),
        reading: Math.min(100, skillScores.reading + 1),
      };
      setSkillScores(updatedSkills);
      AppStorage.saveSkillScores(updatedSkills);

      soundManager.playSuccess();
    }
    setIsViewerModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Fondo con resplandor cálido corporativo BPO */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-orange-950/20 via-amber-950/10 to-transparent pointer-events-none -z-10" />

      {/* =====================================================================
          HEADER DEL TRACK
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-orange-300 flex items-center justify-center transition group"
            title="Volver al Dashboard Principal"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <FluentiaLogo size="sm" />
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-950/70 border border-orange-500/40 text-[11px] font-mono font-bold text-orange-300 shadow-sm">
            <Headphones className="w-3.5 h-3.5 text-orange-400" />
            Track Especializado: Call Center English
          </span>
        </div>

        {/* Métricas y Perfil */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#0b101c] border border-slate-800/90 text-xs font-mono shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-400" title="Racha de estudio">
              <Flame className="w-4 h-4 fill-current" />
              <span className="font-bold">{streakDays}d</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-orange-400" title="Experiencia total">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-bold">{userXp} XP</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-amber-300" title="Minutos de inmersión acumulados">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{immersionMinutes}m</span>
            </div>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido'}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-orange-300 flex items-center justify-center transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              soundManager.playClick();
            }}
            className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-[#0b101c] hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 transition group shadow-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-orange-950/70 border border-orange-500/40 flex items-center justify-center shrink-0 text-base shadow-sm">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{userProfile.avatarEmoji || '🎧'}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-orange-300 transition">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN LAYOUT (CONTENIDO + SIDEBAR CON RADAR Y PROGRESO BPO)
      ===================================================================== */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ===================================================================
            COLUMNA PRINCIPAL DE APRENDIZAJE
        =================================================================== */}
        <main className="flex-1 w-full space-y-8">
          
          {/* HERO BANNER DEL TRACK */}
          <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1b0a05] via-[#140804] to-[#080d16] border-2 border-orange-500/50 shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-xs font-mono font-bold text-orange-300">
                    <Headphones className="w-3.5 h-3.5 text-orange-400" />
                    Ruta Especializada BPO & Customer Service Pro
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-[11px] font-mono text-amber-300 font-semibold">
                    Nivel {track.level}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {track.title}
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {track.description}
                </p>

                {/* Resumen Móvil del Progreso BPO */}
                <div className="pt-2 block lg:hidden space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold">Progreso BPO:</span>
                    <span className="text-orange-400 font-bold">
                      {progressPercentage}% ({completedTrackSubNodesCount}/{totalSubNodesCount} Nodos)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta Resumen Operativo */}
              <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/30 text-xs font-mono space-y-2 shrink-0 w-full md:w-56 shadow-lg">
                <div className="text-orange-300 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-orange-400" />
                  Estructura BPO
                </div>
                <div className="text-white flex items-center justify-between">
                  <span>Módulos:</span>
                  <strong className="text-orange-400 font-bold">4 Fases</strong>
                </div>
                <div className="text-white flex items-center justify-between">
                  <span>Nodos Madre:</span>
                  <strong className="text-amber-400 font-bold">8 Lecciones</strong>
                </div>
                <div className="text-white flex items-center justify-between">
                  <span>Sub-Nodos:</span>
                  <strong className="text-emerald-400 font-bold">24 Inmersiones</strong>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================
              FILTRO DE MÓDULOS (FASES OPERACIONALES)
          =================================================================== */}
          <section className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => {
                setSelectedModuleFilter('ALL');
                soundManager.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                selectedModuleFilter === 'ALL'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Todas las Fases
            </button>
            {modulesList.map((mod) => (
              <button
                key={mod.moduleId}
                onClick={() => {
                  setSelectedModuleFilter(mod.moduleId);
                  soundManager.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  selectedModuleFilter === mod.moduleId
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>Fase {mod.unitNumber}</span>
              </button>
            ))}
          </section>

          {/* ===================================================================
              LISTA DE MÓDULOS Y NODOS MADRE
          =================================================================== */}
          <section className="space-y-8">
            {modulesList
              .filter((mod) => selectedModuleFilter === 'ALL' || selectedModuleFilter === mod.moduleId)
              .map((mod) => {
                const lessons = Object.values(mod.lessons || {});
                const isModule4 = mod.moduleId === 'mod-cc-4';

                return (
                  <div
                    key={mod.moduleId}
                    className="rounded-3xl p-6 sm:p-8 bg-[#0b101c] border border-slate-800/90 shadow-xl space-y-6 relative overflow-hidden"
                  >
                    {/* Encabezado del Módulo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[11px] font-mono font-bold">
                            FASE {mod.unitNumber}
                          </span>
                          <span className="text-xs font-mono text-slate-400">Objetivo Operacional BPO</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">{mod.title}</h2>
                      </div>
                    </div>

                    {/* Nodos Madre dentro de este Módulo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {lessons.map((lesson) => {
                        const readingSub = lesson.subNodes?.find((s: SubNode) => s.type === 'reading');
                        const listeningSub = lesson.subNodes?.find((s: SubNode) => s.type === 'listening');
                        const srsSub = lesson.subNodes?.find((s: SubNode) => s.type === 'srs');

                        const isReadingDone = readingSub && completedSubNodes.includes(readingSub.id);
                        const isListeningDone = listeningSub && completedSubNodes.includes(listeningSub.id);
                        const isSrsDone = srsSub && completedSubNodes.includes(srsSub.id);
                        const isMotherNodeDone = isReadingDone && isListeningDone && isSrsDone;

                        return (
                          <div
                            key={lesson.lessonId}
                            className={`rounded-2xl p-5 border transition-all ${
                              isMotherNodeDone
                                ? 'bg-gradient-to-br from-[#0c181f] to-[#080d16] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                                : 'bg-[#090d16] border-slate-800/90 hover:border-orange-500/40 shadow-md'
                            }`}
                          >
                            {/* Cabecera del Nodo Madre */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-300 font-mono font-black text-xs flex items-center justify-center">
                                    {lesson.lessonCode}
                                  </span>
                                  <span className="text-[11px] font-mono text-slate-400">Nodo de Especialización</span>
                                </div>
                                <h3 className="text-base font-bold text-white leading-snug">{lesson.title}</h3>
                              </div>

                              {isMotherNodeDone && (
                                <div
                                  className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm"
                                  title="Nodo Madre 100% Completado"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            {/* Sub-Nodos de Inmersión (Trilogía SLA: Reading, Listening, SRS) */}
                            <div className="space-y-2 pt-2 border-t border-slate-800/70">
                              {/* Sub-Nodo Reading */}
                              {readingSub && (
                                <button
                                  onClick={() => handleOpenSubNode(readingSub)}
                                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition group ${
                                    isReadingDone
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                      : 'bg-[#0b101c] border-slate-800 hover:border-orange-500/40 text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                        isReadingDone
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : 'bg-slate-800 text-orange-400 group-hover:bg-orange-500/20'
                                      }`}
                                    >
                                      <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-tight">
                                      <div className="text-xs font-bold">{readingSub.title}</div>
                                      <div className="text-[10px] font-mono text-slate-500">
                                        Lectura BPO • Glosario SRS Interactivo
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isReadingDone ? (
                                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Hecho
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono text-orange-400 group-hover:underline flex items-center gap-0.5">
                                        Iniciar <ChevronRight className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )}

                              {/* Sub-Nodo Listening */}
                              {listeningSub && (
                                <button
                                  onClick={() => handleOpenSubNode(listeningSub)}
                                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition group ${
                                    isListeningDone
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                      : 'bg-[#0b101c] border-slate-800 hover:border-orange-500/40 text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                        isListeningDone
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : 'bg-slate-800 text-amber-400 group-hover:bg-amber-500/20'
                                      }`}
                                    >
                                      <Headphones className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-tight">
                                      <div className="text-xs font-bold">{listeningSub.title}</div>
                                      <div className="text-[10px] font-mono text-slate-500">
                                        Audio Real BPO • Cápsula Cultural
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isListeningDone ? (
                                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Hecho
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono text-amber-400 group-hover:underline flex items-center gap-0.5">
                                        Escuchar <ChevronRight className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )}

                              {/* Sub-Nodo SRS */}
                              {srsSub && (
                                <button
                                  onClick={() => handleOpenSubNode(srsSub)}
                                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition group ${
                                    isSrsDone
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                      : 'bg-[#0b101c] border-slate-800 hover:border-orange-500/40 text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                        isSrsDone
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : 'bg-slate-800 text-orange-300 group-hover:bg-orange-500/20'
                                      }`}
                                    >
                                      <Brain className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-tight">
                                      <div className="text-xs font-bold">{srsSub.title}</div>
                                      <div className="text-[10px] font-mono text-slate-500">
                                        Repaso Espaciado • Frases Clave
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isSrsDone ? (
                                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Hecho
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono text-orange-300 group-hover:underline flex items-center gap-0.5">
                                        Repasar <ChevronRight className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* =========================================================
                        MÓDULO 4: SECCIÓN ESPECIAL ROLEPLAY CON IA & CLIENTE ENOJADO
                    ========================================================= */}
                    {isModule4 && (
                      <div className="mt-8 pt-6 border-t-2 border-orange-500/30 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-red-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30">
                              <Mic className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-400" />
                                  Escenario de Alta Tensión • Desescalada
                                </span>
                              </div>
                              <h3 className="text-lg font-black text-white mt-0.5">
                                Laboratorio de Roleplay con IA • Simulación Telefónica BPO
                              </h3>
                            </div>
                          </div>

                          {/* Botón Simulación de Llamada (Próximamente) */}
                          <button
                            onClick={handleStartRoleplaySimulation}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:opacity-90 text-white font-black text-xs transition shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 border border-orange-400/40 shrink-0 active:scale-95 cursor-pointer"
                          >
                            <Mic className="w-4 h-4" />
                            <span>Simulación de Llamada (Próximamente)</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                          </button>
                        </div>

                        {/* Aviso temporal al hacer clic */}
                        {angrySimulationNotice && (
                          <div className="p-3.5 rounded-2xl bg-orange-950/70 border border-orange-500/50 text-xs font-sans text-orange-200 leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {angrySimulationNotice}
                          </div>
                        )}

                        {/* REPRODUCTOR DE AUDIO: CLIENTE ENOJADO */}
                        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1a0804] via-[#120704] to-[#070b14] border-2 border-red-500/40 shadow-xl space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-bold">
                                  Llamada Entrante • Caso Crítico #9924
                                </span>
                                <span className="text-slate-400">Cliente: Gregory Vance</span>
                              </div>
                              <h4 className="text-base font-bold text-white flex items-center gap-2">
                                <span>Reproductor de Audio: Cliente Enfurecido (Irate Caller)</span>
                              </h4>
                            </div>

                            {/* Controles de Reproducción */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={playAngryCallerAudio}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                  isPlayingAngryAudio
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse'
                                    : 'bg-red-950/80 border border-red-500/50 text-red-200 hover:bg-red-900/60'
                                }`}
                              >
                                {isPlayingAngryAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                <span>{isPlayingAngryAudio ? 'Pausar Audio' : 'Reproducir Audio del Cliente'}</span>
                              </button>

                              <button
                                onClick={() => setShowAngryTranscript(!showAngryTranscript)}
                                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition"
                              >
                                {showAngryTranscript ? 'Ocultar Guión' : 'Ver Guión'}
                              </button>
                            </div>
                          </div>

                          {/* Barra de Ondas de Audio Animada */}
                          <div className="p-3 rounded-2xl bg-black/60 border border-red-950/80 flex items-center justify-center gap-1.5 h-12">
                            {[40, 75, 95, 60, 85, 100, 70, 90, 50, 80, 65, 95, 75, 55, 90, 100, 45, 80].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-200 ${
                                  isPlayingAngryAudio
                                    ? 'bg-gradient-to-t from-orange-500 to-red-500 animate-pulse'
                                    : 'bg-red-950/40'
                                }`}
                                style={{
                                  height: isPlayingAngryAudio ? `${h}%` : '20%',
                                  animationDelay: `${i * 0.05}s`
                                }}
                              />
                            ))}
                          </div>

                          {/* Guión Desplegable */}
                          {showAngryTranscript && (
                            <div className="p-4 rounded-2xl bg-black/70 border border-red-900/40 space-y-2 text-xs font-sans leading-relaxed">
                              <p className="text-red-300 font-mono font-bold">
                                Transcripción Original en Inglés:
                              </p>
                              <p className="text-slate-200 italic">
                                &ldquo;{angryAudioText}&rdquo;
                              </p>
                              <p className="text-slate-400 pt-2 border-t border-slate-800">
                                <strong>Traducción:</strong> &ldquo;¡Escúcheme bien! ¡Llevo 45 minutos en espera y su representante me colgó! Mi vuelo sale en tres horas y su sistema canceló mi boleto sin mi autorización. Si esto no se resuelve ya mismo, ¡llamaré a mi abogado y presentaré un reporte por fraude!&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Recomendación de Desescalada HEAT */}
                          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs font-sans space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                              Estrategia Recomendada de Desescalada (HEAT Framework):
                            </span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              Baja tu tono vocal a la mitad de velocidad y responde con propiedad personal: 
                              <span className="text-amber-200 font-semibold block mt-1">
                                &ldquo;Mr. Vance, I hear you, and you have every right to be angry. Being disconnected with your flight on the line is completely unacceptable. My name is [Your Name], and I am taking personal ownership of your ticket right now until you are safely booked.&rdquo;
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
          </section>
        </main>

        {/* ===================================================================
            SIDEBAR LATERAL BPO (RADAR DE DESTREZAS + PROGRESO BPO)
        =================================================================== */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-24">
          
          {/* TARJETA 1: CONTADOR DE PROGRESO BPO */}
          <div className="p-5 rounded-3xl bg-[#0b101c] border-2 border-orange-500/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-orange-300 font-black flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-orange-400" />
                Progreso BPO
              </span>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded-full">
                {progressPercentage}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Nodos de Inmersión:</span>
                <strong className="text-white">
                  {completedTrackSubNodesCount} / {totalSubNodesCount}
                </strong>
              </div>

              {/* Barra de Progreso BPO */}
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 transition-all duration-700 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 pt-1 leading-snug">
                Medición continua de adquisición en protocolos de atención al cliente y BPO.
              </p>
            </div>
          </div>

          {/* TARJETA 2: GRÁFICO DE RADAR DE DESTREZAS BPO */}
          <div className="p-5 rounded-3xl bg-[#0b101c] border border-slate-800/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-orange-400" />
                Destrezas BPO (Radar)
              </span>
              <span className="text-[10px] font-mono text-orange-300 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded-md">
                4 Áreas
              </span>
            </div>

            {/* Gráfico de Radar SVG (Listening, Speaking, Reading, Writing) */}
            <div className="py-1">
              <RadarSkillsChart scores={skillScores} />
            </div>

            <div className="text-[10px] font-mono text-slate-400 text-center border-t border-slate-800/80 pt-2">
              Métricas SLA operacionales: Listening telefónico, fonética, lectura técnica y CRM.
            </div>
          </div>

          {/* TARJETA 3: FASES OPERACIONALES BPO */}
          <div className="p-4 rounded-3xl bg-[#080d16] border border-slate-800/80 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Fases del Curriculum BPO:
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>1. Primer Contacto</span>
                <span className="text-orange-400 font-bold">Apertura</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>2. Resolución</span>
                <span className="text-amber-400 font-bold">Hold & AHT</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>3. Cliente Difícil</span>
                <span className="text-red-400 font-bold">HEAT Desescalada</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                <span>4. Soporte & Cierre</span>
                <span className="text-emerald-400 font-bold">FCR & CSAT</span>
              </div>
            </div>
          </div>

          {/* REGLA DE ORO BPO */}
          <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 space-y-1.5 text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 text-orange-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Regla de Oro en Llamadas</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              &ldquo;Winning the argument is losing the customer&rdquo;. Escucha con paciencia, parafrasea el problema y asume propiedad personal del ticket.
            </p>
          </div>

        </aside>

      </div>

      {/* =====================================================================
          MODAL DE VISOR DE INMERSIÓN COMPARTIDO
      ===================================================================== */}
      {isViewerModalOpen && selectedSubNode && (
        <ImmersionViewerModal
          subNode={selectedSubNode}
          onClose={() => setIsViewerModalOpen(false)}
          onComplete={(subNodeId: string) => handleCompleteSubNode(subNodeId)}
          isCompleted={completedSubNodes.includes(selectedSubNode.id)}
          levelColor="from-orange-500 to-amber-400"
        />
      )}

      {/* MODAL DE PERFIL DE USUARIO */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setUserProfile(AppStorage.getUserProfile());
        }}
        streakDays={streakDays}
        userXp={userXp}
        immersionMinutes={immersionMinutes}
      />
    </div>
  );
}
