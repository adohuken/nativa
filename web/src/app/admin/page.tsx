'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Globe,
  Bot,
  Plus,
  Save,
  Check,
  ArrowLeft,
  Sparkles,
  Layers,
  Clock,
  Users,
  GraduationCap,
  FileText,
  Headphones,
  Brain,
  Settings,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Search,
  Filter,
  Volume2,
  FolderTree,
  ChevronRight,
  Database,
  RotateCcw,
  Sparkle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { FluentiaLogo, NativaLogo } from '@/components/fluentia-logo';
import { APP_NAME } from '@/lib/config';
import {
  COURSE_CONTENT,
  LANGUAGES_REGISTRY,
  LanguageHubEntry,
  SubNode,
  LessonContent,
  CourseContent,
  getAllLanguages
} from '@/content/course-content';
import { AppStorage } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import {
  LEVELS_CONFIG,
  getCourseContentForLanguage,
  saveLessonInLanguage,
  createGenericCourseForLanguage
} from '@/lib/multi-language-courses';

type AdminTab = 'OVERVIEW' | 'CONTENT' | 'LANGUAGES' | 'AI_TOOLS';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('CONTENT');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // =========================================================================
  // GESTIÓN DE IDIOMAS (LANGUAGE MANAGER STATE)
  // =========================================================================
  const [languages, setLanguages] = useState<Record<string, LanguageHubEntry>>(LANGUAGES_REGISTRY);
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangNative, setNewLangNative] = useState('');
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🇵🇹');
  const [newLangTagline, setNewLangTagline] = useState('');

  // =========================================================================
  // GESTIÓN DE CONTENIDO (CONTENT MANAGER STATE)
  // =========================================================================
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('english');
  const [selectedLevel, setSelectedLevel] = useState<string>('A1');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('a1-lesson-1');
  const [activeSubNodeTab, setActiveSubNodeTab] = useState<'reading' | 'listening' | 'meta'>('reading');

  // Copia en memoria del curso del idioma activo
  const [activeCourse, setActiveCourse] = useState<CourseContent>(() => getCourseContentForLanguage('english'));

  // Campos del formulario
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeSubtitle, setNodeSubtitle] = useState('');
  const [nodeScenario, setNodeScenario] = useState('');

  // Formulario Reading
  const [readingTitle, setReadingTitle] = useState('');
  const [readingMinutes, setReadingMinutes] = useState(2);
  const [readingText, setReadingText] = useState('');
  const [srsVocabString, setSrsVocabString] = useState('');

  // Formulario Listening
  const [listeningTitle, setListeningTitle] = useState('');
  const [listeningDuration, setListeningDuration] = useState('1:15 min');
  const [listeningAudioUrl, setListeningAudioUrl] = useState('');
  const [listeningScriptEn, setListeningScriptEn] = useState('');
  const [listeningScriptEs, setListeningScriptEs] = useState('');
  const [culturalCapsule, setCulturalCapsule] = useState('');

  // =========================================================================
  // HERRAMIENTAS DE IA (AI GENERATOR STATE)
  // =========================================================================
  const [aiTargetLanguage, setAiTargetLanguage] = useState<string>('english');
  const [aiTargetLevel, setAiTargetLevel] = useState<string>('A1');
  const [aiTargetLessonId, setAiTargetLessonId] = useState<string>('a1-lesson-1');
  const [aiPrompt, setAiPrompt] = useState('Crea una lectura de inmersión sobre el primer día de clases en la universidad y pedir café.');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedPreview, setAiGeneratedPreview] = useState<string | null>(null);

  // =========================================================================
  // CARGA INICIAL DE DATOS
  // =========================================================================
  useEffect(() => {
    const allLangs = getAllLanguages();
    setLanguages(allLangs);

    const initialCourse = getCourseContentForLanguage(selectedLanguageId);
    setActiveCourse(initialCourse);
  }, []);

  // =========================================================================
  // CARGAR CURSO CUANDO CAMBIA EL IDIOMA SELECCIONADO
  // =========================================================================
  useEffect(() => {
    const course = getCourseContentForLanguage(selectedLanguageId);
    setActiveCourse(course);

    // Ajustar lección por defecto según el nivel
    const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
    const mod = course.modules[lvlConfig.moduleId];
    const availableLessonIds = mod && mod.lessons ? Object.keys(mod.lessons) : [];

    if (availableLessonIds.length > 0 && !availableLessonIds.includes(selectedLessonId)) {
      setSelectedLessonId(availableLessonIds[0]);
    }
  }, [selectedLanguageId]);

  // =========================================================================
  // AJUSTAR LECCIÓN AL CAMBIAR DE NIVEL MCER (A1 a C2)
  // =========================================================================
  useEffect(() => {
    const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
    const mod = activeCourse.modules[lvlConfig.moduleId];
    const availableLessonIds = mod && mod.lessons ? Object.keys(mod.lessons) : [];

    const defaultLessonId = availableLessonIds[0] || `${selectedLevel.toLowerCase()}-lesson-1`;
    setSelectedLessonId(defaultLessonId);
  }, [selectedLevel]);

  // =========================================================================
  // POBLAR EL FORMULARIO CUANDO CAMBIA LA LECCIÓN SELECCIONADA
  // =========================================================================
  useEffect(() => {
    const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
    const mod = activeCourse.modules[lvlConfig.moduleId];
    const lesson = mod?.lessons?.[selectedLessonId];

    if (lesson) {
      setNodeTitle(lesson.title || '');
      setNodeSubtitle(`Objetivo comunicativo para ${lesson.title}`);
      setNodeScenario(`Escenario de inmersión en ${selectedLanguageId.toUpperCase()}`);

      // SubNodo Reading
      const rSub = lesson.subNodes?.find(s => s.type === 'reading')?.content?.reading;
      if (rSub) {
        setReadingTitle(rSub.title || '');
        setReadingMinutes(rSub.readingMinutes || 2);
        setReadingText(rSub.paragraphs?.join('\n\n') || '');
        if (rSub.vocabulary) {
          const vocabLines = Object.entries(rSub.vocabulary)
            .map(([word, def]) => `${word}: ${def}`)
            .join('\n');
          setSrsVocabString(vocabLines);
        } else {
          setSrsVocabString('');
        }
      } else {
        setReadingTitle(`Lectura de Inmersión • ${lesson.lessonCode}`);
        setReadingMinutes(2);
        setReadingText('');
        setSrsVocabString('');
      }

      // SubNodo Listening
      const lSub = lesson.subNodes?.find(s => s.type === 'listening')?.content?.listening;
      if (lSub) {
        setListeningTitle(lSub.title || '');
        setListeningDuration(lSub.audioDurationText || '1:15 min');
        setListeningAudioUrl(`https://storage.nativa.io/audio/${selectedLanguageId}/${selectedLessonId}.mp3`);
        setListeningScriptEn(lSub.audioScriptEn || '');
        setListeningScriptEs(lSub.audioScriptEs || '');
        setCulturalCapsule(lSub.culturalInsight || '');
      } else {
        setListeningTitle(`Audio Receptivo • ${lesson.lessonCode}`);
        setListeningDuration('1:15 min');
        setListeningAudioUrl(`https://storage.nativa.io/audio/${selectedLanguageId}/${selectedLessonId}.mp3`);
        setListeningScriptEn('');
        setListeningScriptEs('');
        setCulturalCapsule('');
      }
    }
  }, [selectedLessonId, activeCourse, selectedLevel, selectedLanguageId]);

  // Lista de Nodos Madre del Nivel actual
  const currentLevelLessons = useMemo(() => {
    const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
    const mod = activeCourse.modules[lvlConfig.moduleId];

    if (mod && mod.lessons) {
      return Object.values(mod.lessons).map(l => ({
        id: l.lessonId,
        code: l.lessonCode,
        title: l.title,
        xp: 35
      }));
    }

    // Fallback de 4 lecciones estándar
    const prefix = selectedLevel.toLowerCase();
    const unit = lvlConfig.unitNumber;
    return [
      { id: `${prefix}-lesson-1`, code: `${unit}.1`, title: `Nodo ${unit}.1 (${selectedLanguageId.toUpperCase()})`, xp: 35 },
      { id: `${prefix}-lesson-2`, code: `${unit}.2`, title: `Nodo ${unit}.2 (${selectedLanguageId.toUpperCase()})`, xp: 35 },
      { id: `${prefix}-lesson-3`, code: `${unit}.3`, title: `Nodo ${unit}.3 (${selectedLanguageId.toUpperCase()})`, xp: 35 },
      { id: `${prefix}-lesson-4`, code: `${unit}.4`, title: `Nodo ${unit}.4 (${selectedLanguageId.toUpperCase()})`, xp: 35 },
    ];
  }, [activeCourse, selectedLevel, selectedLanguageId]);

  // =========================================================================
  // GUARDAR CAMBIOS DEL FORMULARIO
  // =========================================================================
  const handleSaveContentChanges = () => {
    soundManager.playSuccess();

    // Procesar Glosario SRS
    const vocabObject: Record<string, string> = {};
    srsVocabString.split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const word = line.substring(0, idx).trim().toLowerCase();
        const def = line.substring(idx + 1).trim();
        if (word && def) {
          vocabObject[word] = def;
        }
      }
    });

    const paragraphs = readingText.split('\n\n').filter(p => p.trim().length > 0);

    const updatedCourse = saveLessonInLanguage(
      selectedLanguageId,
      selectedLevel,
      selectedLessonId,
      {
        title: nodeTitle || 'Lección de Inmersión',
        subtitle: nodeSubtitle,
        scenario: nodeScenario,
        reading: {
          title: readingTitle,
          minutes: readingMinutes,
          paragraphs: paragraphs.length > 0 ? paragraphs : [readingText],
          vocabulary: vocabObject
        },
        listening: {
          title: listeningTitle,
          durationText: listeningDuration,
          audioUrl: listeningAudioUrl,
          scriptEn: listeningScriptEn,
          scriptEs: listeningScriptEs,
          culturalInsight: culturalCapsule
        }
      }
    );

    setActiveCourse(updatedCourse);

    const langName = languages[selectedLanguageId]?.name || selectedLanguageId.toUpperCase();
    setSaveSuccessNotice(`✓ Cambios guardados en ${selectedLessonId.toUpperCase()} (${langName})`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // =========================================================================
  // CREAR UN NUEVO IDIOMA
  // =========================================================================
  const handleCreateLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName || !newLangCode) return;

    const langId = newLangCode.toLowerCase().trim();

    const newLangEntry: LanguageHubEntry = {
      id: langId,
      name: newLangName.trim(),
      nativeName: newLangNative.trim() || newLangName.trim(),
      flag: newLangFlag.trim() || '🌐',
      tagline: newLangTagline.trim() || `Curso Universitario de ${newLangName}`,
      description: `Estructura curricular completa de 6 niveles (A1 a C2) basada en la hipótesis del Input Comprensible i+1.`,
      levelsCount: 6,
      lessonsCount: 24,
      status: 'active',
      colorGradient: 'from-teal-500 to-emerald-400',
      badgeText: 'Activo • 24 Nodos'
    };

    const updatedRegistry = {
      ...languages,
      [langId]: newLangEntry
    };

    setLanguages(updatedRegistry);
    AppStorage.saveCustomLanguages(updatedRegistry);

    // Generar la estructura de 24 nodos A1 a C2
    const newCourse = createGenericCourseForLanguage(langId, newLangName);
    AppStorage.saveCustomCourseContent(newCourse, langId);

    setIsAddLanguageModalOpen(false);
    soundManager.playVictory();

    // Seleccionar de inmediato el nuevo idioma en el editor
    setSelectedLanguageId(langId);
    setSelectedLevel('A1');
    setSelectedLessonId('a1-lesson-1');
    setActiveCourse(newCourse);

    setSaveSuccessNotice(`✓ Idioma "${newLangName}" creado con sus 24 Nodos (A1-C2).`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);

    // Limpiar formulario
    setNewLangName('');
    setNewLangNative('');
    setNewLangCode('');
    setNewLangTagline('');
  };

  // =========================================================================
  // CAMBIAR ESTADO DE UN IDIOMA (Activo <-> Próximamente)
  // =========================================================================
  const handleToggleLanguageStatus = (langId: string) => {
    const current = languages[langId];
    if (!current) return;

    const nextStatus = current.status === 'active' ? 'coming_soon' : 'active';
    const updated = {
      ...languages,
      [langId]: {
        ...current,
        status: nextStatus as 'active' | 'coming_soon',
        badgeText: nextStatus === 'active' ? 'Activo • 24 Nodos' : 'Próximamente • En Desarrollo'
      }
    };

    setLanguages(updated);
    AppStorage.saveCustomLanguages(updated);
    soundManager.playClick();
  };

  // =========================================================================
  // GENERAR CONTENIDO CON IA
  // =========================================================================
  const handleGenerateAiContent = () => {
    setIsAiGenerating(true);
    setAiGeneratedPreview(null);

    const langName = languages[aiTargetLanguage]?.name || aiTargetLanguage;

    setTimeout(() => {
      let generated = '';
      if (aiTargetLanguage === 'french') {
        generated = `Tous les matins à huit heures, les étudiants marchent d'un pas enthousiaste vers le campus universitaire.\n\nDavid sourit et demande poliment: "Pourrais-je avoir un café au lait et un croissant chaud, s'il vous plaît?" Le serveur répond: "Certainement! À consommer sur place ou à emporter?"\n\nIl paie avec sa carte étudiante et s'installe dans la cour ensoleillée pour préparer son cours.`;
      } else if (aiTargetLanguage === 'german') {
        generated = `Jeden Morgen um acht Uhr gehen die Studenten gut gelaunt zum Universitätscampus.\n\nDavid lächelt und fragt freundlich: "Könnte ich bitte einen Kaffee und ein Croissant haben?" Der Verkäufer antwortet: "Gerne! Zum Hieressen oder zum Mitnehmen?"\n\nEr bezahlt mit seiner Karte und setzt sich in den sonnigen Innenhof.`;
      } else {
        generated = `Every morning at eight o'clock, students walk happily to the university campus cafeteria.\n\nDavid smiles and asks politely: "Could I have a flat white and a warm croissant, please?" The server answers: "Certainly! Would you like to eat in or take away?"\n\nHe pays five pounds with his student card and sits in the sunny courtyard to review his notes.`;
      }

      setAiGeneratedPreview(generated);
      setIsAiGenerating(false);
      soundManager.playSuccess();
    }, 900);
  };

  // Inyectar en el editor de contenido
  const handleInjectAiToEditor = () => {
    if (!aiGeneratedPreview) return;

    setSelectedLanguageId(aiTargetLanguage);
    setSelectedLevel(aiTargetLevel);
    setSelectedLessonId(aiTargetLessonId);

    setReadingText(aiGeneratedPreview);
    setReadingMinutes(2);
    setActiveTab('CONTENT');
    setActiveSubNodeTab('reading');
    soundManager.playClick();

    setSaveSuccessNotice(`✓ Texto de IA inyectado en ${aiTargetLessonId.toUpperCase()} (${aiTargetLanguage.toUpperCase()})`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500/30 selection:text-emerald-300">

      {/* =====================================================================
          SIDEBAR DEL cPANEL ADMIN
      ===================================================================== */}
      <aside className="w-full md:w-64 bg-[#070b14] border-r border-slate-800/90 flex flex-col shrink-0 p-5 space-y-6">

        {/* Header del cPanel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FluentiaLogo size="sm" />
            <div>
              <span className="text-xs font-black text-white tracking-wider block">cPanel Admin</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold block">v2.4 Control Center</span>
            </div>
          </div>
        </div>

        {/* Módulos de Navegación del Panel */}
        <nav className="space-y-1.5 flex-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-3 block mb-2">
            Módulos de Gestión
          </span>

          <button
            onClick={() => { setActiveTab('OVERVIEW'); soundManager.playClick(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'OVERVIEW'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Estadísticas Globales</span>
          </button>

          <button
            onClick={() => { setActiveTab('CONTENT'); soundManager.playClick(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'CONTENT'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Gestión de Contenido</span>
          </button>

          <button
            onClick={() => { setActiveTab('LANGUAGES'); soundManager.playClick(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'LANGUAGES'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Gestión de Idiomas</span>
          </button>

          <button
            onClick={() => { setActiveTab('AI_TOOLS'); soundManager.playClick(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'AI_TOOLS'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Generador de IA (SLA)</span>
          </button>
        </nav>

        {/* Enlaces Inferiores del Sidebar */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0b101c] border border-slate-800 text-[11px] font-mono text-slate-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Base de Datos: Sincronizada</span>
          </div>

          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ir a la Plataforma</span>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
        </div>

      </aside>

      {/* =====================================================================
          CONTENIDO PRINCIPAL DEL PANEL (TAB ROUTER)
      ===================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Top Notification Bar */}
        {saveSuccessNotice && (
          <div className="bg-emerald-950 border-b border-emerald-500/50 px-6 py-2.5 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* ===================================================================
            1. PESTAÑA: GESTIÓN DE CONTENIDO (CONTENT MANAGER)
        =================================================================== */}
        {activeTab === 'CONTENT' && (
          <div className="p-6 md:p-8 space-y-6">

            {/* Cabecera con Selectores de Idioma y Nivel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                  Content Management System
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Editor de Nodos y Lecciones
                </h1>
              </div>

              {/* Selectores */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block font-bold">Idioma:</label>
                  <select
                    value={selectedLanguageId}
                    onChange={(e) => {
                      setSelectedLanguageId(e.target.value);
                      soundManager.playClick();
                    }}
                    className="bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-teal-500"
                  >
                    {Object.values(languages).map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block font-bold">Nivel MCER:</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      soundManager.playClick();
                    }}
                    className="bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="A1">A1 • Elemental</option>
                    <option value="A2">A2 • Básico</option>
                    <option value="B1">B1 • Intermedio</option>
                    <option value="B2">B2 • Avanzado</option>
                    <option value="C1">C1 • Profesional</option>
                    <option value="C2">C2 • Maestría</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveContentChanges}
                  className="self-end px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>

            {/* Layout de 2 Columnas: Lista de Nodos a la Izquierda, Formulario a la Derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Columna Izquierda: Árbol de Nodos Madre (4 columnas) */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block px-1">
                  Nodos Madre • Unidad {LEVELS_CONFIG[selectedLevel]?.unitNumber || 1} ({selectedLevel})
                </span>

                <div className="space-y-2">
                  {currentLevelLessons.map((item) => {
                    const isSelected = selectedLessonId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedLessonId(item.id); soundManager.playClick(); }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${isSelected
                          ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/40 shadow-md'
                          : 'bg-[#090d16] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-teal-400 font-bold block">
                            Nodo {item.code} • +{item.xp} XP
                          </span>
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Columna Derecha: Formulario de Edición Estructurado (8 columnas) */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl space-y-5">

                {/* Selector de Pestañas del Sub-Nodo */}
                <div className="flex border-b border-slate-800 pb-3 gap-2">
                  <button
                    onClick={() => setActiveSubNodeTab('reading')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeSubNodeTab === 'reading'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Sub-Nodo Reading</span>
                  </button>

                  <button
                    onClick={() => setActiveSubNodeTab('listening')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeSubNodeTab === 'listening'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Sub-Nodo Listening</span>
                  </button>

                  <button
                    onClick={() => setActiveSubNodeTab('meta')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeSubNodeTab === 'meta'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Metadatos del Nodo</span>
                  </button>
                </div>

                {/* CONTENIDO DE PESTAÑA: READING */}
                {activeSubNodeTab === 'reading' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 font-bold block">
                          Título de la Lectura de Inmersión:
                        </label>
                        <input
                          type="text"
                          value={readingTitle}
                          onChange={(e) => setReadingTitle(e.target.value)}
                          className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 font-bold block">
                          Minutos Estimados:
                        </label>
                        <input
                          type="number"
                          value={readingMinutes}
                          onChange={(e) => setReadingMinutes(parseInt(e.target.value) || 2)}
                          className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Rich Text Area para Texto de Lectura */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono text-slate-400 font-bold block">
                          Texto del Sub-Nodo (Párrafos separados por doble salto de línea):
                        </label>
                        <span className="text-[10px] font-mono text-teal-400">
                          {readingText.trim() ? readingText.trim().split(/\s+/).length : 0} palabras
                        </span>
                      </div>
                      <textarea
                        rows={7}
                        value={readingText}
                        onChange={(e) => setReadingText(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-teal-500"
                        placeholder="Pega aquí el texto graduado de lectura..."
                      />
                    </div>

                    {/* Palabras del Glosario SRS (Clave: Valor) */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        Glosario Interactivo SRS (Formato: palabra: significado en español):
                      </label>
                      <textarea
                        rows={4}
                        value={srsVocabString}
                        onChange={(e) => setSrsVocabString(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-2xl p-3 text-xs text-teal-300 font-mono leading-relaxed focus:outline-none focus:border-teal-500"
                        placeholder="ejemplo: palabra: significado"
                      />
                    </div>
                  </div>
                )}

                {/* CONTENIDO DE PESTAÑA: LISTENING */}
                {activeSubNodeTab === 'listening' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 font-bold block">
                          Título del Audio de Escucha:
                        </label>
                        <input
                          type="text"
                          value={listeningTitle}
                          onChange={(e) => setListeningTitle(e.target.value)}
                          className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 font-bold block">
                          Duración del Audio:
                        </label>
                        <input
                          type="text"
                          value={listeningDuration}
                          onChange={(e) => setListeningDuration(e.target.value)}
                          className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* URL o Input de Audio */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        URL o Ubicación del Audio Nativo:
                      </label>
                      <input
                        type="text"
                        value={listeningAudioUrl}
                        onChange={(e) => setListeningAudioUrl(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Transcripción Idioma Meta */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        Guión de Escucha Completo ({languages[selectedLanguageId]?.name || 'Idioma Meta'}):
                      </label>
                      <textarea
                        rows={4}
                        value={listeningScriptEn}
                        onChange={(e) => setListeningScriptEn(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Transcripción Español */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        Traducción Contextual (Español):
                      </label>
                      <textarea
                        rows={3}
                        value={listeningScriptEs}
                        onChange={(e) => setListeningScriptEs(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-2xl p-3 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Cápsula Cultural */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-cyan-300 font-bold block">
                        Cápsula Cultural / Pragmática SLA:
                      </label>
                      <textarea
                        rows={2}
                        value={culturalCapsule}
                        onChange={(e) => setCulturalCapsule(e.target.value)}
                        className="w-full bg-[#0b101c] border border-cyan-500/40 rounded-2xl p-3 text-xs text-cyan-200 leading-relaxed focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {/* CONTENIDO DE PESTAÑA: METADATOS */}
                {activeSubNodeTab === 'meta' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        Título del Nodo Madre (Lección Principal):
                      </label>
                      <input
                        type="text"
                        value={nodeTitle}
                        onChange={(e) => setNodeTitle(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        Subtítulo / Objetivo Comunicativo:
                      </label>
                      <input
                        type="text"
                        value={nodeSubtitle}
                        onChange={(e) => setNodeSubtitle(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 font-bold block">
                        Escenario Real / Pragmático:
                      </label>
                      <input
                        type="text"
                        value={nodeScenario}
                        onChange={(e) => setNodeScenario(e.target.value)}
                        className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* Botón Inferior de Guardar */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={handleSaveContentChanges}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios del Nodo</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================================
            2. PESTAÑA: GESTIÓN DE IDIOMAS (LANGUAGE MANAGER)
        =================================================================== */}
        {activeTab === 'LANGUAGES' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  Language Manager
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Idiomas de la Plataforma
                </h1>
              </div>

              <button
                onClick={() => setIsAddLanguageModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Nuevo Idioma</span>
              </button>
            </div>

            {/* Tabla de Idiomas */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#090d16]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b101c] border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Idioma</th>
                    <th className="p-4">Código ISO</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Niveles</th>
                    <th className="p-4">Nodos Madre</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {Object.values(languages).map((lang) => (
                    <tr key={lang.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <strong className="text-white block">{lang.name}</strong>
                          <span className="text-[11px] text-slate-400">{lang.nativeName}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono uppercase text-teal-400">{lang.id}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleLanguageStatus(lang.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 transition ${lang.status === 'active'
                            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          title="Haz clic para activar/desactivar este idioma"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${lang.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          {lang.status === 'active' ? 'Activo' : 'Próximamente'}
                        </button>
                      </td>
                      <td className="p-4 font-mono">{lang.levelsCount || 6} (A1 - C2)</td>
                      <td className="p-4 font-mono">{lang.lessonsCount || 24}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedLanguageId(lang.id);
                            setActiveTab('CONTENT');
                            soundManager.playClick();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition font-bold"
                        >
                          Editar Contenido
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            3. PESTAÑA: GENERADOR DE IA (AI TOOLS)
        =================================================================== */}
        {activeTab === 'AI_TOOLS' && (
          <div className="p-6 md:p-8 space-y-6 max-w-4xl">
            <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                Artificial Intelligence • Krashen SLA Engine
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Generador de Input Comprensible (i+1)
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Genera lecturas y diálogos contextualizados basados en la hipótesis del Input Comprensible y el Filtro Afectivo Zen, con inyección directa en el nodo seleccionado.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block font-bold">Idioma Destino:</label>
                  <select
                    value={aiTargetLanguage}
                    onChange={(e) => setAiTargetLanguage(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    {Object.values(languages).map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block font-bold">Nivel MCER:</label>
                  <select
                    value={aiTargetLevel}
                    onChange={(e) => setAiTargetLevel(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="A1">A1 • Elemental</option>
                    <option value="A2">A2 • Básico</option>
                    <option value="B1">B1 • Intermedio</option>
                    <option value="B2">B2 • Avanzado</option>
                    <option value="C1">C1 • Profesional</option>
                    <option value="C2">C2 • Maestría</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block font-bold">Nodo Destino:</label>
                  <select
                    value={aiTargetLessonId}
                    onChange={(e) => setAiTargetLessonId(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={`${aiTargetLevel.toLowerCase()}-lesson-1`}>Lección 1 del Nivel</option>
                    <option value={`${aiTargetLevel.toLowerCase()}-lesson-2`}>Lección 2 del Nivel</option>
                    <option value={`${aiTargetLevel.toLowerCase()}-lesson-3`}>Lección 3 del Nivel</option>
                    <option value={`${aiTargetLevel.toLowerCase()}-lesson-4`}>Lección 4 del Nivel</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">
                  Prompt Pedagógico:
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  placeholder="Describe la situación real, los personajes y el objetivo pragmático..."
                />
              </div>

              <button
                onClick={handleGenerateAiContent}
                disabled={isAiGenerating}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white font-black text-xs transition shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'Generando con IA Pedagógica...' : 'Generar Lectura de Inmersión'}</span>
              </button>

              {/* Preview Generado */}
              {aiGeneratedPreview && (
                <div className="p-4 rounded-2xl bg-[#0b101c] border border-purple-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold">
                      Vista Previa Generada ({languages[aiTargetLanguage]?.name || aiTargetLanguage})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {aiGeneratedPreview.split(/\s+/).length} palabras
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line border-l-2 border-purple-500/50 pl-3">
                    {aiGeneratedPreview}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleInjectAiToEditor}
                      className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Inyectar en el Editor de Contenido</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ===================================================================
            4. PESTAÑA: ESTADÍSTICAS GLOBALES (OVERVIEW)
        =================================================================== */}
        {activeTab === 'OVERVIEW' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                Platform Analytics & SLA Tracking
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white font-outfit">
                Métricas Globales de {APP_NAME}
              </h1>
            </div>

            {/* Tarjetas de Métricas Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Usuarios Totales</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">1,420</div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">+18 esta semana</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Lecciones Hoy</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white">42</div>
                <span className="text-[10px] font-mono text-teal-400 font-bold block">100% filtro zen</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Minutos Inmersión</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">6,240m</div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">Narrow Reading & Audio</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Idiomas Totales</span>
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{Object.keys(languages).length}</div>
                <span className="text-[10px] font-mono text-purple-400 font-bold block">
                  {Object.values(languages).filter(l => l.status === 'active').length} Activo • {Object.values(languages).filter(l => l.status !== 'active').length} Próximamente
                </span>
              </div>
            </div>

            {/* Radar / Barra de Adquisición Krashen */}
            <div className="p-6 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                Distribución de Destrezas en Adquisición (SLA)
              </h3>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Listening (Inmersión Receptiva)</span>
                    <span className="text-cyan-400 font-bold">35%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Reading (Narrow Reading & Glosario)</span>
                    <span className="text-emerald-400 font-bold">30%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Speaking (Shadowing & Fonética)</span>
                    <span className="text-teal-400 font-bold">20%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Writing (Taller & Proyectos TBLT)</span>
                    <span className="text-purple-400 font-bold">15%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =====================================================================
          MODAL: AÑADIR NUEVO IDIOMA
      ===================================================================== */}
      {isAddLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#090d16] border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Añadir Nuevo Idioma
              </h3>
              <button
                onClick={() => setIsAddLanguageModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateLanguage} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">Nombre en Español:</label>
                <input
                  type="text"
                  placeholder="ej. Portugués"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">Nombre Nativo:</label>
                <input
                  type="text"
                  placeholder="ej. Português"
                  value={newLangNative}
                  onChange={(e) => setNewLangNative(e.target.value)}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Código ISO:</label>
                  <input
                    type="text"
                    placeholder="ej. pt"
                    value={newLangCode}
                    onChange={(e) => setNewLangCode(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Bandera Emoji:</label>
                  <input
                    type="text"
                    placeholder="🇵🇹"
                    value={newLangFlag}
                    onChange={(e) => setNewLangFlag(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white text-center text-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">Lema o Enfoque:</label>
                <input
                  type="text"
                  placeholder="ej. Inmersión en Lisboa y Coímbra"
                  value={newLangTagline}
                  onChange={(e) => setNewLangTagline(e.target.value)}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                💡 Al crear el idioma se generará automáticamente la estructura de 6 niveles (A1 a C2) con 24 nodos listos para personalizar.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLanguageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black"
                >
                  Crear y Generar Curriculum
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
