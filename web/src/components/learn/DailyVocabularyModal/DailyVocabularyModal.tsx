'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Gift,
  Sparkles,
  Volume2,
  CheckCircle2,
  Send,
  BookOpen,
  Award,
  Zap,
  Flame,
  Check,
  Brain,
  MessageSquare,
  Play,
  Pause,
  Square
} from 'lucide-react';
import {
  VocabularyWord,
  UserVocabularyItem,
  VocabularyService
} from '@/lib/vocabulary';
import { soundManager } from '@/lib/sound-effects';

export interface DailyVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel: string;
  userId?: string;
  onXpAwarded: (amount: number) => void;
}

export const DailyVocabularyModal: React.FC<DailyVocabularyModalProps> = ({
  isOpen,
  onClose,
  userLevel,
  userId,
  onXpAwarded
}) => {
  const [activeTab, setActiveTab] = useState<'DROP' | 'CHALLENGE'>('DROP');
  const [dailyWords, setDailyWords] = useState<VocabularyWord[]>([]);
  const [isClaimedToday, setIsClaimedToday] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [weeklyVocab, setWeeklyVocab] = useState<UserVocabularyItem[]>([]);

  // Estado del Reto Semanal
  const [essayText, setEssayText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const pausedCharIndexRef = useRef<number>(0);
  const currentSpeakingTextRef = useRef<string>('');
  const isAudioPausedRef = useRef<boolean>(false);
  const resumeWatchdogRef = useRef<any>(null);
  const [challengeResult, setChallengeResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
    usedWords: string[];
    corrections?: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const words = VocabularyService.getDailyWords(userLevel);
      setDailyWords(words);
      setIsClaimedToday(VocabularyService.hasClaimedToday());

      VocabularyService.getWeeklyVocabulary(userId).then(list => {
        setWeeklyVocab(list);
      });
    }
  }, [isOpen, userLevel, userId]);

  if (!isOpen) return null;

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const targetWordStrings = weeklyVocab.map(v => v.word);
  const detectedWords = targetWordStrings.filter(tw =>
    new RegExp(`\\b${tw.toLowerCase()}`, 'i').test(essayText)
  );

  const speakTextFromChar = (fullText: string, fromChar: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const safeFrom = Math.max(0, Math.min(fromChar, fullText.length));
    const textToSpeak = safeFrom > 0 ? fullText.slice(safeFrom) : fullText;
    if (!textToSpeak.trim()) {
      setSpeakingText(null);
      setIsAudioPaused(false);
      setActiveWordIndex(null);
      pausedCharIndexRef.current = 0;
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingText(fullText);
    setIsAudioPaused(false);
    isAudioPausedRef.current = false;
    currentSpeakingTextRef.current = fullText;
    pausedCharIndexRef.current = safeFrom;

    // Calcular palabra activa inicial
    const wordsBefore = fullText.slice(0, safeFrom).trim().split(/\s+/).filter(Boolean);
    setActiveWordIndex(wordsBefore.length);

    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = 'en-US';
    u.rate = audioSpeed;

    u.onboundary = (event: SpeechSynthesisEvent) => {
      if (isAudioPausedRef.current) return;
      const relChar = event.charIndex !== undefined ? event.charIndex : 0;
      const absChar = safeFrom + relChar;
      pausedCharIndexRef.current = absChar;

      const wordsUpToNow = fullText.slice(0, absChar).trim().split(/\s+/).filter(Boolean);
      setActiveWordIndex(wordsUpToNow.length);
    };

    u.onend = () => {
      if (isAudioPausedRef.current) return;
      setSpeakingText(null);
      setIsAudioPaused(false);
      setActiveWordIndex(null);
      pausedCharIndexRef.current = 0;
      currentSpeakingTextRef.current = '';
    };

    u.onerror = (e) => {
      if (isAudioPausedRef.current || (e as any)?.error === 'interrupted') return;
      setSpeakingText(null);
      setIsAudioPaused(false);
      setActiveWordIndex(null);
      pausedCharIndexRef.current = 0;
    };

    window.speechSynthesis.speak(u);
  };

  const toggleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Si ya estamos reproduciendo este mismo texto
    if (speakingText === text) {
      if (!isAudioPaused) {
        // Pausar
        isAudioPausedRef.current = true;
        setIsAudioPaused(true);
        window.speechSynthesis.cancel();
        return;
      } else {
        // Reanudar inmediatamente sin silencio
        isAudioPausedRef.current = false;
        setIsAudioPaused(false);
        speakTextFromChar(currentSpeakingTextRef.current, pausedCharIndexRef.current);
        return;
      }
    }

    // Nuevo texto desde el principio
    pausedCharIndexRef.current = 0;
    speakTextFromChar(text, 0);
  };

  const stopAudio = () => {
    isAudioPausedRef.current = false;
    pausedCharIndexRef.current = 0;
    currentSpeakingTextRef.current = '';
    if (resumeWatchdogRef.current) {
      clearTimeout(resumeWatchdogRef.current);
      resumeWatchdogRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingText(null);
    setIsAudioPaused(false);
    setActiveWordIndex(null);
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    soundManager.playClick();
    const res = await VocabularyService.claimDailyDrop(dailyWords, userId);
    setIsClaiming(false);
    if (res.success) {
      setIsClaimedToday(true);
      soundManager.playVictory();
      onXpAwarded(res.xpAwarded);
      // Actualizar lista semanal
      const updatedList = await VocabularyService.getWeeklyVocabulary(userId);
      setWeeklyVocab(updatedList);
    }
  };

  const handleSubmitChallenge = async () => {
    if (wordCount < 40) return;
    setIsEvaluating(true);
    soundManager.playClick();
    const result = await VocabularyService.evaluateWeeklyChallenge(essayText, targetWordStrings, userId);
    setIsEvaluating(false);
    setChallengeResult(result);
    if (result.passed) {
      soundManager.playVictory();
      onXpAwarded(100);
    } else {
      soundManager.playGentleError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-2xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0d1322]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Gift className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Krashen i+1 Context
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">Nivel {userLevel}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">Vocabulario Diario & Reto Semanal</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas */}
        <div className="grid grid-cols-2 p-1.5 bg-[#0b101c] border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('DROP')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'DROP'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Cofre de Hoy (Daily Drop)</span>
            {!isClaimedToday && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('CHALLENGE')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition ${
              activeTab === 'CHALLENGE'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Reto Semanal de Escritura</span>
            <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
              +100 XP
            </span>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* =========================================================
              PESTAÑA 1: COFRE DIARIO (DAILY DROP)
          ========================================================= */}
          {activeTab === 'DROP' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-[#070b14] border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-amber-200">
                    {isClaimedToday ? '¡Cofre de Hoy Reclamado!' : '¡Tus 3 Palabras de Hoy Están Listas!'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aprende 3 palabras en oraciones de inmersión real cada día. Se sincronizan automáticamente con tu mazo de repetición espaciada SRS.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>+15 XP</span>
                  </div>
                </div>
              </div>

              {/* Barra de Control de Velocidad */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  Audios Nativos en Contexto
                </span>
                <div className="flex items-center bg-[#0d1322] border border-slate-800 rounded-xl p-0.5 text-[10px] font-mono">
                  <span className="px-2 text-slate-500 font-bold uppercase hidden sm:inline">Velocidad:</span>
                  {[0.75, 0.85, 1.0, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setAudioSpeed(spd);
                        soundManager.playClick();
                      }}
                      className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                        audioSpeed === spd
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title={`Velocidad ${spd}x`}
                    >
                      {spd}x
                    </button>
                  ))}
                  {speakingText && (
                    <button
                      onClick={stopAudio}
                      className="ml-1 p-1 rounded-md text-slate-400 hover:text-rose-400 transition"
                      title="Detener audio"
                    >
                      <Square className="w-3 h-3 fill-current" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Tarjetas de Palabras Contextualizadas */}
              <div className="space-y-3">
                {dailyWords.map((wordItem) => {
                  const isWordPlaying = speakingText === wordItem.word;
                  const isSentencePlaying = speakingText === wordItem.example_sentence;

                  return (
                    <div
                      key={wordItem.id}
                      className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-extrabold text-white">{wordItem.word}</span>
                          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                            {wordItem.phonetic}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{wordItem.topic}</span>
                        </div>

                        <button
                          onClick={() => toggleSpeak(wordItem.word)}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            isWordPlaying
                              ? isAudioPaused
                                ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                                : 'bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                              : 'bg-[#090e1a] hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                          title={isWordPlaying ? (isAudioPaused ? "Reanudar" : "Pausar") : "Escuchar pronunciación nativa"}
                        >
                          {isWordPlaying ? (
                            isAudioPaused ? (
                              <Play className="w-4 h-4 fill-current text-amber-400" />
                            ) : (
                              <Pause className="w-4 h-4 fill-current text-emerald-400" />
                            )
                          ) : (
                            <Volume2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-200">
                          <span className="font-semibold italic text-emerald-300">
                            {isSentencePlaying ? (
                              wordItem.example_sentence.split(/\s+/).filter(Boolean).map((word, wIdx) => {
                                const isWordActive = activeWordIndex === wIdx;
                                return (
                                  <span
                                    key={wIdx}
                                    className={`transition-all duration-150 inline-block mr-1 ${
                                      isWordActive
                                        ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black rounded px-1 scale-105 ring-1 ring-emerald-300'
                                        : ''
                                    }`}
                                  >
                                    {word}
                                  </span>
                                );
                              })
                            ) : (
                              `"${wordItem.example_sentence}"`
                            )}
                          </span>
                          <button
                            onClick={() => toggleSpeak(wordItem.example_sentence)}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              isSentencePlaying
                                ? isAudioPaused
                                  ? 'text-amber-400'
                                  : 'text-emerald-300'
                                : 'text-slate-500 hover:text-emerald-400'
                            }`}
                            title={isSentencePlaying ? (isAudioPaused ? "Reanudar" : "Pausar") : "Escuchar oración completa"}
                          >
                            {isSentencePlaying ? (
                              isAudioPaused ? (
                                <Play className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Pause className="w-3.5 h-3.5 fill-current" />
                              )
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          • {wordItem.definition}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón de Acción */}
              <div className="pt-2">
                {isClaimedToday ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ya has guardado las 3 palabras de hoy en tu memoria SRS. Vuelve mañana para un nuevo cofre.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{isClaiming ? 'Guardando en tu memoria...' : 'Añadir a mi Memoria SRS (+15 XP)'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              PESTAÑA 2: RETO SEMANAL DE ESCRITURA
          ========================================================= */}
          {activeTab === 'CHALLENGE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-[#070b14] border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-200">Reto Semanal de Producción Escrita</h3>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-xl">
                    +100 XP
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Redacta un párrafo continuo (mínimo 50 palabras) integrando las palabras que aprendiste durante la semana. La IA evaluará tu coherencia y uso natural sin traducción mental.
                </p>
              </div>

              {/* Lista de Palabras Semanales */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                  Palabras de tu semana ({detectedWords.length}/{targetWordStrings.length} integradas):
                </span>
                <div className="flex flex-wrap gap-2">
                  {targetWordStrings.map((tw, idx) => {
                    const isDetected = detectedWords.includes(tw);
                    return (
                      <span
                        key={idx}
                        className={`text-xs font-mono px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition ${
                          isDetected
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-xs'
                            : 'bg-[#0b101c] border-slate-800 text-slate-400'
                        }`}
                      >
                        {isDetected && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                        <span>{tw}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Área de Escritura */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Escribe tu párrafo en inglés:</span>
                  <span className={wordCount >= 50 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {wordCount} / 50 palabras mínimas
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Today, I woke up early and checked my class schedule before heading to the campus library. My colleague told me that the project deadline was..."
                  className="w-full bg-[#0b101c] border border-slate-800 focus:border-emerald-500 rounded-2xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none transition leading-relaxed"
                />
              </div>

              {/* Botón de Envío */}
              <button
                onClick={handleSubmitChallenge}
                disabled={isEvaluating || wordCount < 40}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span>{isEvaluating ? 'Evaluando con IA...' : 'Enviar a Evaluación IA (+100 XP)'}</span>
              </button>

              {/* Resultado de la Evaluación */}
              {challengeResult && (
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    challengeResult.passed
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      {challengeResult.passed ? '✓ Reto Semanal Superado' : 'Revisión Necesaria'}
                    </span>
                    <span className="text-sm font-black font-mono">
                      {challengeResult.score}/100 Puntos
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed">
                    {challengeResult.feedback}
                  </p>

                  {challengeResult.corrections && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-[11px] text-slate-300">
                      <span className="font-bold text-amber-300 block mb-0.5">Sugerencia de Fluidez:</span>
                      {challengeResult.corrections}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
