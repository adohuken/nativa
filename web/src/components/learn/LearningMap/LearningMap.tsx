'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { IntensiveLesson } from '@/lib/curriculum-data';
import { SubNode, getSubNodesForLesson } from '@/content/course-content';
import { NodeCard } from '../NodeCard';
import { LEVEL_THEMES } from '../types';

export interface LearningMapProps {
  lessons: IntensiveLesson[];
  completedNodeIds: string[];
  completedSubNodeIds: string[];
  languageId: string;
  routeLevelFilter: 'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  onFilterChange: (level: 'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2') => void;
  activePopoverLessonId: string | null;
  hoveredLessonId: string | null;
  onHoverLesson: (id: string | null) => void;
  onSelectLesson: (id: string | null) => void;
  onStartLesson: (lesson: IntensiveLesson) => void;
  onSubNodeClick: (subNode: SubNode) => void;
  onOpenTopicLibrary: (lesson: IntensiveLesson) => void;
  onB2C2Blocked?: (level: string) => void;
  isUserPremium?: boolean;
  onOpenPaywall?: (reason: string) => void;
}

export function LearningMap({
  lessons,
  completedNodeIds,
  completedSubNodeIds,
  languageId,
  routeLevelFilter,
  onFilterChange,
  activePopoverLessonId,
  hoveredLessonId,
  onHoverLesson,
  onSelectLesson,
  onStartLesson,
  onSubNodeClick,
  onOpenTopicLibrary
}: LearningMapProps) {
  const filteredLessons = routeLevelFilter === 'ALL'
    ? lessons
    : lessons.filter(l => l.level === routeLevelFilter);

  const getNodeStatus = (lesson: IntensiveLesson): 'COMPLETED' | 'ACTIVE' | 'LOCKED' => {
    if (completedNodeIds.includes(lesson.id)) return 'COMPLETED';
    if (!lesson.prerequisiteId) return 'ACTIVE';
    if (completedNodeIds.includes(lesson.prerequisiteId)) {
      // Verificar si los sub-nodos del nodo prerequisito están todos hechos
      const subNodes = getSubNodesForLesson(lesson.prerequisiteId, languageId);
      const allDone = subNodes.length === 0 || subNodes.every(s => completedSubNodeIds.includes(s.id));
      return allDone ? 'ACTIVE' : 'LOCKED';
    }
    return 'LOCKED';
  };

  const getSubNodesCompletionStatus = (lessonId: string) => {
    const subNodes = getSubNodesForLesson(lessonId, languageId);
    const completedCount = subNodes.filter(s => completedSubNodeIds.includes(s.id)).length;
    return {
      allDone: subNodes.length > 0 && completedCount === subNodes.length,
      completedCount,
      totalCount: subNodes.length
    };
  };

  return (
    <main className="flex-1 px-2.5 sm:px-8 py-6 md:py-10 pb-28 md:pb-12 max-w-4xl mx-auto w-full space-y-8 sm:space-y-10 overflow-x-hidden">
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
      <div 
        data-tour="tour-level-filters"
        className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 bg-[#0b101b] rounded-2xl border border-slate-800/90 text-xs shadow-md"
      >
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
              onClick={() => onFilterChange(tab.id as any)}
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
          const isLocked = status === 'LOCKED';
          const isFirstInUnit = index === 0 || filteredLessons[index - 1].unit !== lesson.unit;
          const theme = LEVEL_THEMES[lesson.level] || LEVEL_THEMES.A1;

          // Verificación de bloqueo por sub-nodos pendientes del nodo anterior
          const prereqLesson = lesson.prerequisiteId ? filteredLessons.find(l => l.id === lesson.prerequisiteId) : null;
          const prereqSubNodesStatus = prereqLesson ? getSubNodesCompletionStatus(prereqLesson.id) : null;
          const isLockedBySubNodes = isLocked && prereqLesson && completedNodeIds.includes(prereqLesson.id) && !prereqSubNodesStatus?.allDone;

          const subNodes = getSubNodesForLesson(lesson.id, languageId);
          const subNodesStatus = getSubNodesCompletionStatus(lesson.id);
          const isPopoverOpen = hoveredLessonId === lesson.id || activePopoverLessonId === lesson.id;
          const hasNextLesson = index < filteredLessons.length - 1;

          return (
            <NodeCard
              key={lesson.id}
              lesson={lesson}
              index={index}
              isFirstInUnit={isFirstInUnit}
              status={status}
              theme={theme}
              isLockedBySubNodes={Boolean(isLockedBySubNodes)}
              prereqLessonCode={prereqLesson?.code}
              prereqSubNodesCount={prereqSubNodesStatus?.completedCount || 0}
              subNodes={subNodes}
              subNodesAllDone={subNodesStatus.allDone}
              isPopoverOpen={isPopoverOpen}
              hasNextLesson={hasNextLesson}
              completedSubNodeIds={completedSubNodeIds}
              onNodeClick={() => onSelectLesson(activePopoverLessonId === lesson.id ? null : lesson.id)}
              onMouseEnter={() => onHoverLesson(lesson.id)}
              onMouseLeave={() => onHoverLesson(null)}
              onStartLesson={onStartLesson}
              onSubNodeClick={onSubNodeClick}
              onOpenTopicLibrary={() => onOpenTopicLibrary(lesson)}
            />
          );
        })}
      </div>
    </main>
  );
}
