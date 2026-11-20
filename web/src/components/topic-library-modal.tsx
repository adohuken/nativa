'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Headphones,
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  FileText,
  Radio,
  User,
  Plus,
  RefreshCw,
  Award,
  Zap,
  Info,
  Database,
  Globe,
  Sliders,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { karaokeTTS, KaraokeWordPosition } from '@/lib/karaoke-tts';
import {
  ExtraContentItem,
  ExtraContentType,
  getExtraContentForLesson
} from '@/lib/immersion-library';
import {
  GlobalStoriesService,
  GlobalStory,
  CEFRLevel,
  POPULAR_TOPICS
} from '@/lib/global-stories';
import { AppStorage } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';

interface TopicLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonCode: string;
  lessonTitle: string;
  level: string;
  onMinutesAdded?: (minutes: number) => void;
  onMissionUpdated?: () => void;
}

export function TopicLibraryModal({
  isOpen,
  onClose,
  lessonId,
  lessonCode,
  lessonTitle,
  level,
  onMinutesAdded,
  onMissionUpdated
}: TopicLibraryModalProps) {
  // Estado de contenidos
  const [libraryItems, setLibraryItems] = useState<ExtraContentItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Estados de IA Generativa & Selector de Tema/Nivel
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [chosenLevel, setChosenLevel] = useState<CEFRLevel>((level.toUpperCase() as CEFRLevel) || 'A1');
  const [chosenTopic, setChosenTopic] = useState<string>('Call Center');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ message: string; isCache: boolean } | null>(null);

  // Estados del reproductor de lectura/audio Karaoke
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.95);
  const [karaokeWord, setKaraokeWord] = useState<KaraokeWordPosition | null>(null);
  const [selectedWord, setSelectedWord] = useState<{ word: string; def: string } | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  // Inicializar y cargar catálogo base y Banco Global
  useEffect(() => {
    if (!isOpen) return;

    GlobalStoriesService.init();

    const baseItems = getExtraContentForLesson(lessonId, lessonCode, lessonTitle, level);
    const completed = AppStorage.getCompletedLibraryItemIds();

    // Obtener historias del Banco Global que coincidan con el nivel
    const globalStories = GlobalStoriesService.getAllStories().filter(s => s.status === 'approved');
    
    // Adaptar GlobalStories al formato ExtraContentItem
    const adaptedGlobalItems: ExtraContentItem[] = globalStories.map(s => ({
      id: s.id,
      lessonId: lessonId,
      lessonCode: lessonCode,
      level: s.level,
      type: 'story',
      title: s.title,
      subtitle: s.subtitle || `Historia comunitaria de ${s.topic} (${s.level})`,
      topic: s.topic,
      readingMinutes: s.reading_minutes,
      wordCount: s.word_count,
      timesRead: s.times_read,
      audioDurationText: `${s.reading_minutes}:00 min`,
      paragraphs: s.paragraphs,
      vocabulary: s.vocabulary || {},
      culturalInsight: s.cultural_insight,
      isAiGenerated: true,
      createdAt: s.created_at
    }));

    // Unir sin duplicados
    const combined = [...adaptedGlobalItems, ...baseItems.filter(b => !adaptedGlobalItems.some(g => g.id === b.id))];

    setLibraryItems(combined);
    setCompletedIds(completed);
    setChosenLevel((level.toUpperCase() as CEFRLevel) || 'A1');

    if (combined.length > 0 && !selectedItemId) {
      setSelectedItemId(combined[0].id);
      // Registrar lectura
      if (combined[0].id.startsWith('global-story-') || combined[0].id.startsWith('story-seed-')) {
        GlobalStoriesService.incrementTimesRead(combined[0].id);
      }
    }
  }, [isOpen, lessonId, lessonCode, lessonTitle, level]);

  // Limpiar síntesis de voz al cerrar
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  const selectedItem = useMemo(() => {
    return libraryItems.find(item => item.id === selectedItemId) || libraryItems[0] || null;
  }, [libraryItems, selectedItemId]);

  const filteredItems = useMemo(() => {
    if (filterType === 'ALL') return libraryItems;
    if (filterType === 'GLOBAL') return libraryItems.filter(i => i.isAiGenerated || i.timesRead !== undefined);
    if (filterType === 'AUDIO') return libraryItems.filter(i => i.type === 'podcast' || i.type === 'interview');
    if (filterType === 'READING') return libraryItems.filter(i => i.type === 'article' || i.type === 'story' || i.type === 'case_study');
    return libraryItems;
  }, [libraryItems, filterType]);

  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = audioSpeed;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleFullNarration = () => {
    if (!selectedItem) return;
    if (isPlayingAudio) {
      if (isAudioPaused) {
        karaokeTTS.resume();
        setIsAudioPaused(false);
        soundManager.playClick();
      } else {
        karaokeTTS.pause();
        setIsAudioPaused(true);
        soundManager.playClick();
      }
    } else {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
      soundManager.playClick();
      const userProfile = AppStorage.getUserProfile();
      karaokeTTS.play(selectedItem.paragraphs, {
        rate: audioSpeed,
        accent: userProfile?.accentPreference || 'uk',
        onWord: (pos) => setKaraokeWord(pos),
        onEnd: () => {
          setIsPlayingAudio(false);
          setIsAudioPaused(false);
          setKaraokeWord(null);
        }
      });
    }
  };

  const stopNarration = () => {
    karaokeTTS.stop();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setKaraokeWord(null);
    soundManager.playClick();
  };

  // =========================================================================
  // GENERAR O RECUPERAR DE LA BIBLIOTECA GLOBAL (CONTENT LAKE)
  // =========================================================================
  const handleRequestStoryFromLake = async (targetLevel: CEFRLevel, targetTopic: string) => {
    setIsGeneratingAi(true);
    setAiFeedback(null);
    soundManager.playClick();

    const topicToUse = customTopicInput.trim() || targetTopic;

    try {
      const result = await GlobalStoriesService.getOrGenerateStory(
        targetLevel,
        topicToUse,
        lessonTitle
      );

      const adaptedItem: ExtraContentItem = {
        id: result.story.id,
        lessonId: lessonId,
        lessonCode: lessonCode,
        level: result.story.level,
        type: 'story',
        title: result.story.title,
        subtitle: result.story.subtitle || `Historia de ${result.story.topic} (${result.story.level})`,
        topic: result.story.topic,
        readingMinutes: result.story.reading_minutes,
        wordCount: result.story.word_count,
        timesRead: result.story.times_read,
        audioDurationText: `${result.story.reading_minutes}:00 min`,
        paragraphs: result.story.paragraphs,
        vocabulary: result.story.vocabulary || {},
        culturalInsight: result.story.cultural_insight,
        isAiGenerated: true,
        createdAt: result.story.created_at
      };

      // Agregar a la lista de items y seleccionarlo
      setLibraryItems(prev => {
        const withoutOld = prev.filter(p => p.id !== adaptedItem.id);
        return [adaptedItem, ...withoutOld];
      });

      setSelectedItemId(adaptedItem.id);
      setIsGeneratingAi(false);
      setIsGeneratorModalOpen(false);

      if (result.isFromCache) {
        setAiFeedback({
          message: `✓ Historia encontrada en la Biblioteca Global Compartida (Leída por ${result.story.times_read} estudiantes • 0 tokens gastados).`,
          isCache: true
        });
      } else {
        setAiFeedback({
          message: `✨ Nueva historia generada con IA y guardada en el Content Lake para toda la comunidad.`,
          isCache: false
        });
      }

      soundManager.playSuccess();
    } catch (err) {
      console.error('Error fetching/generating story:', err);
      setIsGeneratingAi(false);
    }
  };

  // Marcar como leído / escuchado
  const handleMarkAsCompleted = (item: ExtraContentItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    const minutes = item.readingMinutes || 3;
    AppStorage.markLibraryItemCompleted(item.id);
    AppStorage.addImmersionMinutes(minutes);

    // Si es del banco global, incrementar veces leída
    if (item.id.startsWith('global-story-') || item.id.startsWith('story-seed-')) {
      const nextCount = GlobalStoriesService.incrementTimesRead(item.id);
      setLibraryItems(prev => prev.map(p => p.id === item.id ? { ...p, timesRead: nextCount } : p));
    }

    // Actualizar misión diaria: Leer artículo
    const missionRes = AppStorage.updateDailyMissionProgress('read_article', 1);

    setCompletedIds(prev => [...new Set([...prev, item.id])]);
    soundManager.playVictory();

    if (onMinutesAdded) {
      onMinutesAdded(minutes);
    }
    if (onMissionUpdated) {
      onMissionUpdated();
    }

    const bonusMsg = missionRes.bonusGranted ? ' ¡Y has desbloqueado el bonus diario de +50 XP!' : '';
    setCompletionNotice(`¡Excelente! Has sumado +${minutes} minutos de Input Comprensible y completado la misión diaria de lectura.${bonusMsg}`);
    setTimeout(() => setCompletionNotice(null), 6000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#04060a]/90 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-6xl my-auto rounded-3xl bg-[#0b101c] border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[92vh]"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

        {/* HEADER DE LA BIBLIOTECA GLOBAL */}
        <header className="px-5 py-4 border-b border-slate-800 bg-[#090d16]/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" /> Biblioteca Global • {lessonCode}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                  Nivel {level}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {libraryItems.length} Textos y Audios Compartidos
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Biblioteca del Tema: {lessonTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Botón Abrir Selector para Generar / Explorar Historia */}
            <button
              onClick={() => {
                setIsGeneratorModalOpen(true);
                soundManager.playClick();
              }}
              disabled={isGeneratingAi}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-purple-600/20 flex items-center gap-1.5 active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Elegir Nivel y Tema para buscar o generar historia con IA"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>Generar Nueva Historia</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
              title="Cerrar Biblioteca (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* FEEDBACK DE BANCO GLOBAL / CACHÉ O COMPLETACIÓN */}
        {aiFeedback && (
          <div className={`px-5 py-2.5 border-b text-xs flex items-center gap-2 animate-in fade-in ${
            aiFeedback.isCache
              ? 'bg-teal-950/80 border-teal-500/40 text-teal-200'
              : 'bg-purple-950/80 border-purple-500/40 text-purple-200'
          }`}>
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{aiFeedback.message}</span>
          </div>
        )}

        {completionNotice && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{completionNotice}</span>
          </div>
        )}

        {/* CUERPO PRINCIPAL: 2 COLUMNAS (LISTA DE CONTENIDOS + LECTOR) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* COLUMNA IZQUIERDA: ÍNDICE DE CONTENIDOS COMPARTIDOS */}
          <aside className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 bg-[#080d16] flex flex-col shrink-0">
            {/* Filtros de Tipo */}
            <div className="p-3 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  filterType === 'ALL'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                Todos ({libraryItems.length})
              </button>
              <button
                onClick={() => setFilterType('GLOBAL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  filterType === 'GLOBAL'
                    ? 'bg-teal-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                🌐 Banco Global
              </button>
              <button
                onClick={() => setFilterType('READING')}
                className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  filterType === 'READING'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                Lecturas
              </button>
              <button
                onClick={() => setFilterType('AUDIO')}
                className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  filterType === 'AUDIO'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                Podcasts
              </button>
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedItemId;
                const isDone = completedIds.includes(item.id);
                const reads = item.timesRead || (item.isAiGenerated ? 142 : 89);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isPlayingAudio) {
                        window.speechSynthesis.cancel();
                        setIsPlayingAudio(false);
                      }
                      setSelectedItemId(item.id);
                      if (item.id.startsWith('global-story-') || item.id.startsWith('story-seed-')) {
                        GlobalStoriesService.incrementTimesRead(item.id);
                      }
                      soundManager.playClick();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition relative flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f172a] border-emerald-500/70 shadow-lg shadow-emerald-500/10'
                        : 'bg-[#0b101c] border-slate-800/80 hover:border-slate-700 hover:bg-[#0e1526]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                          item.type === 'podcast' || item.type === 'interview'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                            : item.isAiGenerated
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.type === 'podcast' ? <Headphones className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          {item.topic ? item.topic : item.type}
                        </span>
                        <span className="text-[9px] font-mono text-teal-400 bg-teal-950/60 border border-teal-500/30 px-1.5 py-0.2 rounded">
                          {item.level}
                        </span>
                      </div>

                      {isDone ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3 stroke-[3]" /> Leído
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          ~{item.readingMinutes} min
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      <span className="text-teal-300 flex items-center gap-1 font-bold">
                        📖 {reads} lectores
                      </span>
                      <span className="text-emerald-400">+{item.readingMinutes} min input</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* COLUMNA DERECHA: LECTOR INMERSIVO */}
          <main className="flex-1 flex flex-col bg-[#0b101c] overflow-y-auto">
            {selectedItem ? (
              <div className="p-5 md:p-8 space-y-6 max-w-3xl mx-auto w-full">
                
                {/* Meta de Lectura / Reproductor de Audio */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#080d16] border border-slate-800">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      ~{selectedItem.readingMinutes} min de inmersión
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                      {selectedItem.wordCount} palabras
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-950/70 border border-teal-500/40 text-teal-300 font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Biblioteca Global
                    </span>
                  </div>

                  {/* Controles de Reproducción de Voz Karaoke */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleFullNarration}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        isPlayingAudio && !isAudioPaused
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                          : isAudioPaused
                          ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                          : 'bg-[#0e1626] border-slate-700 text-slate-200 hover:border-emerald-500/40 hover:text-emerald-300'
                      }`}
                    >
                      {isPlayingAudio && !isAudioPaused ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pausar</span>
                        </>
                      ) : isAudioPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Reanudar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                          <span>Escuchar (Play)</span>
                        </>
                      )}
                    </button>

                    {isPlayingAudio && (
                      <button
                        onClick={stopNarration}
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Detener Audio"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}

                    {/* Selector de Velocidad */}
                    <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-[10px] font-mono">
                      {[0.8, 0.95, 1.2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => {
                            setAudioSpeed(speed);
                            if (isPlayingAudio) stopNarration();
                          }}
                          className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                            audioSpeed === speed 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cabecera del Artículo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <span className="font-bold">TEMA: {selectedItem.topic?.toUpperCase() || selectedItem.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>NIVEL {selectedItem.level}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedItem.title}
                  </h1>
                  <p className="text-sm text-slate-300">
                    {selectedItem.subtitle}
                  </p>
                  
                  {/* CONTADOR DE ESTUDIANTES (GLOBAL STORIES BANK) */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-950/50 border border-teal-500/40 text-xs font-mono text-teal-300 font-bold">
                    <span>📖 Leído por {selectedItem.timesRead || 142} estudiantes en la comunidad</span>
                    <span className="text-[10px] text-teal-400 bg-teal-900/60 px-1.5 py-0.5 rounded">Reutilizado sin tokens</span>
                  </div>
                </div>

                {/* Aviso interactivo de glosario */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-teal-300 bg-teal-950/40 border border-teal-500/30 px-3 py-1.5 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Haz clic en cualquier palabra para escuchar su fonética nativa y ver su significado.</span>
                </div>

                {/* PÁRRAFOS DEL TEXTO CON CLICK-TO-DEFINE Y KARAOKE */}
                <div className="space-y-4 font-sans leading-relaxed text-base md:text-lg text-slate-200 selection:bg-emerald-500/30">
                  {selectedItem.paragraphs.map((paragraph, pIdx) => {
                    const words = paragraph.split(/\s+/).filter(Boolean);
                    return (
                      <p key={pIdx} className="p-4 rounded-2xl bg-[#090d16]/70 border border-slate-800/40 hover:border-slate-700/60 transition">
                        {words.map((w, wIdx) => {
                          const clean = w.replace(/[^a-zA-Z0-9']/g, '').toLowerCase();
                          const isVocab = selectedItem.vocabulary && Object.keys(selectedItem.vocabulary).some(k => {
                            const cleanK = k.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
                            const parts = cleanK.split(/\s+/).filter(Boolean);
                            return k.toLowerCase() === clean || parts.includes(clean);
                          });

                          const isKaraokeActive = isPlayingAudio && karaokeWord?.paragraphIndex === pIdx && karaokeWord?.wordIndex === wIdx;

                          return (
                            <span
                              key={wIdx}
                              onClick={() => {
                                const def = selectedItem.vocabulary?.[clean] || `Término en contexto: "${clean}". Exposición comprensible i+1.`;
                                setSelectedWord({ word: clean, def });
                                speakText(clean);
                              }}
                              className={`cursor-pointer transition-all duration-150 inline-block px-1 py-0.5 rounded ${
                                isKaraokeActive
                                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black shadow-lg shadow-emerald-500/50 scale-110 ring-2 ring-emerald-300 z-10'
                                  : isVocab
                                  ? 'text-teal-300 font-semibold underline decoration-teal-500/50 decoration-2 underline-offset-4 hover:bg-teal-950/60 hover:text-white'
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

                {/* Glosario de Vocabulario Adquirido */}
                {selectedItem.vocabulary && Object.keys(selectedItem.vocabulary).length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#080c14] border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Vocabulario y Colocaciones del Texto:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedItem.vocabulary).map(([term, def], idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedWord({ word: term, def });
                            speakText(term);
                          }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-[#0e1626] border border-slate-800 text-slate-300 hover:border-teal-500/50 hover:text-teal-300 transition flex items-center gap-1.5"
                        >
                          <strong className="capitalize">{term}:</strong>
                          <span className="text-slate-400 text-[11px]">{def}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cápsula Cultural o Pragmática */}
                {selectedItem.culturalInsight && (
                  <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-xs text-slate-300 space-y-1">
                    <strong className="text-teal-300 font-mono text-[10px] uppercase tracking-wider block">
                      💡 Insight Pragmático & Cultural:
                    </strong>
                    <p className="leading-relaxed">{selectedItem.culturalInsight}</p>
                  </div>
                )}

                {/* BOTÓN FINAL DE COMPLETACIÓN (SUMAR MINUTOS Y COMPLETAR MISIÓN) */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
                  <div className="text-xs text-slate-400 text-center sm:text-left">
                    {completedIds.includes(selectedItem.id) ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Ya has registrado esta lectura en tu contador de Input.
                      </span>
                    ) : (
                      <span>
                        Al terminar, sumarás <strong className="text-emerald-400">+{selectedItem.readingMinutes} minutos</strong> de input comprensible y avanzarás tu misión diaria.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleMarkAsCompleted(selectedItem)}
                      disabled={completedIds.includes(selectedItem.id)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                        completedIds.includes(selectedItem.id)
                          ? 'bg-slate-800 border border-slate-700 text-slate-400 cursor-default'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>
                        {completedIds.includes(selectedItem.id)
                          ? 'Leído / Escuchado'
                          : `Marcar como Leído / Escuchado (+${selectedItem.readingMinutes} min)`}
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                Selecciona un texto o audio de la lista izquierda
              </div>
            )}
          </main>
        </div>

        {/* MODAL / SELECTOR PARA PEDIR HISTORIA (ELEGIR NIVEL Y TEMA) */}
        <AnimatePresence>
          {isGeneratorModalOpen && (
            <div className="absolute inset-0 z-50 bg-[#04060a]/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="w-full max-w-lg rounded-3xl bg-[#090d16] border border-slate-700 shadow-2xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Generar o Buscar Historia</h3>
                      <p className="text-xs text-slate-400">Banco Global Compartido • Content Lake</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsGeneratorModalOpen(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#0e1626] p-3 rounded-2xl border border-slate-800">
                  El sistema busca primero en el <strong>Banco Global</strong>. Si ya existe una historia aprobada sobre este nivel y tema, se devolverá aleatoriamente ahorrando tokens. Si no existe, la IA la generará y la sumará al banco común.
                </p>

                {/* Selector de Nivel */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    1. Nivel de Complejidad (MCER):
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setChosenLevel(lvl)}
                        className={`py-2 rounded-xl text-xs font-mono font-black border transition ${
                          chosenLevel === lvl
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector de Tema */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    2. Tema o Industria:
                  </label>
                  <select
                    value={chosenTopic}
                    onChange={(e) => setChosenTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    {POPULAR_TOPICS.map((top) => (
                      <option key={top} value={top}>{top}</option>
                    ))}
                  </select>
                </div>

                {/* O Tema Personalizado Opcional */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    O escribe un tema personalizado (opcional):
                  </label>
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="Ej: Renewable Energy, Hospital Triage, Job Interview..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                  />
                </div>

                {/* Acciones */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGeneratorModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={isGeneratingAi}
                    onClick={() => handleRequestStoryFromLake(chosenLevel, chosenTopic)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? 'Buscando / Generando...' : 'Obtener Historia'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
