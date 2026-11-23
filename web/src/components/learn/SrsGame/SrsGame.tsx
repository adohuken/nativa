'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Volume2, RotateCw } from 'lucide-react';
import { FlashcardItem } from '@/lib/srs-review';
import { soundManager } from '@/lib/sound-effects';
import { getFigurativePronunciation } from '@/lib/phonetics';

export interface SrsGameProps {
  srsDeck: FlashcardItem[];
  currentCardIndex: number;
  isCardFlipped: boolean;
  srsLevelFilter: string;
  srsCardsReviewedCount: number;
  userXp: number;
  onFilterChange: (level: string) => void;
  onCardFlip: (flipped: boolean) => void;
  onNextCard: () => void;
  onReviewCard: (difficulty: 'hard' | 'good' | 'easy') => void;
  onSpeakText: (text: string) => void;
}

export function SrsGame({
  srsDeck,
  currentCardIndex,
  isCardFlipped,
  srsLevelFilter,
  srsCardsReviewedCount,
  onFilterChange,
  onCardFlip,
  onNextCard,
  onReviewCard,
  onSpeakText
}: SrsGameProps) {
  const [showFigurativeHelper, setShowFigurativeHelper] = useState<boolean>(false);

  return (
    <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8 pb-28 md:pb-8">
      {/* Header del Repaso SRS */}
      <div className="space-y-3 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold mb-2">
            <span>MEMORIA A LARGO PLAZO • SISTEMA LEITNER / SRS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Gimnasio de Retención Espaciada
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
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
              onFilterChange(lvl);
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
                onClick={() => onCardFlip(!isCardFlipped)}
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
                      onSpeakText(card.audioText);
                    }}
                    className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-400 border border-blue-500/30 transition shadow-xs cursor-pointer"
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

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFigurativeHelper(!showFigurativeHelper);
                            }}
                            className="text-[11px] text-slate-400 hover:text-amber-300 transition underline underline-offset-4 flex items-center gap-1 cursor-pointer"
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
                    onClick={() => onReviewCard('hard')}
                    className="p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 transition font-bold text-xs flex flex-col items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span className="text-sm">⚠️ Difícil</span>
                    <span className="text-[10px] text-rose-400 font-normal">Repetir pronto</span>
                  </button>

                  <button
                    onClick={() => onReviewCard('good')}
                    className="p-3.5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 transition font-bold text-xs flex flex-col items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span className="text-sm">👍 Bien</span>
                    <span className="text-[10px] text-blue-400 font-normal">+5 XP</span>
                  </button>

                  <button
                    onClick={() => onReviewCard('easy')}
                    className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 transition font-bold text-xs flex flex-col items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span className="text-sm">⭐ Fácil</span>
                    <span className="text-[10px] text-emerald-400 font-normal">+10 XP</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onCardFlip(true)}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs transition shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    Voltear Tarjeta
                  </button>
                  <button
                    onClick={onNextCard}
                    className="px-5 py-3 rounded-2xl bg-[#0c111c] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
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
  );
}
