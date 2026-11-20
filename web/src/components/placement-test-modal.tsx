'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  GraduationCap,
  Volume2,
  Zap,
  TrendingUp,
  TrendingDown,
  Compass,
  Check,
  Award
} from 'lucide-react';
import {
  CEFRLevel,
  PlacementQuestion,
  PlacementSessionState,
  createInitialPlacementState,
  getNextQuestion,
  processAnswer,
  calculateFinalLevel,
  getUnlockedLessonsForLevel,
  CEFR_LEVELS_ORDER,
  TOTAL_PLACEMENT_QUESTIONS
} from '@/lib/placement-test';
import { soundManager } from '@/lib/sound-effects';
import { AppStorage } from '@/lib/storage';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { NativaLogo } from '@/components/fluentia-logo';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLevelAssigned?: (level: CEFRLevel, unlockedNodes: string[]) => void;
  userId?: string;
}

export function PlacementTestModal({
  isOpen,
  onClose,
  onLevelAssigned,
  userId
}: PlacementTestModalProps) {
  const [sessionState, setSessionState] = useState<PlacementSessionState>(() => createInitialPlacementState());
  const [currentQuestion, setCurrentQuestion] = useState<PlacementQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [levelChangeNotice, setLevelChangeNotice] = useState<'UP' | 'DOWN' | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<ReturnType<typeof calculateFinalLevel> | null>(null);

  // Inicializar o reiniciar test
  useEffect(() => {
    if (isOpen) {
      const initial = createInitialPlacementState();
      setSessionState(initial);
      const firstQ = getNextQuestion(initial);
      setCurrentQuestion(firstQ);
      setSelectedOption(null);
      setIsSubmitted(false);
      setLevelChangeNotice(null);
      setIsFinished(false);
      setFinalResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectOption = (index: number) => {
    if (isSubmitted || !currentQuestion) return;
    setSelectedOption(index);
    setIsSubmitted(true);

    const { nextState, isCorrect, levelChanged } = processAnswer(sessionState, currentQuestion, index);

    if (isCorrect) {
      soundManager.playSuccess();
    } else {
      soundManager.playGentleError();
    }

    if (levelChanged !== 'SAME') {
      setLevelChangeNotice(levelChanged);
    }

    // Esperar 1.3s para mostrar feedback y avanzar
    setTimeout(() => {
      setLevelChangeNotice(null);
      setSelectedOption(null);
      setIsSubmitted(false);

      if (nextState.currentQuestionIndex >= TOTAL_PLACEMENT_QUESTIONS) {
        // Fin del test
        const result = calculateFinalLevel(nextState);
        setFinalResult(result);
        setIsFinished(true);
        soundManager.playVictory();
      } else {
        const nextQ = getNextQuestion(nextState);
        setCurrentQuestion(nextQ);
        setSessionState(nextState);
      }
    }, 1400);
  };

  const speakPrompt = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    soundManager.playClick();
  };

  const handleConfirmLevel = async (assignedLevel: CEFRLevel) => {
    soundManager.playVictory();
    const unlocked = getUnlockedLessonsForLevel(assignedLevel);

    // 1. Guardar en AppStorage local
    AppStorage.saveCompletedNodes(unlocked);
    const currentProfile = AppStorage.getUserProfile();
    AppStorage.saveUserProfile({
      ...currentProfile,
      targetLevel: assignedLevel
    });
    // Sumar XP de bienvenida (+150 XP)
    const currentXp = AppStorage.getXp();
    AppStorage.saveXp(currentXp + 150);

    // 2. Persistir en Supabase si está disponible
    if (userId) {
      try {
        const client = getSupabaseClient();
        if (client && isSupabaseConfigured) {
          await client.from('profiles').update({
            current_level: assignedLevel,
            xp: currentXp + 150,
            updated_at: new Date().toISOString()
          }).eq('id', userId);

          await client.from('user_progress').upsert({
            user_id: userId,
            completed_nodes: unlocked,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }
      } catch (err) {
        console.error('Error saving placement test result in Supabase:', err);
      }
    }

    if (onLevelAssigned) {
      onLevelAssigned(assignedLevel, unlocked);
    }
    onClose();
  };

  const handleSkipToA1 = () => {
    handleConfirmLevel('A1');
  };

  const progressPercentage = Math.round(((sessionState.currentQuestionIndex) / TOTAL_PLACEMENT_QUESTIONS) * 100);
  const currentLevelLabel = CEFR_LEVELS_ORDER[sessionState.currentLevelIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl my-auto rounded-[32px] bg-[#080d18] border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-6 overflow-hidden"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* =================================================================
            PANTALLA DE RESULTADO FINAL (CUANDO TERMINA LA PREGUNTA 10)
        ================================================================= */}
        {isFinished && finalResult ? (
          <div className="text-center space-y-6 py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 mx-auto shadow-2xl shadow-emerald-500/30 flex items-center justify-center"
            >
              <div className="w-full h-full bg-[#080d18] rounded-[22px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-emerald-400" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                Test de Nivelación Completado
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ¡Nivel Asignado: <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{finalResult.level}</span>!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {finalResult.title}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1220] border border-slate-800/90 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Aciertos:</span>
                <span className="font-bold text-emerald-300 font-mono">{finalResult.totalCorrect} / {TOTAL_PLACEMENT_QUESTIONS} preguntas</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Recompensa de Entrada:</span>
                <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +150 XP
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                {finalResult.description}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmLevel(finalResult.level)}
                className="w-full max-w-md mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Comenzar mi Aventura en Nivel {finalResult.level}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] font-mono text-slate-500">
                Todas las lecciones hasta el nivel {finalResult.level} han sido desbloqueadas en tu ruta.
              </p>
            </div>
          </div>
        ) : (
          /* =================================================================
              PANTALLA DE PREGUNTAS DEL TEST ADAPTATIVO (1 a 10)
          ================================================================= */
          <div className="space-y-6">
            {/* Header del Test */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <NativaLogo size="sm" />
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    Placement Test Adaptativo
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Stephen Krashen SLA & CEFR Matrix
                  </span>
                </div>
              </div>

              {/* Badge de Nivel Actual que se está midiendo */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Dificultad:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1 shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  Nivel {currentLevelLabel}
                </span>
              </div>
            </div>

            {/* Barra de Progreso (1 a 25) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Pregunta {sessionState.currentQuestionIndex + 1} de {TOTAL_PLACEMENT_QUESTIONS}</span>
                <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((sessionState.currentQuestionIndex + 1) / TOTAL_PLACEMENT_QUESTIONS) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Aviso Dinámico de Ajuste de Nivel */}
            <AnimatePresence>
              {levelChangeNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-3 rounded-2xl text-xs font-bold font-mono flex items-center justify-center gap-2 border ${
                    levelChangeNotice === 'UP'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/20'
                      : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {levelChangeNotice === 'UP' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>¡3 aciertos seguidos! Elevando dificultad adaptativa al Nivel {currentLevelLabel}.</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-amber-400" />
                      <span>Ajustando dificultad al Nivel {currentLevelLabel} para consolidar tu precisión.</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tarjeta de Pregunta */}
            {currentQuestion && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0b1220] border border-slate-800/90 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase font-bold">
                    {currentQuestion.category}
                  </span>
                  {currentQuestion.contextSentence && (
                    <button
                      type="button"
                      onClick={() => speakPrompt(currentQuestion.contextSentence || '')}
                      title="Escuchar pronunciación nativa"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400 font-mono">
                    {currentQuestion.prompt}
                  </p>
                  {currentQuestion.contextSentence && (
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm sm:text-base text-white font-medium tracking-wide">
                      {currentQuestion.contextSentence}
                    </div>
                  )}
                </div>

                {/* Opciones de Respuesta */}
                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let btnStyle = 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-200';
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 font-bold';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-40';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-black/40 border border-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explicación Pedagógica al responder */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 text-xs text-slate-400 border-t border-slate-800/80 flex items-start gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{currentQuestion.explanation}</span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Footer con opción de saltar */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleSkipToA1}
                className="text-slate-500 hover:text-slate-300 font-mono transition underline underline-offset-4 cursor-pointer"
              >
                Soy principiante absoluto • Empezar desde A1
              </button>

              <span className="text-[10px] font-mono text-slate-500">
                Test adaptativo oficial • 25 preguntas
              </span>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
