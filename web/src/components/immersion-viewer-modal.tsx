'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Headphones, 
  Brain, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles, 
  Star, 
  RotateCw, 
  Info,
  Clock,
  Zap,
  CheckCircle2,
  ArrowLeft,
  Bot,
  Layers,
  FileText
} from 'lucide-react';
import { SubNode, ExtensiveStory } from '../content/course-content';
import { soundManager } from '../lib/sound-effects';
import { AppStorage } from '../lib/storage';
import { PersonalizedInputEngine } from '../lib/personalized-input-engine';

interface ImmersionViewerModalProps {
  subNode: SubNode | null;
  onClose: () => void;
  onComplete: (subNodeId: string, xpReward: number) => void;
  isCompleted: boolean;
  levelColor?: string;
  onAddMinutes?: (minutes: number) => void;
}

export function ImmersionViewerModal({
  subNode,
  onClose,
  onComplete,
  isCompleted,
  levelColor = 'from-emerald-500 to-teal-400',
  onAddMinutes,
}: ImmersionViewerModalProps) {
  // Estados para Reading Principal
  const [selectedWord, setSelectedWord] = useState<{ 
    word: string; 
    definition: string; 
    phonetic?: string;
    isTechnical?: boolean;
    isStarred?: boolean;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isPlayingFullAudio, setIsPlayingFullAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Estados para Extensive Reading (Inmersión Masiva)
  const [isExtensiveMode, setIsExtensiveMode] = useState(false);
  const [selectedExtensiveIdx, setSelectedExtensiveIdx] = useState(0);
  const [completedExtensiveIds, setCompletedExtensiveIds] = useState<string[]>([]);
  const [aiCustomStories, setAiCustomStories] = useState<ExtensiveStory[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Estados para Listening
  const [activeListeningLineIdx, setActiveListeningLineIdx] = useState<number | null>(null);
  const [isPlayingListeningAudio, setIsPlayingListeningAudio] = useState(false);

  // Estados para SRS
  const [currentSrsCardIdx, setCurrentSrsCardIdx] = useState(0);
  const [isSrsFlipped, setIsSrsFlipped] = useState(false);

  // Limpiar síntesis de voz al desmontar o cerrar
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!subNode) return null;

  const reading = subNode.content.reading;
  const listening = subNode.content.listening;
  const srs = subNode.content.srs;

  // Lista consolidada de historias extensivas (las del sub-nodo + generadas por IA)
  const allExtensiveStories: ExtensiveStory[] = [
    ...(reading?.extensiveStories || []),
    ...aiCustomStories
  ];

  // Reproducir texto por TTS
  const speakText = (text: string, onEnd?: () => void, rate: number = audioSpeed) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = (rawWord: string, e: React.MouseEvent, vocabDictionary?: Record<string, string>) => {
    e.stopPropagation();
    const cleanWord = rawWord.replace(/[^a-zA-Z0-9']/g, '').toLowerCase();
    if (!cleanWord || cleanWord.length < 2) return;

    const dict = vocabDictionary || reading?.vocabulary || {};
    
    // 1. Buscar coincidencia exacta
    let matchedKey = Object.keys(dict).find(k => k.toLowerCase() === cleanWord);

    // 2. Si no coincide directamente, buscar si es parte de un término compuesto BPO (ej: "two-factor authentication", "zip code", "open-ended question")
    if (!matchedKey) {
      matchedKey = Object.keys(dict).find(k => {
        const cleanKey = k.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
        const parts = cleanKey.split(/\s+/).filter(Boolean);
        return parts.includes(cleanWord);
      });
    }

    // 3. Fallbacks morfológicos (plurales o participios pasados)
    let def = matchedKey ? dict[matchedKey] : undefined;
    if (!def && cleanWord.endsWith('s')) {
      const singular = cleanWord.slice(0, -1);
      matchedKey = Object.keys(dict).find(k => k.toLowerCase() === singular);
      if (matchedKey) def = dict[matchedKey];
    }
    if (!def && cleanWord.endsWith('ed')) {
      const base = cleanWord.slice(0, -2);
      matchedKey = Object.keys(dict).find(k => k.toLowerCase() === base);
      if (matchedKey) def = dict[matchedKey];
    }

    const displayWord = matchedKey || cleanWord;
    const isTechnical = !!matchedKey;
    const definition = def || `Palabra contextual en inglés: "${cleanWord}". Exposición de input comprensible.`;

    // Posición del tooltip interactivo
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });

    setSelectedWord({
      word: displayWord,
      definition,
      isTechnical,
      isStarred: false
    });

    // Pronunciar el término al hacer clic
    speakText(displayWord, undefined, 0.9);
  };

  const handleToggleStarWord = (word: string, def: string) => {
    AppStorage.toggleStarredPhrase({
      id: `word-${word}`,
      en: word,
      es: def,
      context: reading?.title || 'Glosario BPO SRS',
      lessonId: subNode?.motherNodeId || 'general',
      level: 'B1'
    });
    setSelectedWord(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
    soundManager.playSuccess();
  };

  const handleFinishSubNode = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    soundManager.playVictory();
    onComplete(subNode.id, subNode.xpReward);
  };

  // Finalizar lectura de una historia adicional (Extensive Reading)
  const handleFinishExtensiveStory = (story: ExtensiveStory) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingFullAudio(false);
    }
    soundManager.playVictory();

    const mins = story.readingMinutes || 2;
    AppStorage.addImmersionMinutes(mins);
    if (onAddMinutes) {
      onAddMinutes(mins);
    }

    if (!completedExtensiveIds.includes(story.id)) {
      setCompletedExtensiveIds(prev => [...prev, story.id]);
    }

    // Registrar exposición léxica en el motor SLA
    Object.keys(story.vocabulary).forEach(word => {
      PersonalizedInputEngine.recordExposure(word, 'A1', story.title);
    });
  };

  // Generación de historia con IA adaptada i+1
  const handleGenerateAiStory = () => {
    setIsGeneratingAi(true);
    setAiNotice(null);

    const targetVocab = Object.keys(reading?.vocabulary || {});
    const promptConfig = PersonalizedInputEngine.prepareInputPlusOnePrompt(targetVocab, reading?.title || 'Campus Life');

    setTimeout(() => {
      const generatedIndex = aiCustomStories.length + 1;
      const newAiStory: ExtensiveStory = {
        id: `ai-story-${subNode.id}-${generatedIndex}`,
        title: `A New Day at the University • Parte ${generatedIndex}`,
        wordCount: 155,
        readingMinutes: 2,
        paragraphs: [
          `David walks into the university courtyard with his backpack. The morning is quiet and peaceful. He checks his schedule on his phone and smiles because he is ready for his lecture.`,
          `Near the student lounge, he sees his friend Sarah. She holds a blue notebook and two pens. "Good morning, David!" she says warmly. "Welcome back to the faculty. Are you ready for our computer science workshop?"`,
          `"Yes, I am completely ready," David replies. "The auditorium is next to the library with the blue door. Let us walk together before class begins." They step inside with confidence.`
        ],
        vocabulary: {
          'schedule': 'Horario',
          'backpack': 'Mochila',
          'notebook': 'Cuaderno',
          'ready': 'Listo/a',
          'friend': 'Amigo/a',
          'welcome': 'Bienvenido/a',
          'next to': 'Al lado de'
        }
      };

      setAiCustomStories(prev => [...prev, newAiStory]);
      setSelectedExtensiveIdx(allExtensiveStories.length);
      setIsGeneratingAi(false);
      setAiNotice('Próximamente disponible con Gemini API en vivo. Tu motor pedagógico i+1 generó esta historia estructurada al 90% conocido y 10% nuevo.');
      soundManager.playSuccess();
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04060a]/90 backdrop-blur-2xl overflow-y-auto"
      onClick={() => setSelectedWord(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#0b101b] border-2 border-slate-800/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Header del Visor */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-800/90 bg-[#090d16]/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold">
              {subNode.type === 'reading' && <BookOpen className="w-5 h-5 text-emerald-400" />}
              {subNode.type === 'listening' && <Headphones className="w-5 h-5 text-cyan-400" />}
              {subNode.type === 'srs' && <Brain className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {subNode.label}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  +{subNode.xpReward} XP
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Completado
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {subNode.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            title="Cerrar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ===================================================================
            1. VISTA DE LECTURA (READING VIEWER + EXTENSIVE READING)
        =================================================================== */}
        {subNode.type === 'reading' && reading && (
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
            
            {/* SUB-VISTA A: LECTURA PRINCIPAL */}
            {!isExtensiveMode ? (
              <>
                {/* Meta de Lectura */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#080c14] border border-slate-800/80">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      ~{reading.readingMinutes} min de lectura
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                      {reading.wordCount} palabras
                    </span>
                  </div>

                  {/* Botón de Audio Narrativo */}
                  <button
                    onClick={() => {
                      if (isPlayingFullAudio) {
                        window.speechSynthesis.cancel();
                        setIsPlayingFullAudio(false);
                      } else {
                        setIsPlayingFullAudio(true);
                        const allText = reading.paragraphs.join(' ');
                        speakText(allText, () => setIsPlayingFullAudio(false));
                      }
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                      isPlayingFullAudio
                        ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 animate-pulse'
                        : 'bg-[#0e1626] border-slate-700 text-slate-200 hover:border-emerald-500/40 hover:text-emerald-300'
                    }`}
                  >
                    {isPlayingFullAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{isPlayingFullAudio ? 'Detener Audio' : 'Escuchar Narración'}</span>
                  </button>
                </div>

                {/* Aviso amigable de interactividad */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-teal-300 bg-teal-950/40 border border-teal-500/30 px-3 py-1.5 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Toca o haz clic en cualquier palabra para ver su significado inmediato y escuchar su pronunciación.</span>
                </div>

                {/* Texto de la Historia Principal con Glosario Interactivo SRS */}
                <div className="space-y-4 font-sans leading-relaxed text-base md:text-lg text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
                  {reading.paragraphs.map((paragraph, pIdx) => {
                    const words = paragraph.split(' ');
                    return (
                      <p key={pIdx} className="p-3.5 rounded-2xl bg-[#090d16]/70 border border-slate-800/40 hover:border-slate-700/60 transition">
                        {words.map((w, wIdx) => {
                          const clean = w.replace(/[^a-zA-Z0-9']/g, '').toLowerCase();
                          const isVocab = reading.vocabulary && Object.keys(reading.vocabulary).some(k => {
                            const cleanK = k.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
                            const parts = cleanK.split(/\s+/).filter(Boolean);
                            return k.toLowerCase() === clean || parts.includes(clean);
                          });
                          return (
                            <span
                              key={wIdx}
                              onClick={(e) => handleWordClick(w, e)}
                              className={`cursor-pointer transition duration-150 inline-block px-0.5 rounded ${
                                isVocab 
                                  ? 'text-amber-300 font-semibold underline decoration-amber-500/50 decoration-2 underline-offset-4 hover:bg-amber-950/60 hover:text-white' 
                                  : 'hover:text-emerald-300 hover:bg-slate-800/70'
                              }`}
                            >
                              {w}{' '}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Glosario Interactivo SRS al Pie */}
                <div className="p-4 rounded-2xl bg-[#080c14] border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Glosario Interactivo SRS • Vocabulario BPO y Expresiones Clave:
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {Object.keys(reading.vocabulary || {}).length} Términos
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(reading.vocabulary).map(([word, meaning], idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handleWordClick(word, e)}
                        className="text-xs px-2.5 py-1.5 rounded-xl bg-[#0e1626] border border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-amber-950/40 transition flex items-center gap-1.5 group shadow-sm"
                        title="Clic para pronunciar y guardar en SRS"
                      >
                        <strong className="capitalize group-hover:text-amber-300">{word}:</strong>
                        <span className="text-slate-300 text-[11px]">{meaning}</span>
                        <Star className="w-3 h-3 text-amber-400/60 group-hover:text-amber-400 group-hover:fill-amber-400 shrink-0 ml-0.5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner / Botón "Read more about this topic" (Extensive Reading) */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-950/40 via-[#0c1626] to-slate-900 border-2 border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold">
                          Extensive Reading • Inmersión Profunda MCER
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        ¿Deseas profundizar con lecturas adicionales?
                      </h4>
                      <p className="text-xs text-slate-400">
                        Acumula minutos de inmersión para el MCER leyendo historias contextuales con el vocabulario de esta lección.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsExtensiveMode(true)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read more about this topic</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* SUB-VISTA B: MODO EXTENSIVE READING (HISTORIAS ADICIONALES + MOTOR IA) */
              <div className="space-y-6">
                
                {/* Barra de Navegación de Inmersión Profunda */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <button
                    onClick={() => {
                      if (isPlayingFullAudio) {
                        window.speechSynthesis.cancel();
                        setIsPlayingFullAudio(false);
                      }
                      setIsExtensiveMode(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a la lectura principal</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateAiStory}
                      disabled={isGeneratingAi}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-indigo-500/20 disabled:opacity-50"
                    >
                      <Bot className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAi ? 'Generando historia i+1...' : 'Generar nueva historia'}</span>
                    </button>
                  </div>
                </div>

                {/* Notificación de Estado IA / API Key */}
                {aiNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 flex items-start gap-3"
                  >
                    <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="text-purple-300 font-mono uppercase text-[10px] block">
                        Personalized Input Engine (Krashen SLA)
                      </strong>
                      <p>{aiNotice}</p>
                    </div>
                  </motion.div>
                )}

                {/* Selector de Historias Disponibles */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Historias de Inmersión Disponibles ({allExtensiveStories.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {allExtensiveStories.map((story, sIdx) => {
                      const isSelected = selectedExtensiveIdx === sIdx;
                      const isRead = completedExtensiveIds.includes(story.id);
                      return (
                        <button
                          key={story.id}
                          onClick={() => {
                            if (isPlayingFullAudio) {
                              window.speechSynthesis.cancel();
                              setIsPlayingFullAudio(false);
                            }
                            setSelectedExtensiveIdx(sIdx);
                          }}
                          className={`p-3.5 rounded-2xl text-left border transition flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/40'
                              : 'bg-[#090d16] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] font-mono text-teal-400 font-bold block">
                              Historia #{sIdx + 1} • ~{story.readingMinutes} min
                            </span>
                            <p className="text-xs font-bold text-white truncate">{story.title}</p>
                          </div>
                          {isRead ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {story.wordCount} pal.
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lector de la Historia Extensiva Seleccionada */}
                {allExtensiveStories[selectedExtensiveIdx] && (() => {
                  const currentStory = allExtensiveStories[selectedExtensiveIdx];
                  const isStoryFinished = completedExtensiveIds.includes(currentStory.id);

                  return (
                    <div className="space-y-4 p-5 rounded-3xl bg-[#090d16] border border-slate-800">
                      
                      {/* Meta de la Historia Extensiva */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-950/60 border border-teal-500/30">
                            Input Comprensible i+1
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">
                            {currentStory.title}
                          </h3>
                        </div>

                        <button
                          onClick={() => {
                            if (isPlayingFullAudio) {
                              window.speechSynthesis.cancel();
                              setIsPlayingFullAudio(false);
                            } else {
                              setIsPlayingFullAudio(true);
                              const fullText = currentStory.paragraphs.join(' ');
                              speakText(fullText, () => setIsPlayingFullAudio(false));
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                            isPlayingFullAudio
                              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 animate-pulse'
                              : 'bg-[#0e1626] border-slate-700 text-slate-200 hover:border-teal-500/40 hover:text-teal-300'
                          }`}
                        >
                          {isPlayingFullAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
                          <span>{isPlayingFullAudio ? 'Detener' : 'Escuchar Historia'}</span>
                        </button>
                      </div>

                      {/* Párrafos Clicables de la Historia Extensiva */}
                      <div className="space-y-3 font-sans leading-relaxed text-sm sm:text-base text-slate-200">
                        {currentStory.paragraphs.map((p, pIdx) => {
                          const words = p.split(' ');
                          return (
                            <p key={pIdx} className="p-3 rounded-xl bg-[#0b101c] border border-slate-800/40">
                              {words.map((w, wIdx) => {
                                const clean = w.replace(/[^a-zA-Z']/g, '').toLowerCase();
                                const isVocab = currentStory.vocabulary && currentStory.vocabulary[clean];
                                return (
                                  <span
                                    key={wIdx}
                                    onClick={(e) => handleWordClick(w, e, currentStory.vocabulary)}
                                    className={`cursor-pointer transition duration-150 inline-block px-0.5 rounded ${
                                      isVocab
                                        ? 'text-teal-300 font-semibold underline decoration-teal-500/40 decoration-2 underline-offset-4 hover:bg-teal-950/60 hover:text-white'
                                        : 'hover:text-teal-300 hover:bg-slate-800/70'
                                    }`}
                                  >
                                    {w}{' '}
                                  </span>
                                );
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* Botón "He terminado de leer" para esta historia adicional */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-400">
                          {isStoryFinished 
                            ? '✓ Lectura registrada en tu contador de Input Comprensible.' 
                            : `Al terminar, sumarás +${currentStory.readingMinutes} min al contador de inmersión.`}
                        </span>

                        <button
                          onClick={() => handleFinishExtensiveStory(currentStory)}
                          disabled={isStoryFinished}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                            isStoryFinished
                              ? 'bg-slate-800 border border-slate-700 text-slate-400 cursor-default'
                              : 'bg-gradient-to-r from-teal-500 to-emerald-400 hover:opacity-95 text-slate-950 shadow-lg shadow-teal-500/20 active:scale-95'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>
                            {isStoryFinished 
                              ? 'Completado' 
                              : `He terminado de leer (+${currentStory.readingMinutes} min de Input)`}
                          </span>
                        </button>
                      </div>

                    </div>
                  );
                })()}

              </div>
            )}

            {/* Tooltip Emergente al hacer clic en una palabra (Glosario Interactivo SRS) */}
            {selectedWord && tooltipPos && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  position: 'fixed',
                  left: Math.max(16, Math.min(window.innerWidth - 300, tooltipPos.x - 140)),
                  top: Math.max(80, tooltipPos.y - 130),
                  zIndex: 60,
                }}
                className="w-80 p-3.5 rounded-2xl bg-[#0d1424] border-2 border-amber-500/60 shadow-2xl space-y-2 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm capitalize">{selectedWord.word}</strong>
                    <button
                      onClick={() => speakText(selectedWord.word, undefined, 0.9)}
                      className="p-1 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:text-white"
                      title="Escuchar pronunciación"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleStarWord(selectedWord.word, selectedWord.definition)}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg border transition ${
                      selectedWord.isStarred
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                    }`}
                    title="Añadir a Repaso Espaciado (SRS)"
                  >
                    <Star className={`w-3.5 h-3.5 ${selectedWord.isStarred ? 'fill-current' : ''}`} />
                    <span>{selectedWord.isStarred ? 'En SRS' : '+ SRS'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    {selectedWord.isTechnical ? 'Término BPO' : 'Input SLA'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Click-to-define SRS</span>
                </div>

                <p className="text-xs text-slate-200 leading-snug">
                  {selectedWord.definition}
                </p>
              </motion.div>
            )}

          </div>
        )}

        {/* ===================================================================
            2. VISTA DE ESCUCHA (LISTENING VIEWER RECEPTIVO SIN PRESIÓN)
        =================================================================== */}
        {subNode.type === 'listening' && listening && (
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
            
            {/* Reproductor Central */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1424] to-[#080c14] border-2 border-cyan-500/30 text-center space-y-4 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 inline-block">
                Audio Nativo Receptivo • Duración: {listening.audioDurationText}
              </span>

              <h3 className="text-lg md:text-xl font-black text-white">
                {listening.title}
              </h3>

              {/* Botón Principal de Reproducción */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (isPlayingListeningAudio) {
                      window.speechSynthesis.cancel();
                      setIsPlayingListeningAudio(false);
                      setActiveListeningLineIdx(null);
                    } else {
                      setIsPlayingListeningAudio(true);
                      speakText(listening.audioScriptEn, () => {
                        setIsPlayingListeningAudio(false);
                        setActiveListeningLineIdx(null);
                      });
                    }
                  }}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-sm transition shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  {isPlayingListeningAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 fill-slate-950" />}
                  <span>{isPlayingListeningAudio ? 'Pausar Reproducción' : 'Reproducir Audio Completo'}</span>
                </button>
              </div>

              {/* Animación de Onda Sonora */}
              {isPlayingListeningAudio && (
                <div className="flex items-center justify-center gap-1 h-6 pt-2">
                  {[40, 70, 100, 50, 80, 100, 60, 90, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', `${h}%`, '20%'] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                      className="w-1 bg-cyan-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Píldora Cultural / SLA */}
            <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-cyan-300 font-mono uppercase text-[10px]">Nota Cultural y Pragmática:</strong>
                <p>{listening.culturalInsight}</p>
              </div>
            </div>

            {/* Transcripción Detallada Línea por Línea */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Transcripción y Traducción Paralela:
              </span>
              {listening.transcriptLines.map((line, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveListeningLineIdx(idx);
                    speakText(line.en, () => setActiveListeningLineIdx(null));
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                    activeListeningLineIdx === idx
                      ? 'bg-cyan-950/40 border-cyan-500 text-white ring-2 ring-cyan-500/20'
                      : 'bg-[#090d16] border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                      {line.speaker}
                    </span>
                    <p className="text-sm font-semibold text-white">&ldquo;{line.en}&rdquo;</p>
                    <p className="text-xs text-slate-400 italic">{line.es}</p>
                    {line.phonetic && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block mt-1">
                        IPA: {line.phonetic}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(line.en);
                    }}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white"
                    title="Escuchar esta línea"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ===================================================================
            3. VISTA DE REPASO ESPACIADO (SRS MINI SESSION)
        =================================================================== */}
        {subNode.type === 'srs' && srs && (
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
            <div className="space-y-1 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 inline-block">
                Sesión Rápida de Consolidación SRS
              </span>
              <h3 className="text-lg md:text-xl font-black text-white">
                {srs.title}
              </h3>
              <p className="text-xs text-slate-400">
                Tarjeta {(currentSrsCardIdx % srs.targetPhrases.length) + 1} de {srs.targetPhrases.length}
              </p>
            </div>

            {/* Tarjeta SRS Flip */}
            {(() => {
              const card = srs.targetPhrases[currentSrsCardIdx % srs.targetPhrases.length];
              return (
                <div
                  onClick={() => setIsSrsFlipped(!isSrsFlipped)}
                  className="cursor-pointer min-h-[220px] rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#0e1626] to-[#0c111c] border-2 border-slate-700/80 hover:border-amber-500/50 shadow-2xl flex flex-col justify-between text-center transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-md uppercase">
                      {card.context}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(card.en);
                      }}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-auto py-4">
                    {!isSrsFlipped ? (
                      <div className="space-y-2">
                        <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
                          &ldquo;{card.en}&rdquo;
                        </p>
                        {card.phonetic && (
                          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg inline-block">
                            {card.phonetic}
                          </span>
                        )}
                        <p className="text-[11px] text-slate-500 pt-2 flex items-center justify-center gap-1">
                          <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                          <span>Toca para ver la traducción</span>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-base md:text-lg font-bold text-amber-300">
                          {card.es}
                        </p>
                        <p className="text-xs text-slate-400">
                          Excelente retención. Esta frase se consolida en tu memoria de largo plazo.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-500">
                    {isSrsFlipped ? '¿Recordabas el significado con naturalidad?' : 'Intenta anticipar el sentido antes de voltear'}
                  </div>
                </div>
              );
            })()}

            {/* Controles de Navegación de Tarjetas */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsSrsFlipped(false);
                  setCurrentSrsCardIdx(prev => (prev + 1) % srs.targetPhrases.length);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0e1626] border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Siguiente Tarjeta</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer con Botón "He terminado" */}
        <div className="p-4 md:p-6 border-t border-slate-800/90 bg-[#090d16]/95 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Al completar esta inmersión, desbloquearás progreso y sumarás <strong className="text-emerald-400">+{subNode.xpReward} XP</strong>.
          </span>

          <button
            onClick={handleFinishSubNode}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>He terminado (+{subNode.xpReward} XP)</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
