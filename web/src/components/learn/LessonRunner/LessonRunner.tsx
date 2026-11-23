'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Zap, Keyboard, ChevronRight, Volume2, Sparkles,
  CheckCircle2, RotateCcw, Mic, Star,
  ArrowRight, BookOpen, VolumeX, Eye, EyeOff, Trophy,
  Activity, Headphones, Bot, User, Compass, Play, Pause, Square
} from 'lucide-react';
import { IntensiveLesson, StoryEvent } from '@/lib/curriculum-data';
import { LEVEL_THEMES, BuilderToken } from '../types';
import { StarredPhrase } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { speechEvaluator, PronunciationEvaluation } from '@/lib/speech-recognition';
import { getFigurativePronunciation } from '@/lib/phonetics';

export interface LessonRunnerProps {
  lesson: IntensiveLesson;
  starredPhrases: StarredPhrase[];
  onClose: () => void;
  onComplete: (action: 'continue' | 'immersion') => void;
  onToggleStarPhrase: (line: { en: string; es?: string; phonetic?: string }, lesson: IntensiveLesson) => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({
  lesson,
  starredPhrases,
  onClose,
  onComplete,
  onToggleStarPhrase,
}) => {
  const activeTheme = LEVEL_THEMES[lesson.level] || LEVEL_THEMES['A1'];

  // Pasos 1 a 6
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [isContinuousPlaying, setIsContinuousPlaying] = useState<boolean>(false);
  const [isContinuousPaused, setIsContinuousPaused] = useState<boolean>(false);
  
  const continuousStopRef = useRef<boolean>(false);
  const currentLineRef = useRef<number>(0);
  const audioSpeedRef = useRef<number>(1.0);
  const [revealedLineIndexes, setRevealedLineIndexes] = useState<number[]>([]);
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  // Mantener audioSpeedRef sincronizado
  useEffect(() => {
    audioSpeedRef.current = audioSpeed;
  }, [audioSpeed]);

  // Limpiar audio al desmontar componente
  useEffect(() => {
    return () => {
      continuousStopRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Paso 2: Comprensión
  const [step2SelectedIdx, setStep2SelectedIdx] = useState<number | null>(null);

  // Paso 3: Sentence Builder & Story Sequence
  const [selectedTokens, setSelectedTokens] = useState<BuilderToken[]>([]);
  const [builderStatus, setBuilderStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [selectedStoryEventIds, setSelectedStoryEventIds] = useState<string[]>([]);
  const [storyOrderCorrect, setStoryOrderCorrect] = useState<boolean | null>(null);

  // Paso 4: Shadowing y Fonética
  const [activeShadowingPhraseIdx, setActiveShadowingPhraseIdx] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationEvaluation | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showFigurativeHelper, setShowFigurativeHelper] = useState<boolean>(false);

  // Paso 5: Noticing Comunicativo
  const [step5SelectedIdx, setStep5SelectedIdx] = useState<number | null>(null);
  const [noticingExpanded, setNoticingExpanded] = useState<boolean>(false);

  // Paso 6: Reto de Desbloqueo y Maestría
  const [step6SelectedIdx, setStep6SelectedIdx] = useState<number | null>(null);
  const [lessonFinished, setLessonFinished] = useState<boolean>(false);

  const handleToggleStarPhrase = onToggleStarPhrase;

  // ==========================================
  // CONTROL MAESTRO DE SÍNTESIS DE VOZ Y AUDIO
  // ==========================================
  const pauseAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
      if (isContinuousPlaying) {
        setIsContinuousPaused(true);
      }
    }
  };

  const resumeAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
        if (isContinuousPlaying) {
          setIsContinuousPaused(false);
        }
      } else {
        // En caso de que el navegador pierda el estado paused, reanudar limpiamente
        setIsAudioPaused(false);
        if (isContinuousPlaying) {
          setIsContinuousPaused(false);
          playLineAt(currentLineRef.current);
        }
      }
    }
  };

  const stopAllAudio = () => {
    continuousStopRef.current = true;
    setIsContinuousPlaying(false);
    setIsContinuousPaused(false);
    setIsAudioSpeaking(false);
    setIsAudioPaused(false);
    setActiveAudioIndex(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const stopContinuousDialogue = stopAllAudio;

  const speakText = (text: string, lineIdx?: number, pitch: number = 1.0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (lineIdx !== undefined) setActiveAudioIndex(lineIdx);
    setIsAudioSpeaking(true);
    setIsAudioPaused(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = audioSpeedRef.current;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsAudioSpeaking(false);
      setIsAudioPaused(false);
      setActiveAudioIndex(null);
    };
    utterance.onerror = () => {
      setIsAudioSpeaking(false);
      setIsAudioPaused(false);
      setActiveAudioIndex(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeakLine = (line: { en: string; speaker: string }, idx: number) => {
    if (isContinuousPlaying) {
      stopAllAudio();
    }

    if (activeAudioIndex === idx && isAudioSpeaking) {
      if (!isAudioPaused) {
        pauseAudio();
      } else {
        resumeAudio();
      }
      return;
    }

    const isStudent = line.speaker.toLowerCase().includes('david') || line.speaker.toLowerCase().includes('learner') || line.speaker.toLowerCase().includes('candidate');
    speakText(line.en, idx, isStudent ? 1.08 : 0.94);
  };

  const playLineAt = (index: number) => {
    const lines = lesson.step1_dialogue.lines;
    if (continuousStopRef.current || index >= lines.length) {
      setIsContinuousPlaying(false);
      setIsContinuousPaused(false);
      setIsAudioSpeaking(false);
      setActiveAudioIndex(null);
      return;
    }

    currentLineRef.current = index;
    setActiveAudioIndex(index);
    setIsAudioSpeaking(true);
    setIsAudioPaused(false);

    const line = lines[index];
    const utterance = new SpeechSynthesisUtterance(line.en);
    utterance.lang = 'en-US';
    utterance.rate = audioSpeedRef.current;
    const isStudent = line.speaker.toLowerCase().includes('david') || line.speaker.toLowerCase().includes('learner') || line.speaker.toLowerCase().includes('candidate');
    utterance.pitch = isStudent ? 1.08 : 0.94;

    utterance.onend = () => {
      if (continuousStopRef.current) {
        setIsContinuousPlaying(false);
        setIsContinuousPaused(false);
        setIsAudioSpeaking(false);
        setActiveAudioIndex(null);
        return;
      }
      setTimeout(() => {
        if (!continuousStopRef.current && !isContinuousPaused) {
          playLineAt(index + 1);
        }
      }, 450);
    };

    utterance.onerror = () => {
      setIsContinuousPlaying(false);
      setIsContinuousPaused(false);
      setIsAudioSpeaking(false);
      setActiveAudioIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playContinuousDialogue = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isContinuousPlaying) {
      if (isContinuousPaused) {
        resumeAudio();
      } else {
        pauseAudio();
      }
      return;
    }

    stopAllAudio();
    continuousStopRef.current = false;
    setIsContinuousPlaying(true);
    setIsContinuousPaused(false);
    currentLineRef.current = 0;
    playLineAt(0);
  };

  const handleSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    audioSpeedRef.current = speed;
    soundManager.playClick();
    // Si hay audio activo en una línea o diálogo, actualizarlo de inmediato
    if (isContinuousPlaying && !isContinuousPaused && activeAudioIndex !== null) {
      window.speechSynthesis.cancel();
      playLineAt(currentLineRef.current);
    }
  };

  const toggleLineTranslation = (idx: number) => {
    setRevealedLineIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Tokens para el Sentence Builder
  const availableTokens: BuilderToken[] = useMemo(() => {
    if (!lesson?.step3_builder) return [];
    return lesson.step3_builder.scrambledWords.map((word, idx) => ({
      id: `tok-${idx}-${word}`,
      text: word,
    }));
  }, [lesson]);

  const handleSelectToken = (token: BuilderToken) => {
    soundManager.playClick();
    setSelectedTokens((prev) => [...prev, token]);
    setBuilderStatus('IDLE');
  };

  const handleDeselectToken = (tokenId: string) => {
    soundManager.playClick();
    setSelectedTokens((prev) => prev.filter((t) => t.id !== tokenId));
    setBuilderStatus('IDLE');
  };

  const handleResetTokens = () => {
    soundManager.playClick();
    setSelectedTokens([]);
    setBuilderStatus('IDLE');
  };

  const checkSentenceBuilder = () => {
    if (!lesson.step3_builder) return;
    const userWords = selectedTokens.map((t) => t.text.toLowerCase().trim());
    const correctWords = lesson.step3_builder.correctWords.map((w) => w.toLowerCase().trim());
    const isCorrect =
      userWords.length === correctWords.length &&
      userWords.every((word, idx) => word === correctWords[idx]);

    if (isCorrect) {
      setBuilderStatus('CORRECT');
      soundManager.playSuccess();
    } else {
      setBuilderStatus('WRONG');
      soundManager.playGentleError();
    }
  };

  // Story Sequence
  const handleSelectStoryEvent = (eventId: string) => {
    if (selectedStoryEventIds.includes(eventId)) {
      soundManager.playClick();
      setSelectedStoryEventIds((prev) => prev.filter((id) => id !== eventId));
      setStoryOrderCorrect(null);
    } else {
      soundManager.playClick();
      const updated = [...selectedStoryEventIds, eventId];
      setSelectedStoryEventIds(updated);
      if (lesson.step3_story_sequence && updated.length === lesson.step3_story_sequence.events.length) {
        const events = lesson.step3_story_sequence.events;
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

  // Shadowing & Speech Recognition
  const handleStartSpeechPractice = (targetPhrase: string) => {
    setSpeechError(null);
    setSpokenTranscript('');
    setPronunciationResult(null);
    setIsRecording(true);
    soundManager.playClick();

    const isAvailable = speechEvaluator.initRecognition(
      (interim) => setSpokenTranscript(interim),
      (evaluation) => {
        setIsRecording(false);
        setPronunciationResult(evaluation);
        if (evaluation.isPassing) {
          soundManager.playSuccess();
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
      setTimeout(() => {
        setIsRecording(false);
        const sim = speechEvaluator.evaluatePronunciation(targetPhrase, targetPhrase);
        setPronunciationResult(sim);
        soundManager.playSuccess();
      }, 2200);
    }
  };

  const handleStopSpeechPractice = () => {
    speechEvaluator.stopListening();
    setIsRecording(false);
    soundManager.playClick();
  };

  const handleFinish = (action: 'continue' | 'immersion') => {
    stopContinuousDialogue();
    soundManager.playSuccess();
    onComplete(action);
  };

  // Atajos de teclado en el Runner
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === 'Escape') {
        stopContinuousDialogue();
        onClose();
        return;
      }

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (currentStep === 1) {
          if (activeAudioIndex !== null && lesson.step1_dialogue.lines[activeAudioIndex]) {
            speakText(lesson.step1_dialogue.lines[activeAudioIndex].en, activeAudioIndex);
          } else {
            speakText(lesson.step1_dialogue.lines[0]?.en || '', 0);
          }
        } else if (currentStep === 2) {
          speakText(lesson.step2_comprehension.audioContextText);
        } else if (currentStep === 3 && lesson.step3_builder) {
          speakText(lesson.step3_builder.correctWords.join(' '));
        } else if (currentStep === 4) {
          speakText(lesson.step4_shadowing.phrases[activeShadowingPhraseIdx]?.en || '');
        } else if (currentStep === 5 && lesson.step5_monitor) {
          speakText(lesson.step5_monitor.options[lesson.step5_monitor.correctIndex]);
        } else if (currentStep === 6) {
          speakText(lesson.step6_mastery.options[lesson.step6_mastery.correctIndex]);
        }
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        if (currentStep === 2 && lesson.step2_comprehension.options[optionIdx]) {
          setStep2SelectedIdx(optionIdx);
          if (optionIdx === lesson.step2_comprehension.correctIndex) soundManager.playSuccess();
          else soundManager.playGentleError();
        } else if (currentStep === 5 && lesson.step5_monitor?.options[optionIdx]) {
          setStep5SelectedIdx(optionIdx);
          if (optionIdx === lesson.step5_monitor.correctIndex) soundManager.playSuccess();
          else soundManager.playGentleError();
        } else if (currentStep === 6 && lesson.step6_mastery.options[optionIdx]) {
          setStep6SelectedIdx(optionIdx);
          if (optionIdx === lesson.step6_mastery.correctIndex) {
            soundManager.playSuccess();
            setLessonFinished(true);
          } else {
            soundManager.playGentleError();
          }
        }
      }

      if (e.key === 'Enter') {
        if (currentStep === 3 && builderStatus === 'IDLE' && selectedTokens.length > 0) {
          checkSentenceBuilder();
        } else if (currentStep < 6) {
          setCurrentStep((prev) => Math.min(6, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lesson, currentStep, activeAudioIndex, activeShadowingPhraseIdx, builderStatus, selectedTokens]);

  return (

    <div className="fixed inset-0 z-50 bg-[#07090e] flex flex-col text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">

      {/* Top Bar de Progreso Segmentada Estilo Duolingo Pro */}
      <header className="border-b border-slate-800 px-4 md:px-8 py-3.5 bg-[#090d16]/95 backdrop-blur-xl flex items-center justify-between gap-4 shadow-sm">
        <button
          onClick={() => {
            stopContinuousDialogue();
            onClose();
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
              {lesson.code} • {lesson.title}
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

          {/* Selector de Velocidad Multi-Escala */}
          <div className="flex items-center bg-[#0c111c] border border-slate-800 rounded-xl p-0.5 text-[10px] font-mono font-bold">
            <span className="px-1.5 text-slate-500 text-[9px] uppercase hidden md:inline">Velocidad:</span>
            {[0.75, 0.85, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                  audioSpeed === speed
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Velocidad de reproducción ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>+{lesson.xpReward} XP</span>
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
                      {lesson.step1_dialogue.context}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  {/* Toggle de Traducciones para evitar traducción mental */}
                  <button
                    onClick={() => setShowTranslations(!showTranslations)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${showTranslations
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
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${showFigurativeHelper
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      : 'bg-[#0e1626] text-slate-300 hover:text-amber-300 border-slate-700'
                      }`}
                    title="Mostrar/Ocultar ayuda fonética aproximada como apoyo secundario"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px]">{showFigurativeHelper ? 'Ocultar Apoyo' : 'Apoyo Fonético'}</span>
                  </button>

                  {/* Controles del Reproductor de Diálogo Continuo */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={playContinuousDialogue}
                      className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-md cursor-pointer ${
                        isContinuousPlaying && !isContinuousPaused
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black ring-2 ring-amber-400/30'
                          : isContinuousPlaying && isContinuousPaused
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black ring-2 ring-emerald-400/30 animate-pulse'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-slate-950 font-black shadow-emerald-500/20'
                      }`}
                      title={
                        isContinuousPlaying && !isContinuousPaused
                          ? 'Pausar reproducción continua'
                          : isContinuousPlaying && isContinuousPaused
                          ? 'Reanudar reproducción continua'
                          : 'Reproducir todo el diálogo de corrido'
                      }
                    >
                      {isContinuousPlaying && !isContinuousPaused ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pausar Diálogo</span>
                        </>
                      ) : isContinuousPlaying && isContinuousPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Reanudar Diálogo</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Todo el Diálogo</span>
                        </>
                      )}
                    </button>

                    {isContinuousPlaying && (
                      <button
                        onClick={stopAllAudio}
                        className="p-1.5 rounded-xl bg-[#0e1626] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition cursor-pointer"
                        title="Detener audio completamente"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Flujo Conversacional en Formato de Chat */}
              <div className="space-y-4 pt-1">
                {lesson.step1_dialogue.lines.map((line, idx) => {
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
                      <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition duration-200 border-2 shadow-sm ${isPlayingThisLine
                        ? isAudioPaused
                          ? 'ring-2 ring-amber-500 shadow-md border-amber-500'
                          : 'ring-2 ring-emerald-500 shadow-md border-emerald-500'
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
                              onClick={() => handleToggleStarPhrase(line, lesson)}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${isStarred
                                ? 'text-amber-400 bg-amber-500/20 ring-1 ring-amber-400/40 shadow-xs'
                                : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                                }`}
                              title={isStarred ? "Frase Estrella guardada en tu mazo SRS (⭐)" : "Añadir a mi mazo SRS como Frase Estrella (⭐)"}
                            >
                              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>

                            {/* Botón de Audio con Control de Play / Pausa / Reanudación */}
                            <button
                              onClick={() => toggleSpeakLine(line, idx)}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${isPlayingThisLine
                                ? isAudioPaused
                                  ? 'text-amber-300 bg-amber-950/80 ring-2 ring-amber-500/40'
                                  : 'text-emerald-300 bg-emerald-950/80 ring-2 ring-emerald-500/40'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                              title={
                                isPlayingThisLine
                                  ? isAudioPaused
                                    ? "Reanudar audio"
                                    : "Pausar audio"
                                  : "Escuchar pronunciación nativa"
                              }
                            >
                              {isPlayingThisLine ? (
                                isAudioPaused ? (
                                  <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                                ) : (
                                  <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                                    <span className="w-0.5 bg-emerald-400 h-2.5 animate-pulse rounded-full" />
                                    <span className="w-0.5 bg-emerald-300 h-3.5 animate-bounce rounded-full" />
                                    <span className="w-0.5 bg-emerald-400 h-2 animate-pulse rounded-full" />
                                  </div>
                                )
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeAudioIndex === 999 && isAudioSpeaking) {
                        if (isAudioPaused) resumeAudio();
                        else pauseAudio();
                      } else {
                        speakText(lesson.step2_comprehension.audioContextText, 999);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                      activeAudioIndex === 999 && isAudioSpeaking
                        ? isAudioPaused
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                          : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-slate-950 font-black'
                    }`}
                  >
                    {activeAudioIndex === 999 && isAudioSpeaking ? (
                      isAudioPaused ? (
                        <>
                          <Play className="w-4 h-4 fill-current text-slate-950" />
                          <span>Reanudar Pasaje</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 fill-current text-slate-950" />
                          <span>Pausar Pasaje</span>
                        </>
                      )
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Reproducir Pasaje</span>
                      </>
                    )}
                  </button>
                  {activeAudioIndex === 999 && isAudioSpeaking && (
                    <button
                      onClick={stopAllAudio}
                      className="p-2.5 rounded-xl bg-[#0c111c] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
                      title="Detener audio"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Pregunta de Comprensión
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                  {lesson.step2_comprehension.prompt}
                </h2>
              </div>

              {/* Opciones con Letras Grandes */}
              <div className="space-y-3">
                {lesson.step2_comprehension.options.map((opt, idx) => {
                  const isSelected = step2SelectedIdx === idx;
                  const isCorrect = idx === lesson.step2_comprehension.correctIndex;
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
                  <p>{lesson.step2_comprehension.explanation}</p>
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
              {lesson.step3_story_sequence?.events && lesson.step3_story_sequence.events.length > 0 ? (
                /* MODO PRINCIPAL: RECONSTRUYE LA HISTORIA NARRATIVA */
                <div className="space-y-6">
                  <div className="space-y-2 text-center max-w-xl mx-auto">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
                      Etapa 3 • Reconstruye la Historia (Significado Primero)
                    </span>
                    <h2 className="text-base md:text-lg font-bold text-white pt-1">
                      {lesson.step3_story_sequence.instruction || "Ordena los eventos según ocurrieron en la conversación"}
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
                        const ev = lesson.step3_story_sequence?.events.find((e: StoryEvent) => e.id === id);
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
                    {lesson.step3_story_sequence.events.map((ev: StoryEvent) => {
                      const isChosen = selectedStoryEventIds.includes(ev.id);
                      const orderNum = selectedStoryEventIds.indexOf(ev.id) + 1;
                      return (
                        <button
                          key={ev.id}
                          onClick={() => handleSelectStoryEvent(ev.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${isChosen
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
                      {lesson.step3_builder.instruction}
                    </h2>
                    <div className="p-3 rounded-xl bg-[#080c14] border border-slate-800 text-emerald-300 font-semibold text-sm shadow-xs">
                      &ldquo;{lesson.step3_builder.targetTranslationEs}&rdquo;
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
                  {lesson.step4_shadowing.instruction}
                </h2>
              </div>

              {/* Selector de Frases de Shadowing */}
              <div className="space-y-3.5">
                {lesson.step4_shadowing.phrases.map((phrase, idx) => {
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
                      className={`p-4 md:p-5 rounded-2xl cursor-pointer transition space-y-2.5 shadow-xs border-2 ${isCurrentActivePhrase
                        ? 'bg-[#0e1626] border-cyan-500 ring-2 ring-cyan-500/20 shadow-md text-white'
                        : 'bg-[#0c111c]/90 border-slate-800 hover:border-slate-700 hover:bg-[#111928] text-slate-200'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-md font-bold uppercase">
                          {phrase.levelLabel} {isCurrentActivePhrase && '• Seleccionada'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const audioId = 4000 + idx;
                              if (activeAudioIndex === audioId && isAudioSpeaking) {
                                if (isAudioPaused) resumeAudio();
                                else pauseAudio();
                              } else {
                                speakText(phrase.en, audioId);
                              }
                            }}
                            className={`flex items-center gap-1.5 text-xs transition px-3 py-1.5 rounded-xl border font-medium cursor-pointer ${
                              activeAudioIndex === 4000 + idx && isAudioSpeaking
                                ? isAudioPaused
                                  ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                                  : 'bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                                : 'bg-[#080c14] border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-slate-700'
                            }`}
                          >
                            {activeAudioIndex === 4000 + idx && isAudioSpeaking ? (
                              isAudioPaused ? (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                                  <span>Reanudar</span>
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current text-emerald-400" />
                                  <span>Pausar</span>
                                </>
                              )
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Escuchar Modelo</span>
                              </>
                            )}
                          </button>
                          {activeAudioIndex === 4000 + idx && isAudioSpeaking && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                stopAllAudio();
                              }}
                              className="p-1.5 rounded-xl bg-[#080c14] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                              title="Detener audio"
                            >
                              <Square className="w-3 h-3 fill-current" />
                            </button>
                          )}
                        </div>
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
                const activePhrase = lesson.step4_shadowing.phrases[activeShadowingPhraseIdx] || lesson.step4_shadowing.phrases[0];
                return (
                  <div className="p-6 rounded-3xl bg-[#0c111c]/90 border border-slate-800 flex flex-col items-center justify-center gap-4 text-center shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                        Práctica Activa de Voz (Frase {activeShadowingPhraseIdx + 1} de {lesson.step4_shadowing.phrases.length})
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
                          <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${pronunciationResult.accuracyScore >= 70
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
                                className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-medium ${wRes.isMatched
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
                  {lesson.step5_noticing?.concept || lesson.step5_monitor.explanationConcept}
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
                        &ldquo;{lesson.step5_noticing?.quoteEn || lesson.step1_dialogue.lines[0]?.en}&rdquo;
                      </strong>
                      {lesson.step5_noticing?.quoteEs && (
                        <span className="text-xs text-slate-400 block italic">
                          &ldquo;{lesson.step5_noticing.quoteEs}&rdquo;
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
                        {lesson.step5_noticing?.explanation || lesson.step5_monitor.ruleInsight}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Comprensión Pragmática: Intención del Hablante (Sin penalización) */}
              {lesson.step5_noticing?.pragmaticChoice ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-300">
                      {lesson.step5_noticing.pragmaticChoice.prompt}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {lesson.step5_noticing.pragmaticChoice.options.map((opt: string, optIdx: number) => {
                      const isChosen = step5SelectedIdx === optIdx;
                      const isCorrect = optIdx === lesson.step5_noticing?.pragmaticChoice?.correctIndex;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setStep5SelectedIdx(optIdx);
                            if (isCorrect) soundManager.playSuccess();
                            else soundManager.playClick();
                          }}
                          className={`p-4 rounded-2xl border text-left transition space-y-2 shadow-xs ${isChosen
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

                  {step5SelectedIdx !== null && lesson.step5_noticing?.pragmaticChoice?.insight && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200"
                    >
                      💡 {lesson.step5_noticing.pragmaticChoice.insight}
                    </motion.div>
                  )}
                </div>
              ) : (
                /* Fallback con opciones existentes bajo enfoque reflexivo */
                <div className="space-y-3">
                  <div className="text-center text-xs text-slate-400 font-medium pb-1">
                    ¿Cuál de estas formulaciones refleja mejor el uso natural angloparlante?
                  </div>
                  {lesson.step5_monitor.options.map((opt, idx) => {
                    const isSelected = step5SelectedIdx === idx;
                    const isCorrect = idx === lesson.step5_monitor.correctIndex;
                    const letters = ['A', 'B', 'C'];

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setStep5SelectedIdx(idx);
                          if (isCorrect) soundManager.playSuccess();
                          else soundManager.playClick();
                        }}
                        className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition flex items-center justify-between gap-4 shadow-sm ${isSelected
                          ? 'bg-purple-950/60 border-2 border-purple-500 text-purple-100 font-semibold'
                          : 'bg-[#0c111c] border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#111928]'
                          }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs border ${isSelected ? 'bg-purple-500 text-white border-purple-400' : 'bg-[#080c14] border-slate-800 text-slate-400'
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
                      {lesson.step6_mastery.question}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {lesson.step6_mastery.options.map((opt, idx) => {
                      const isSelected = step6SelectedIdx === idx;
                      const isCorrect = idx === lesson.step6_mastery.correctIndex;
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
                      {lesson.step6_mastery.successMessage}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 text-xs font-mono">
                    <div className="p-3.5 rounded-2xl bg-[#080c14] border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">RECOMPENSA</span>
                      <span className="text-emerald-400 font-extrabold text-base">+{lesson.xpReward} XP</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#080c14] border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">RACHA ACTIVA</span>
                      <span className="text-amber-400 font-extrabold text-base">3 Días 🔥</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => handleFinish('continue')}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      <span>Continuar Ruta de Adquisición</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        handleFinish('immersion');
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

  );
};
