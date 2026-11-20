'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Award,
  BookOpen,
  Brain,
  Mic,
  CheckCircle2,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { AppStorage, DailyMission, DailyMissionsState } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';

interface DailyMissionsWidgetProps {
  onActionClick?: (actionType: 'library' | 'srs' | 'shadowing') => void;
  className?: string;
  compact?: boolean;
}

export function DailyMissionsWidget({
  onActionClick,
  className = '',
  compact = false
}: DailyMissionsWidgetProps) {
  const [missionsState, setMissionsState] = useState<DailyMissionsState>(() => AppStorage.getDailyMissions());

  const refreshMissions = () => {
    setMissionsState(AppStorage.getDailyMissions());
  };

  useEffect(() => {
    refreshMissions();
    const interval = setInterval(refreshMissions, 4000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = missionsState.missions.filter(m => m.completed).length;
  const allCompleted = completedCount === 3;

  return (
    <div className={`rounded-3xl border transition-all ${
      allCompleted
        ? 'bg-gradient-to-br from-[#1c1808] via-[#141006] to-[#090d16] border-amber-500/60 shadow-xl shadow-amber-500/10'
        : 'bg-[#0b101c] border-slate-800 shadow-md'
    } p-4 sm:p-5 space-y-3.5 ${className}`}>
      
      {/* HEADER DE MISIONES */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            allCompleted ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-amber-400'
          }`}>
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>Misiones de Hoy</span>
              {allCompleted && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold">
                  ✓ Día Completado
                </span>
              )}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400">{completedCount}/3</span>
          <span className="text-amber-400 font-bold">(+50 XP Bonus)</span>
        </div>
      </div>

      {/* BANNER DE DÍA COMPLETADO O PROGRESO */}
      {allCompleted ? (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs font-sans text-amber-200 flex items-center gap-3 animate-in fade-in">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md shadow-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-white block font-bold">¡Objetivo diario cumplido!</strong>
            <span className="text-amber-300/90 text-[11px]">
              Has completado tus 3 misiones y ganado el bonus de +50 XP. Tu cerebro absorbió input natural hoy.
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-all duration-500"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>
      )}

      {/* LISTA DE LAS 3 MISIONES */}
      <div className="space-y-2">
        {missionsState.missions.map((mission) => {
          const isDone = mission.completed;
          let icon = <BookOpen className="w-4 h-4 text-emerald-400" />;
          let actionType: 'library' | 'srs' | 'shadowing' = 'library';

          if (mission.id === 'complete_srs') {
            icon = <Brain className="w-4 h-4 text-amber-400" />;
            actionType = 'srs';
          } else if (mission.id === 'shadowing_record') {
            icon = <Mic className="w-4 h-4 text-cyan-400" />;
            actionType = 'shadowing';
          }

          return (
            <div
              key={mission.id}
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : 'bg-[#080d16] border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'
                }`}>
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {mission.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {isDone ? 'Misión completada' : mission.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  +{mission.xpReward} XP
                </span>

                {!isDone && onActionClick && (
                  <button
                    onClick={() => onActionClick(actionType)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Ir a realizar esta misión"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
