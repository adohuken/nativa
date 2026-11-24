'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Check,
  Zap,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  Coffee,
  FileText,
  Headphones,
  Brain
} from 'lucide-react';
import { IntensiveLesson } from '@/lib/curriculum-data';
import { SubNode } from '@/content/course-content';
import { LevelTheme } from '../types';

export interface NodeCardProps {
  lesson: IntensiveLesson;
  index: number;
  isFirstInUnit: boolean;
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  theme: LevelTheme;
  isLockedBySubNodes: boolean;
  prereqLessonCode?: string;
  prereqSubNodesCount?: number;
  subNodes: SubNode[];
  subNodesAllDone: boolean;
  isPopoverOpen: boolean;
  hasNextLesson: boolean;
  completedSubNodeIds: string[];
  onNodeClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onStartLesson: (lesson: IntensiveLesson) => void;
  onSubNodeClick: (subNode: SubNode) => void;
  onOpenTopicLibrary: () => void;
  isAdmin?: boolean;
}

export function NodeCard({
  lesson,
  index,
  isFirstInUnit,
  status,
  theme,
  isLockedBySubNodes,
  prereqLessonCode,
  prereqSubNodesCount = 0,
  subNodes,
  subNodesAllDone,
  isPopoverOpen,
  hasNextLesson,
  completedSubNodeIds,
  onNodeClick,
  onMouseEnter,
  onMouseLeave,
  onStartLesson,
  onSubNodeClick,
  onOpenTopicLibrary,
  isAdmin
}: NodeCardProps) {
  const isCompleted = status === 'COMPLETED';
  const isActive = status === 'ACTIVE';
  const isLocked = status === 'LOCKED' && !isAdmin;
  const areSubNodesUnlocked = isCompleted || Boolean(isAdmin);

  // Desplazamiento serpenteante adaptativo (sutil en móvil <360px para evitar desborde)
  const cycle = index % 3;
  const serpentineClass = cycle === 0
    ? 'translate-x-0'
    : cycle === 1
      ? 'translate-x-4 sm:translate-x-14 md:translate-x-22'
      : '-translate-x-4 sm:-translate-x-14 md:-translate-x-22';

  const getNodeIcon = () => {
    switch (lesson.code) {
      case '1.1': return Briefcase;
      case '1.2': return Compass;
      case '1.3': return Coffee;
      case '1.4': return FileText;
      default: return Compass;
    }
  };

  const NodeIcon = getNodeIcon();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Banner de Unidad con Proyecto Universitario Oficial */}
      {isFirstInUnit && (
        <div 
          data-tour={index === 0 ? "tour-unit-banner" : undefined}
          className={`w-full max-w-xl my-8 p-6 rounded-3xl bg-gradient-to-br ${theme.bannerBg} border border-slate-800/90 shadow-xl space-y-4`}
        >
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

      {/* Círculo Principal del Nodo Madre */}
      <div className={`relative flex flex-col items-center my-3 transition-transform ${serpentineClass}`}>
        {isActive && (
          <div className="absolute -top-7 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-md animate-bounce z-10 pointer-events-none">
            +{lesson.xpReward} XP
          </div>
        )}

        <button
          data-tour={index === 0 ? "tour-first-node" : undefined}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onNodeClick}
          title={isCompleted ? `Ver misión: ${lesson.title}` : isActive ? `Comenzar: ${lesson.title}` : `Bloqueado: ${lesson.title}`}
          className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all select-none relative group ${
            isCompleted
              ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 text-white border-4 border-emerald-300 shadow-[0_8px_0_#065f46] shadow-emerald-500/30 hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#065f46] cursor-pointer'
              : isActive
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-4 border-emerald-300 shadow-[0_8px_0_#065f46] ring-4 ring-emerald-400/40 animate-pulse hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#065f46] cursor-pointer'
                : 'bg-[#0d131f] border-4 border-slate-800 text-slate-600 shadow-[0_8px_0_#080c14] hover:border-slate-700 cursor-not-allowed'
          }`}
        >
          {isCompleted || isActive ? (
            <NodeIcon className="w-9 h-9 stroke-[2.2] text-white drop-shadow-md group-hover:scale-110 transition-transform" />
          ) : (
            <Lock className="w-8 h-8 stroke-[2] text-slate-600" />
          )}

          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 border-2 border-[#07090e] flex items-center justify-center font-black shadow-lg">
              <Check className="w-4 h-4 stroke-[3.5] text-slate-950" />
            </div>
          )}
        </button>

        {/* Popover / Tooltip Flotante */}
        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.94 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute bottom-full mb-3.5 z-40 w-[calc(100vw-1.5rem)] max-w-[280px] sm:max-w-xs sm:w-80 p-3.5 sm:p-4 rounded-2xl bg-[#0c1322]/95 backdrop-blur-xl border border-slate-700/90 shadow-2xl shadow-black/90 flex flex-col gap-2 text-left pointer-events-auto select-none"
              onClick={(e) => e.stopPropagation()}
            >
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

              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  {lesson.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {lesson.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {isCompleted ? (
                  <button
                    onClick={() => onStartLesson(lesson)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repasar Lección (+{lesson.xpReward} XP)</span>
                  </button>
                ) : isActive ? (
                  <button
                    onClick={() => onStartLesson(lesson)}
                    className={`w-full py-2 px-3 rounded-xl bg-gradient-to-r ${theme.btnGradient} hover:opacity-95 ${theme.btnText} font-black text-xs transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer`}
                  >
                    <span>Comenzar Lección (6 Etapas)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : isLockedBySubNodes && !isAdmin ? (
                  <div className="w-full text-[11px] text-amber-300 bg-amber-500/15 border border-amber-500/30 p-2 rounded-xl flex items-center gap-1.5 font-medium leading-tight">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Completa los 3 sub-nodos de la Lección {prereqLessonCode} ({prereqSubNodesCount}/3)</span>
                  </div>
                ) : isAdmin ? (
                  <button
                    onClick={() => onStartLesson(lesson)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Revisar Lección (Acceso Evaluador)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-full text-center text-xs text-slate-500 font-mono py-1 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lección Bloqueada</span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTopicLibrary();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-[#080d16] hover:bg-[#0f1728] border border-slate-700/80 hover:border-emerald-500/50 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group"
                title="Ver textos, audios y casos adicionales de este tema"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>Ir a la Biblioteca de este Tema</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded-full ml-1">
                  +Input
                </span>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#0c1322]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sub-Nodos Satélite (Reading, Listening, SRS) */}
      {areSubNodesUnlocked && (
        <div className={`flex flex-col items-center my-1 transition-transform ${serpentineClass}`}>
          <div className="flex justify-center my-1 select-none pointer-events-none">
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <line x1="12" y1="0" x2="12" y2="20" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-3.5 sm:gap-4.5 px-3.5 py-2 rounded-2xl bg-[#080d16]/90 border border-slate-800 shadow-lg backdrop-blur-md">
            {subNodes.map((sub) => {
              const isSubDone = completedSubNodeIds.includes(sub.id);
              const SubIcon = sub.type === 'reading' ? BookOpen : sub.type === 'listening' ? Headphones : Brain;
              const subTitle = sub.type === 'reading' ? 'Inmersión de Lectura' : sub.type === 'listening' ? 'Inmersión Auditiva' : 'Repaso SRS';

              return (
                <div key={sub.id} className="relative group flex flex-col items-center">
                  <button
                    onClick={() => onSubNodeClick(sub)}
                    title={`${subTitle} (+${sub.xpReward} XP)`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all select-none relative shadow-md active:translate-y-0.5 cursor-pointer ${
                      isSubDone
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-2 border-emerald-300 shadow-[0_3px_0_#065f46] shadow-emerald-500/25 hover:scale-115'
                        : 'bg-[#0c1a2e] border-2 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.45)] ring-4 ring-cyan-500/25 hover:scale-115 animate-pulse'
                    }`}
                  >
                    <SubIcon className="w-4 h-4 stroke-[2.2]" />
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

                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 text-[9px] font-mono font-bold whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 pointer-events-none z-20 shadow-sm">
                    {sub.type === 'reading' ? 'Reading' : sub.type === 'listening' ? 'Listening' : 'SRS'} (+{sub.xpReward} XP)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trazo SVG Serpenteante que Conecta con el Siguiente Nodo */}
      {hasNextLesson && (
        <div className="flex justify-center select-none pointer-events-none my-2">
          {cycle === 0 ? (
            <svg width="150" height="75" viewBox="0 0 150 75" fill="none">
              <path
                d="M 25 0 C 25 40, 125 35, 125 75"
                stroke={subNodesAllDone ? '#10b981' : '#334155'}
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            </svg>
          ) : cycle === 1 ? (
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
}
