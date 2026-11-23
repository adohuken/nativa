'use client';

import React from 'react';
import {
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Check,
  BookOpen
} from 'lucide-react';
import { ImmersionStory, IMMERSION_STORIES } from '@/lib/immersion-data';
import { soundManager } from '@/lib/sound-effects';

export interface ImmersionViewerProps {
  immersionMinutes: number;
  selectedStory: ImmersionStory | null;
  immersionLevelFilter: string;
  isPlayingAudio: boolean;
  onSelectStory: (story: ImmersionStory | null) => void;
  onFilterChange: (level: string) => void;
  onSpeakText: (text: string) => void;
  onStopAudio: () => void;
  onFinishStory: (story: ImmersionStory) => void;
}

export function ImmersionViewer({
  immersionMinutes,
  selectedStory,
  immersionLevelFilter,
  isPlayingAudio,
  onSelectStory,
  onFilterChange,
  onSpeakText,
  onStopAudio,
  onFinishStory
}: ImmersionViewerProps) {
  return (
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
        {!selectedStory && (
          <div className="flex flex-wrap gap-2 pt-2">
            {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
              const isSelected = immersionLevelFilter === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    onFilterChange(lvl);
                    soundManager.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition border cursor-pointer ${
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
      {selectedStory ? (
        <div className="space-y-6">
          <button
            onClick={() => {
              onStopAudio();
              onSelectStory(null);
              soundManager.playClick();
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-[#0c111c] hover:bg-[#111928] border border-slate-800 hover:border-slate-700 transition cursor-pointer"
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
                    Nivel {selectedStory.level}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                    {selectedStory.themeSeries}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>{selectedStory.wordCount} palabras</span>
                  <span>•</span>
                  <span>⏱️ ~{selectedStory.readingMinutes} min de lectura</span>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {selectedStory.title}
              </h2>
              <p className="text-sm text-slate-400 italic">
                {selectedStory.subtitle}
              </p>

              {/* Botón de Audio Narrativo */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  onClick={() => {
                    const fullText = selectedStory.paragraphs.join(' ');
                    onSpeakText(fullText);
                  }}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white transition shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Escuchar Narración Completa en Audio Nativo</span>
                </button>
                {isPlayingAudio && (
                  <button
                    onClick={onStopAudio}
                    className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-[#0e1626] hover:bg-[#152033] text-slate-300 border border-slate-700 transition cursor-pointer"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Pausar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Párrafos del Texto Comprensible */}
            <div className="space-y-4 text-slate-200 leading-relaxed text-base font-normal">
              {selectedStory.paragraphs.map((p, idx) => (
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
                {selectedStory.vocabularySpotlight.map((v, i) => (
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
            {selectedStory.voluntaryCheck && (
              <div className="p-5 rounded-2xl bg-blue-950/25 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider font-mono">
                    Comprobación Voluntaria de Sentido (Sin Nota ni Penalización)
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-semibold">
                  {selectedStory.voluntaryCheck.question}
                </p>
                <div className="space-y-2">
                  {selectedStory.voluntaryCheck.options.map((opt, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0b1325] border border-blue-900/40 text-xs text-blue-100">
                      {opt}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-blue-300 italic pt-1">
                  💡 {selectedStory.voluntaryCheck.insight}
                </p>
              </div>
            )}

            {/* Botón de Finalización de Inmersión */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-400">
                Al terminar, registrarás {selectedStory.readingMinutes} minutos de exposición comprensible.
              </span>
              <button
                onClick={() => onFinishStory(selectedStory)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Completar Lectura (+{selectedStory.readingMinutes}m Inmersión / +30 XP)</span>
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
                  onSelectStory(story);
                  soundManager.playClick();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0e1626] hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition border border-slate-700/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Leer en Inmersión Activa</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
