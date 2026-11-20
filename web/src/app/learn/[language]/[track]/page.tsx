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
  Check
} from 'lucide-react';
import { FluentiaLogo } from '@/components/fluentia-logo';
import { ImmersionViewerModal } from '@/components/immersion-viewer-modal';
import { UserProfileModal } from '@/components/user-profile-modal';
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
        Cargando track especializado...
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

        setCourseContent(getTrackCourseContent(trackSlug));
      } catch {}
    }
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

  // Cálculo de progreso
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

      soundManager.playSuccess();
    }
    setIsViewerModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Fondo con brillo cálido especial para Call Center / BPO */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-950/20 via-orange-950/10 to-transparent pointer-events-none -z-10" />

      {/* =====================================================================
          HEADER DEL TRACK
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 flex items-center justify-center transition group"
            title="Volver al Dashboard Principal"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <FluentiaLogo size="sm" />
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            Track Especializado BPO
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
            <div className="flex items-center gap-1.5 text-amber-300" title="Experiencia total">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-bold">{userXp} XP</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-orange-300" title="Minutos de inmersión acumulados">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{immersionMinutes}m</span>
            </div>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido'}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-300 flex items-center justify-center transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              soundManager.playClick();
            }}
            className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-[#0b101c] hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 transition group shadow-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-amber-950/70 border border-amber-500/40 flex items-center justify-center shrink-0 text-base shadow-sm">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{userProfile.avatarEmoji || '🎧'}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-amber-300 transition">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN BODY
      ===================================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* HERO BANNER DEL TRACK */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#120d06] via-[#100c07] to-[#070b14] border-2 border-amber-500/30 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  Ruta Profesional BPO
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/30 text-[11px] font-mono text-orange-300 font-semibold">
                  Nivel {track.level}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {track.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {track.description}
              </p>

              {/* Barra de Progreso del Track */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Progreso en la Especialización:</span>
                  <span className="text-amber-400 font-bold">
                    {completedTrackSubNodesCount} de {totalSubNodesCount} Nodos ({progressPercentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-all duration-700 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tarjeta Resumen Rápido */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs font-mono space-y-2 shrink-0 w-full md:w-60 shadow-lg">
              <div className="text-slate-400 uppercase tracking-wider font-bold">Estructura del Curso</div>
              <div className="text-white flex items-center justify-between">
                <span>Módulos:</span>
                <strong className="text-amber-400 font-bold">4 Fases</strong>
              </div>
              <div className="text-white flex items-center justify-between">
                <span>Nodos Madre:</span>
                <strong className="text-amber-400 font-bold">8 Lecciones</strong>
              </div>
              <div className="text-white flex items-center justify-between">
                <span>Inmersión SLA:</span>
                <strong className="text-emerald-400 font-bold">100% Real</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            FILTRO DE MÓDULOS
        ===================================================================== */}
        <section className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
          <button
            onClick={() => {
              setSelectedModuleFilter('ALL');
              soundManager.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
              selectedModuleFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos los Módulos
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
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>Módulo {mod.unitNumber}</span>
            </button>
          ))}
        </section>

        {/* =====================================================================
            LISTA DE MÓDULOS Y NODOS MADRE
        ===================================================================== */}
        <section className="space-y-8">
          {modulesList
            .filter((mod) => selectedModuleFilter === 'ALL' || selectedModuleFilter === mod.moduleId)
            .map((mod) => {
              const lessons = Object.values(mod.lessons || {});

              return (
                <div
                  key={mod.moduleId}
                  className="rounded-3xl p-6 sm:p-8 bg-[#0b101c] border border-slate-800/90 shadow-xl space-y-6"
                >
                  {/* Encabezado del Módulo */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold">
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
                              : 'bg-[#090d16] border-slate-800/90 hover:border-amber-500/40 shadow-md'
                          }`}
                        >
                          {/* Cabecera del Nodo Madre */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-black text-xs flex items-center justify-center">
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
                                    : 'bg-[#0b101c] border-slate-800 hover:border-amber-500/40 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                      isReadingDone
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-slate-800 text-amber-400 group-hover:bg-amber-500/20'
                                    }`}
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="leading-tight">
                                    <div className="text-xs font-bold">{readingSub.title}</div>
                                    <div className="text-[10px] font-mono text-slate-500">
                                      Lectura BPO • Glosario SRS
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isReadingDone ? (
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                                      <Check className="w-3.5 h-3.5" /> Hecho
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono text-amber-400 group-hover:underline flex items-center gap-0.5">
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
                                    : 'bg-[#0b101c] border-slate-800 hover:border-amber-500/40 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                      isListeningDone
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-slate-800 text-orange-400 group-hover:bg-orange-500/20'
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
                                    <span className="text-[10px] font-mono text-orange-400 group-hover:underline flex items-center gap-0.5">
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
                                    : 'bg-[#0b101c] border-slate-800 hover:border-amber-500/40 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                      isSrsDone
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-slate-800 text-amber-300 group-hover:bg-amber-500/20'
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
                                    <span className="text-[10px] font-mono text-amber-300 group-hover:underline flex items-center gap-0.5">
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
                </div>
              );
            })}
        </section>
      </main>

      {/* =====================================================================
          MODAL DE VISOR DE INMERSIÓN COMPARTIDO
      ===================================================================== */}
      {isViewerModalOpen && selectedSubNode && (
        <ImmersionViewerModal
          subNode={selectedSubNode}
          onClose={() => setIsViewerModalOpen(false)}
          onComplete={(subNodeId: string) => handleCompleteSubNode(subNodeId)}
          isCompleted={completedSubNodes.includes(selectedSubNode.id)}
          levelColor="from-amber-500 to-orange-400"
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
