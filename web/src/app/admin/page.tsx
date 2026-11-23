'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ToggleRight,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Cpu,
  Copy,
  Sliders,
  Crown,
  Building2,
  CheckCheck
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
import { AppStorage, PaymentRequest, LicenseCode } from '@/lib/storage';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { soundManager } from '@/lib/sound-effects';
import {
  LEVELS_CONFIG,
  getCourseContentForLanguage,
  saveLessonInLanguage,
  createGenericCourseForLanguage
} from '@/lib/multi-language-courses';
import {
  getAllSpecializedTracks,
  getTrackBySlug,
  getTrackCourseContent,
  saveTrackCourseContent,
  saveSpecializedTrack,
  SpecializedTrack,
  CourseType,
  DEFAULT_SPECIALIZED_TRACKS
} from '@/lib/specialized-tracks';
import {
  GlobalStoriesService,
  GlobalStory,
  CEFRLevel,
  POPULAR_TOPICS
} from '@/lib/global-stories';
import {
  AiConfigService,
  AiSystemSettings,
  AiProvider,
  DEFAULT_AI_SETTINGS,
  PROVIDER_INFO
} from '@/lib/ai-config';

type AdminTab = 'OVERVIEW' | 'CONTENT' | 'LANGUAGES' | 'AI_TOOLS' | 'AI_LIBRARY' | 'API_KEYS' | 'GLOBAL_CONFIG';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('CONTENT');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Guardia de Seguridad: Verificación estricta de credenciales de Administrador
  useEffect(() => {
    async function verifyAdminAccess() {
      try {
        const client = getSupabaseClient();
        if (!client || !isSupabaseConfigured) {
          setIsAdminAuthorized(true);
          setIsCheckingAuth(false);
          return;
        }

        const { data: { session } } = await client.auth.getSession();
        if (!session?.user) {
          try { document.cookie = 'nativa_admin_session=; path=/; max-age=0'; } catch { }
          router.replace('/?error=unauthorized_admin');
          return;
        }

        const userEmail = session.user.email?.toLowerCase().trim();
        const { data: profile } = await client
          .from('profiles')
          .select('is_admin, email')
          .eq('id', session.user.id)
          .maybeSingle();

        const isSuperAdmin = userEmail === 'adohuken2005@gmail.com';
        const hasAdminRole = Boolean(profile?.is_admin || isSuperAdmin);

        if (!hasAdminRole) {
          try { document.cookie = 'nativa_admin_session=; path=/; max-age=0'; } catch { }
          router.replace('/?error=unauthorized_admin');
          return;
        }

        try { document.cookie = 'nativa_admin_session=true; path=/; max-age=604800; SameSite=Lax'; } catch { }
        setIsAdminAuthorized(true);
      } catch (err) {
        console.error('Error al verificar autorización de admin:', err);
        router.replace('/?error=unauthorized_admin');
      } finally {
        setIsCheckingAuth(false);
      }
    }

    verifyAdminAccess();
  }, [router]);

  // =========================================================================
  // FASE 5: CONFIGURACIÓN GLOBAL, PAYWALL, SOLICITUDES Y CÓDIGOS B2B
  // =========================================================================
  const [paywallEnabled, setPaywallEnabled] = useState<boolean>(() => AppStorage.getPaywallEnabled());
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => AppStorage.getPaymentRequests());
  const [licenseCodes, setLicenseCodes] = useState<LicenseCode[]>(() => AppStorage.getLicenseCodes());
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [newCodeInput, setNewCodeInput] = useState('');
  const [newCodeNote, setNewCodeNote] = useState('');
  const [newCodeMax, setNewCodeMax] = useState(100);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState<string | null>(null);

  // =========================================================================
  // MÉTRICAS REALES PARA ESTADÍSTICAS GLOBALES (SIN DATOS FICTICIOS)
  // =========================================================================
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [realCompletedLessons, setRealCompletedLessons] = useState<number>(0);
  const [realImmersionMinutes, setRealImmersionMinutes] = useState<number>(0);
  const [realSkillScores, setRealSkillScores] = useState({ listening: 0, reading: 0, speaking: 0, writing: 0 });

  useEffect(() => {
    setRealCompletedLessons(AppStorage.getCompletedNodes().length);
    setRealImmersionMinutes(AppStorage.getImmersionMinutes());
    setRealSkillScores(AppStorage.getSkillScores());

    async function loadRealMetrics() {
      try {
        const client = getSupabaseClient();
        if (client && isSupabaseConfigured) {
          const { count, error } = await client.from('profiles').select('*', { count: 'exact', head: true });
          if (!error && count !== null) {
            setTotalUsersCount(count);
            return;
          }
        }
      } catch { }
      const profile = AppStorage.getUserProfile();
      setTotalUsersCount(profile.email ? 1 : 0);
    }
    loadRealMetrics();
  }, []);

  // =========================================================================
  // TIPO DE CURSO: GENERAL (A1-C2) vs ESPECIALIZADO (Call Center, IT, etc.)
  // =========================================================================
  const [courseType, setCourseType] = useState<CourseType>('general');
  const [specializedTracks, setSpecializedTracks] = useState<Record<string, SpecializedTrack>>(DEFAULT_SPECIALIZED_TRACKS);
  const [selectedTrackSlug, setSelectedTrackSlug] = useState<string>('call-center');
  const [selectedTrackModuleId, setSelectedTrackModuleId] = useState<string>('mod-cc-1');

  // =========================================================================
  // GESTIÓN DE IDIOMAS (LANGUAGE MANAGER STATE)
  // =========================================================================
  const [languages, setLanguages] = useState<Record<string, LanguageHubEntry>>(LANGUAGES_REGISTRY);
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);
  const [newCourseType, setNewCourseType] = useState<CourseType>('general');
  const [newLangName, setNewLangName] = useState('');
  const [newLangNative, setNewLangNative] = useState('');
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🇵🇹');
  const [newLangTagline, setNewLangTagline] = useState('');

  // Campos para nuevo Curso Especializado
  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackIndustry, setNewTrackIndustry] = useState('');
  const [newTrackSlug, setNewTrackSlug] = useState('');
  const [newTrackIcon, setNewTrackIcon] = useState<'headset' | 'code' | 'briefcase' | 'phone'>('headset');
  const [newTrackLevel, setNewTrackLevel] = useState('B1 - B2 Profesional');

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
  // BIBLIOTECA GLOBAL IA (CONTENT LAKE STATE)
  // =========================================================================
  const [globalStoriesList, setGlobalStoriesList] = useState<GlobalStory[]>([]);
  const [storyFilterLevel, setStoryFilterLevel] = useState<string>('ALL');
  const [storyFilterTopic, setStoryFilterTopic] = useState<string>('ALL');
  const [storySearchTerm, setStorySearchTerm] = useState<string>('');
  const [readingStoryModal, setReadingStoryModal] = useState<GlobalStory | null>(null);
  const [lakeStats, setLakeStats] = useState({
    totalStories: 0,
    totalReads: 0,
    estimatedTokensSaved: 0,
    topicsCount: 0,
    levelsBreakdown: {} as Record<string, number>
  });

  const refreshLakeStories = () => {
    GlobalStoriesService.init();
    const list = GlobalStoriesService.getAllStories();
    setGlobalStoriesList(list);
    setLakeStats(GlobalStoriesService.getLakeStats());
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta historia del Banco Global? Esta acción es irreversible.')) {
      GlobalStoriesService.deleteStory(storyId);
      refreshLakeStories();
      soundManager.playClick();
      setSaveSuccessNotice('✓ Historia eliminada del Banco Global');
      setTimeout(() => setSaveSuccessNotice(null), 3500);
    }
  };

  const handleToggleStoryStatus = (storyId: string, currentStatus: 'approved' | 'rejected') => {
    const nextStatus = currentStatus === 'approved' ? 'rejected' : 'approved';
    GlobalStoriesService.updateStoryStatus(storyId, nextStatus);
    refreshLakeStories();
    soundManager.playClick();
    setSaveSuccessNotice(`✓ Estado de la historia actualizado a: ${nextStatus.toUpperCase()}`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // =========================================================================
  // GESTIÓN DE APIS Y MODELOS DE IA (AI PROVIDERS STATE)
  // =========================================================================
  const [aiSettings, setAiSettings] = useState<AiSystemSettings>(DEFAULT_AI_SETTINGS);
  const [showKeys, setShowKeys] = useState<Record<AiProvider, boolean>>({
    gemini: false,
    groq: false,
    cerebras: false,
    openrouter: false,
    mistral: false,
    cohere: false,
    cloudflare: false,
    openai: false,
    deepseek: false,
    elevenlabs: false
  });
  const [testingProvider, setTestingProvider] = useState<AiProvider | null>(null);
  const [isBatchTesting, setIsBatchTesting] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; currentProviderName?: string } | null>(null);
  const [testResults, setTestResults] = useState<Record<AiProvider, {
    success: boolean;
    message: string;
    latencyMs: number;
    quotaInfo?: {
      tier?: string;
      tokensPerMinute?: string;
      requestsPerMinute?: string;
      remainingCredits?: string;
      usage?: string;
      limit?: string;
      estimatedDailyTokens?: string;
      details?: string;
    };
  } | null>>({
    gemini: null,
    groq: null,
    cerebras: null,
    openrouter: null,
    mistral: null,
    cohere: null,
    cloudflare: null,
    openai: null,
    deepseek: null,
    elevenlabs: null
  });
  const [copiedEnvNotice, setCopiedEnvNotice] = useState(false);

  // Cargar configuración de APIs al inicio
  useEffect(() => {
    const loaded = AiConfigService.getSettings();
    setAiSettings(loaded);
  }, []);

  const handleKeyChange = (provider: AiProvider, newKey: string) => {
    setAiSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...(prev.providers[provider] || { model: '', isActive: true }),
          key: newKey,
          testStatus: 'untested'
        }
      }
    }));
  };

  const handleModelChange = (provider: AiProvider, newModel: string) => {
    setAiSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...(prev.providers[provider] || { key: '', isActive: true }),
          model: newModel
        }
      }
    }));
  };

  const handleTestProvider = async (provider: AiProvider) => {
    const providerConfig = aiSettings.providers[provider];
    if (!providerConfig.key || providerConfig.key.trim().length < 5) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          message: 'Por favor introduce una API Key antes de probar la conexión.',
          latencyMs: 0
        }
      }));
      soundManager.playGentleError();
      return;
    }

    setTestingProvider(provider);
    setTestResults(prev => ({ ...prev, [provider]: null }));
    soundManager.playClick();

    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: providerConfig.key,
          model: providerConfig.model
        })
      });

      const data = await res.json();
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: data.success,
          message: data.message,
          latencyMs: data.latencyMs || 0,
          quotaInfo: data.quotaInfo
        }
      }));

      setAiSettings(prev => ({
        ...prev,
        providers: {
          ...prev.providers,
          [provider]: {
            ...prev.providers[provider],
            testStatus: data.success ? 'success' : 'error',
            testMessage: data.message,
            latencyMs: data.latencyMs,
            lastTestedAt: new Date().toISOString()
          }
        }
      }));

      if (data.success) {
        soundManager.playSuccess();
      } else {
        soundManager.playGentleError();
      }
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          message: `Error de red local: ${err?.message || 'Servidor no respondió'}`,
          latencyMs: 0
        }
      }));
      soundManager.playGentleError();
    } finally {
      setTestingProvider(null);
    }
  };

  // DIAGNÓSTICO EN LOTE: PROBAR TODAS LAS APIS A LA VEZ
  const handleTestAllProviders = async () => {
    const allProviders: AiProvider[] = [
      'gemini', 'groq', 'cerebras', 'openrouter', 'mistral',
      'cohere', 'cloudflare', 'openai', 'deepseek', 'elevenlabs'
    ];

    const configured = allProviders.filter(
      p => aiSettings.providers[p]?.key && aiSettings.providers[p].key.trim().length > 5
    );

    if (configured.length === 0) {
      setSaveSuccessNotice('⚠️ No hay ninguna API Key ingresada aún. Pega tus claves para diagnosticarlas.');
      soundManager.playGentleError();
      setTimeout(() => setSaveSuccessNotice(null), 4000);
      return;
    }

    setIsBatchTesting(true);
    setBatchProgress({ current: 0, total: configured.length });
    soundManager.playClick();

    let successfulCount = 0;
    let totalLatency = 0;

    for (let i = 0; i < configured.length; i++) {
      const p = configured[i];
      const pInfo = PROVIDER_INFO[p];
      setBatchProgress({ current: i + 1, total: configured.length, currentProviderName: pInfo.name });
      setTestingProvider(p);

      try {
        const res = await fetch('/api/ai/test-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: p,
            apiKey: aiSettings.providers[p].key,
            model: aiSettings.providers[p].model
          })
        });

        const data = await res.json();
        setTestResults(prev => ({
          ...prev,
          [p]: {
            success: data.success,
            message: data.message,
            latencyMs: data.latencyMs || 0,
            quotaInfo: data.quotaInfo
          }
        }));

        setAiSettings(prev => ({
          ...prev,
          providers: {
            ...prev.providers,
            [p]: {
              ...prev.providers[p],
              testStatus: data.success ? 'success' : 'error',
              testMessage: data.message,
              latencyMs: data.latencyMs,
              lastTestedAt: new Date().toISOString()
            }
          }
        }));

        if (data.success) {
          successfulCount++;
          totalLatency += (data.latencyMs || 0);
        }
      } catch (err) {
        setTestResults(prev => ({
          ...prev,
          [p]: {
            success: false,
            message: 'Error de red al conectar',
            latencyMs: 0
          }
        }));
      }
    }

    setIsBatchTesting(false);
    setTestingProvider(null);
    setBatchProgress(null);

    const avgLatency = successfulCount > 0 ? Math.round(totalLatency / successfulCount) : 0;
    soundManager.playVictory();
    setSaveSuccessNotice(`✓ Diagnóstico en lote completado: ${successfulCount} de ${configured.length} APIs operativas (Latencia promedio: ${avgLatency} ms)`);
    setTimeout(() => setSaveSuccessNotice(null), 5000);
  };

  const handleSaveAiSettings = () => {
    AiConfigService.saveSettings(aiSettings);
    soundManager.playVictory();
    setSaveSuccessNotice('✓ Configuración de APIs y Modelos guardada con éxito');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  const handleCopyEnvFormat = () => {
    const envText = AiConfigService.exportToEnvFormat(aiSettings);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(envText);
      setCopiedEnvNotice(true);
      soundManager.playClick();
      setTimeout(() => setCopiedEnvNotice(false), 3000);
    }
  };

  // =========================================================================
  // CARGA INICIAL DE DATOS
  // =========================================================================
  useEffect(() => {
    const allLangs = getAllLanguages();
    setLanguages(allLangs);

    const allTracks = getAllSpecializedTracks();
    setSpecializedTracks(allTracks);

    refreshLakeStories();

    if (courseType === 'specialized') {
      const trackCourse = getTrackCourseContent(selectedTrackSlug);
      setActiveCourse(trackCourse);
    } else {
      const initialCourse = getCourseContentForLanguage(selectedLanguageId);
      setActiveCourse(initialCourse);
    }
  }, []);

  // =========================================================================
  // CAMBIO ENTRE CURSO GENERAL Y CURSO ESPECIALIZADO
  // =========================================================================
  useEffect(() => {
    if (courseType === 'specialized') {
      const trackCourse = getTrackCourseContent(selectedTrackSlug);
      setActiveCourse(trackCourse);

      const availableModules = Object.keys(trackCourse.modules || {});
      const activeModId = availableModules.includes(selectedTrackModuleId) ? selectedTrackModuleId : (availableModules[0] || 'mod-cc-1');
      setSelectedTrackModuleId(activeModId);

      const mod = trackCourse.modules[activeModId];
      const availableLessonIds = mod && mod.lessons ? Object.keys(mod.lessons) : [];
      if (availableLessonIds.length > 0) {
        setSelectedLessonId(availableLessonIds[0]);
      }
    } else {
      const course = getCourseContentForLanguage(selectedLanguageId);
      setActiveCourse(course);

      const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
      const mod = course.modules[lvlConfig.moduleId];
      const availableLessonIds = mod && mod.lessons ? Object.keys(mod.lessons) : [];
      if (availableLessonIds.length > 0) {
        setSelectedLessonId(availableLessonIds[0]);
      }
    }
  }, [courseType, selectedTrackSlug, selectedLanguageId]);

  // =========================================================================
  // AJUSTAR LECCIÓN AL CAMBIAR DE NIVEL MCER (General) O MÓDULO (Especializado)
  // =========================================================================
  useEffect(() => {
    if (courseType === 'specialized') {
      const mod = activeCourse.modules[selectedTrackModuleId];
      const availableLessonIds = mod && mod.lessons ? Object.keys(mod.lessons) : [];
      if (availableLessonIds.length > 0) {
        setSelectedLessonId(availableLessonIds[0]);
      }
    } else {
      const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
      const mod = activeCourse.modules[lvlConfig.moduleId];
      const availableLessonIds = mod && mod.lessons ? Object.keys(mod.lessons) : [];
      const defaultLessonId = availableLessonIds[0] || `${selectedLevel.toLowerCase()}-lesson-1`;
      setSelectedLessonId(defaultLessonId);
    }
  }, [selectedLevel, selectedTrackModuleId]);

  // =========================================================================
  // POBLAR EL FORMULARIO CUANDO CAMBIA LA LECCIÓN SELECCIONADA
  // =========================================================================
  useEffect(() => {
    let mod: any = null;
    if (courseType === 'specialized') {
      mod = activeCourse.modules[selectedTrackModuleId];
    } else {
      const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
      mod = activeCourse.modules[lvlConfig.moduleId];
    }

    const lesson = mod?.lessons?.[selectedLessonId];

    if (lesson) {
      setNodeTitle(lesson.title || '');
      setNodeSubtitle(
        courseType === 'specialized'
          ? `Objetivo operacional para ${lesson.title}`
          : `Objetivo comunicativo para ${lesson.title}`
      );
      setNodeScenario(
        courseType === 'specialized'
          ? `Escenario BPO / Atención al Cliente Telefónico`
          : `Escenario de inmersión en ${selectedLanguageId.toUpperCase()}`
      );

      // SubNodo Reading
      const rSub = lesson.subNodes?.find((s: any) => s.type === 'reading')?.content?.reading;
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
      const lSub = lesson.subNodes?.find((s: any) => s.type === 'listening')?.content?.listening;
      if (lSub) {
        setListeningTitle(lSub.title || '');
        setListeningDuration(lSub.audioDurationText || '1:15 min');
        setListeningAudioUrl(`https://storage.nativa.io/audio/${courseType === 'specialized' ? selectedTrackSlug : selectedLanguageId}/${selectedLessonId}.mp3`);
        setListeningScriptEn(lSub.audioScriptEn || '');
        setListeningScriptEs(lSub.audioScriptEs || '');
        setCulturalCapsule(lSub.culturalInsight || '');
      } else {
        setListeningTitle(`Audio Receptivo • ${lesson.lessonCode}`);
        setListeningDuration('1:15 min');
        setListeningAudioUrl(`https://storage.nativa.io/audio/${courseType === 'specialized' ? selectedTrackSlug : selectedLanguageId}/${selectedLessonId}.mp3`);
        setListeningScriptEn('');
        setListeningScriptEs('');
        setCulturalCapsule('');
      }
    }
  }, [selectedLessonId, activeCourse, selectedLevel, selectedLanguageId, courseType, selectedTrackModuleId, selectedTrackSlug]);

  // Lista de Nodos Madre del Nivel actual o Módulo Especializado
  const currentLevelLessons = useMemo(() => {
    let mod: any = null;
    if (courseType === 'specialized') {
      mod = activeCourse.modules[selectedTrackModuleId];
    } else {
      const lvlConfig = LEVELS_CONFIG[selectedLevel] || LEVELS_CONFIG.A1;
      mod = activeCourse.modules[lvlConfig.moduleId];
    }

    if (mod && mod.lessons) {
      return Object.values<any>(mod.lessons).map((l: any) => ({
        id: l.lessonId,
        code: l.lessonCode,
        title: l.title,
        xp: 35
      }));
    }
    return [];
  }, [courseType, activeCourse, selectedLevel, selectedTrackModuleId]);

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

    // Guardado para Curso Especializado
    if (courseType === 'specialized') {
      const mod = activeCourse.modules[selectedTrackModuleId];
      if (mod && mod.lessons && mod.lessons[selectedLessonId]) {
        const lesson = mod.lessons[selectedLessonId];
        lesson.title = nodeTitle || lesson.title;

        // SubNodo Reading
        let readingSub = lesson.subNodes.find((s: any) => s.type === 'reading');
        if (!readingSub) {
          readingSub = {
            id: `${selectedLessonId}-reading`,
            motherNodeId: selectedLessonId,
            type: 'reading',
            title: readingTitle || 'Lectura de Inmersión',
            label: 'Lectura BPO',
            durationMinutes: readingMinutes || 3,
            xpReward: 25,
            content: { reading: { title: readingTitle, summary: '', wordCount: 100, readingMinutes: readingMinutes || 3, paragraphs: [], vocabulary: {} } }
          };
          lesson.subNodes.push(readingSub);
        }
        if (readingSub.content?.reading) {
          readingSub.content.reading.title = readingTitle;
          readingSub.content.reading.readingMinutes = readingMinutes;
          readingSub.content.reading.paragraphs = paragraphs.length > 0 ? paragraphs : [readingText];
          readingSub.content.reading.vocabulary = vocabObject;
        }

        // SubNodo Listening
        let listeningSub = lesson.subNodes.find((s: any) => s.type === 'listening');
        if (!listeningSub) {
          listeningSub = {
            id: `${selectedLessonId}-listening`,
            motherNodeId: selectedLessonId,
            type: 'listening',
            title: listeningTitle || 'Audio Receptivo',
            label: 'Audio Telefónico',
            durationMinutes: 2,
            xpReward: 25,
            content: { listening: { title: listeningTitle, audioDurationText: listeningDuration, audioScriptEn: '', audioScriptEs: '', culturalInsight: '', transcriptLines: [] } }
          };
          lesson.subNodes.push(listeningSub);
        }
        if (listeningSub.content?.listening) {
          listeningSub.content.listening.title = listeningTitle;
          listeningSub.content.listening.audioDurationText = listeningDuration;
          listeningSub.content.listening.audioScriptEn = listeningScriptEn;
          listeningSub.content.listening.audioScriptEs = listeningScriptEs;
          listeningSub.content.listening.culturalInsight = culturalCapsule;
        }

        saveTrackCourseContent(selectedTrackSlug, activeCourse);
        const track = specializedTracks[selectedTrackSlug];
        setSaveSuccessNotice(`✓ Cambios guardados en ${lesson.lessonCode} de ${track?.name || selectedTrackSlug}`);
        setTimeout(() => setSaveSuccessNotice(null), 3500);
        return;
      }
    }

    // Guardado para Idioma General
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
  // CREAR UN NUEVO TRACK ESPECIALIZADO
  // =========================================================================
  const handleCreateSpecializedTrack = () => {
    if (!newTrackName || !newTrackSlug) return;
    const slug = newTrackSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    const scaffoldedContent: CourseContent = {
      modules: {
        [`mod-${slug}-1`]: {
          moduleId: `mod-${slug}-1`,
          unitNumber: 1,
          level: 'B1',
          title: 'Módulo 1 • Primer Contacto y Protocolo Inicial',
          lessons: {
            [`${slug}-1-1`]: {
              lessonId: `${slug}-1-1`,
              lessonCode: '1.1',
              title: `Apertura Profesional y Saludo en ${newTrackName}`,
              subNodes: [
                {
                  id: `${slug}-1-1-reading`,
                  motherNodeId: `${slug}-1-1`,
                  type: 'reading',
                  title: `Lectura Profesional: Protocolos de ${newTrackName}`,
                  label: 'Lectura Profesional',
                  durationMinutes: 3,
                  xpReward: 25,
                  content: {
                    reading: {
                      title: `Introduction to ${newTrackName} Standards`,
                      summary: `Directrices esenciales para el ejercicio en ${newTrackIndustry || newTrackName}.`,
                      wordCount: 110,
                      readingMinutes: 3,
                      paragraphs: [
                        `Welcome to the professional training module for ${newTrackName}. Clear communication, technical vocabulary, and situational awareness are critical.`,
                        `In this first unit, you will practice real-world workplace dialogues and specialized vocabulary.`
                      ],
                      vocabulary: {
                        'standard': 'Estándar o norma profesional',
                        'workflow': 'Flujo de trabajo estructurado'
                      }
                    }
                  }
                },
                {
                  id: `${slug}-1-1-listening`,
                  motherNodeId: `${slug}-1-1`,
                  type: 'listening',
                  title: `Audio Receptivo: Caso Real en ${newTrackName}`,
                  label: 'Audio Especializado',
                  durationMinutes: 2,
                  xpReward: 25,
                  content: {
                    listening: {
                      title: `Interaction Dialogue: ${newTrackName}`,
                      audioDurationText: '1:10 min',
                      audioScriptEn: `Professional: Good morning, thank you for reaching out. How may I assist you today?\nClient: Hello, I need to verify our current operational status.\nProfessional: Absolutely, let me check the system records right away.`,
                      audioScriptEs: `Profesional: Buenos días, gracias por contactarnos. ¿Cómo puedo asistirle hoy?\nCliente: Hola, necesito verificar nuestro estado operativo actual.\nProfesional: Por supuesto, permítame revisar los registros de inmediato.`,
                      culturalInsight: `La comunicación profesional anglosajona enfatiza la cortesía eficiente y la asertividad sin rodeos.`,
                      transcriptLines: [
                        { speaker: 'PROFESSIONAL', en: 'Good morning, how may I assist you today?', es: 'Buenos días, ¿cómo puedo asistirle hoy?' },
                        { speaker: 'CLIENT', en: 'Hello, I need to verify our operational status.', es: 'Hola, necesito verificar nuestro estado operativo.' }
                      ]
                    }
                  }
                },
                {
                  id: `${slug}-1-1-srs`,
                  motherNodeId: `${slug}-1-1`,
                  type: 'srs',
                  title: `Mazo SRS: Frases Clave en ${newTrackName}`,
                  label: 'Repaso Espaciado',
                  durationMinutes: 2,
                  xpReward: 20,
                  content: {
                    srs: {
                      title: `Vocabulario Fundamental para ${newTrackName}`,
                      cardCount: 2,
                      targetPhrases: [
                        { en: 'I will ensure all specifications are properly documented.', es: 'Me aseguraré de que todas las especificaciones queden documentadas adecuadamente.', context: 'Profesionalismo' }
                      ]
                    }
                  }
                }
              ]
            }
          }
        },
        [`mod-${slug}-2`]: {
          moduleId: `mod-${slug}-2`,
          unitNumber: 2,
          level: 'B1',
          title: 'Módulo 2 • Procedimientos y Resolución Técnica',
          lessons: {}
        },
        [`mod-${slug}-3`]: {
          moduleId: `mod-${slug}-3`,
          unitNumber: 3,
          level: 'B2',
          title: 'Módulo 3 • Casos Complejos y Negociación',
          lessons: {}
        },
        [`mod-${slug}-4`]: {
          moduleId: `mod-${slug}-4`,
          unitNumber: 4,
          level: 'B2',
          title: 'Módulo 4 • Entrega, Calidad y Cierre',
          lessons: {}
        }
      }
    };

    const newTrack: SpecializedTrack = {
      id: `${slug}-track`,
      slug: slug,
      languageId: 'english',
      courseType: 'specialized',
      name: newTrackName.trim(),
      title: newTrackName.trim(),
      tagline: newTrackIndustry || `Especialización profesional en ${newTrackName}`,
      description: `Curso especializado en ${newTrackName} con 4 módulos de inmersión y situaciones reales.`,
      industry: newTrackIndustry.trim() || 'Sector Profesional',
      icon: newTrackIcon,
      level: newTrackLevel,
      badge: 'Track Especializado',
      accentColor: 'text-amber-400',
      gradient: 'from-amber-500 via-orange-400 to-amber-600',
      modulesCount: 4,
      lessonsCount: 4,
      courseContent: scaffoldedContent
    };

    saveSpecializedTrack(newTrack);
    saveTrackCourseContent(slug, scaffoldedContent);

    const updatedTracks = getAllSpecializedTracks();
    setSpecializedTracks(updatedTracks);

    setCourseType('specialized');
    setSelectedTrackSlug(slug);
    setSelectedTrackModuleId(`mod-${slug}-1`);
    setSelectedLessonId(`${slug}-1-1`);
    setActiveCourse(scaffoldedContent);

    setIsAddLanguageModalOpen(false);
    soundManager.playVictory();
    setSaveSuccessNotice(`✓ Track Especializado "${newTrackName}" creado con sus 4 módulos.`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);

    // Limpiar formulario
    setNewTrackName('');
    setNewTrackIndustry('');
    setNewTrackSlug('');
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-mono text-sm text-slate-300">Verificando credenciales de Administrador en Nativa...</p>
      </div>
    );
  }

  if (!isAdminAuthorized) {
    return null;
  }

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

          <button
            onClick={() => {
              setActiveTab('AI_LIBRARY');
              refreshLakeStories();
              soundManager.playClick();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'AI_LIBRARY'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Biblioteca IA</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('API_KEYS');
              soundManager.playClick();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'API_KEYS'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Configuración de APIs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('GLOBAL_CONFIG');
              soundManager.playClick();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === 'GLOBAL_CONFIG'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/40 text-amber-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Configuración Global & Paywall</span>
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

            {/* Cabecera con Selector de Tipo de Curso, Idioma / Track y Nivel / Módulo */}
            <div className="flex flex-col gap-4 p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                    Content Management System
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Editor de Nodos y Lecciones
                  </h1>
                </div>

                {/* SELECTOR DE TIPO DE CURSO: GENERAL vs ESPECIALIZADO */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0b101c] border border-slate-700/80 self-start sm:self-auto shadow-inner">
                  <button
                    onClick={() => {
                      setCourseType('general');
                      soundManager.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${courseType === 'general'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Idioma General (A1-C2)</span>
                  </button>

                  <button
                    onClick={() => {
                      setCourseType('specialized');
                      soundManager.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${courseType === 'specialized'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Curso Especializado</span>
                  </button>
                </div>
              </div>

              {/* Selectores dependientes del Tipo de Curso */}
              <div className="flex items-center justify-between gap-4 flex-wrap pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3 flex-wrap">
                  {courseType === 'general' ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 block font-bold">Idioma General:</label>
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
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-amber-400 block font-bold">Especialización / Track:</label>
                        <select
                          value={selectedTrackSlug}
                          onChange={(e) => {
                            setSelectedTrackSlug(e.target.value);
                            soundManager.playClick();
                          }}
                          className="bg-[#0b101c] border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                        >
                          {Object.values(specializedTracks).map((t) => (
                            <option key={t.slug} value={t.slug}>
                              🎧 {t.name} ({t.industry})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 block font-bold">Módulo de Especialización:</label>
                        <select
                          value={selectedTrackModuleId}
                          onChange={(e) => {
                            setSelectedTrackModuleId(e.target.value);
                            soundManager.playClick();
                          }}
                          className="bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-teal-500"
                        >
                          {Object.values(activeCourse.modules || {}).map((m) => (
                            <option key={m.moduleId} value={m.moduleId}>
                              {m.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleSaveContentChanges}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
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
                  {courseType === 'specialized'
                    ? `Nodos Especializados • ${activeCourse.modules[selectedTrackModuleId]?.title || 'Módulo'}`
                    : `Nodos Madre • Unidad ${LEVELS_CONFIG[selectedLevel]?.unitNumber || 1} (${selectedLevel})`}
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
            2. PESTAÑA: GESTIÓN DE IDIOMAS Y CURSOS (LANGUAGE & TRACK MANAGER)
        =================================================================== */}
        {activeTab === 'LANGUAGES' && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 shadow-xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  Language & Track Manager
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Idiomas y Cursos Especializados
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setNewCourseType('general');
                    setIsAddLanguageModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Nuevo Idioma</span>
                </button>

                <button
                  onClick={() => {
                    setNewCourseType('specialized');
                    setIsAddLanguageModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Añadir Especialización</span>
                </button>
              </div>
            </div>

            {/* SECCIÓN 1: CURSOS ESPECIALIZADOS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span>Tracks de Especialización Profesional ({Object.keys(specializedTracks).length})</span>
                </h2>
                <span className="text-[11px] font-mono text-amber-400/90 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                  BPO & Sectores Industriales
                </span>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#090d16]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b101c] border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-4">Especialización</th>
                      <th className="p-4">Industria / Enfoque</th>
                      <th className="p-4">Nivel Objetivo</th>
                      <th className="p-4">Módulos</th>
                      <th className="p-4">Nodos</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {Object.values(specializedTracks).map((t) => (
                      <tr key={t.slug} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
                            <Headphones className="w-5 h-5" />
                          </div>
                          <div>
                            <strong className="text-white block">{t.name}</strong>
                            <span className="text-[11px] font-mono text-amber-400">{t.badge}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{t.industry}</td>
                        <td className="p-4 font-mono text-orange-300 font-bold">{t.level}</td>
                        <td className="p-4 font-mono">{t.modulesCount} Fases</td>
                        <td className="p-4 font-mono">{t.lessonsCount} Nodos</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setCourseType('specialized');
                              setSelectedTrackSlug(t.slug);
                              setActiveTab('CONTENT');
                              soundManager.playClick();
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition font-bold"
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

            {/* SECCIÓN 2: IDIOMAS GENERALES */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Idiomas Generales ({Object.keys(languages).length})</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  Ruta Universitaria MCER A1 → C2
                </span>
              </div>

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
                              setCourseType('general');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Usuarios Totales</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{totalUsersCount}</div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                  {isSupabaseConfigured ? 'Registros en Supabase' : 'Almacenamiento Local'}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Lecciones Completadas</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white">{realCompletedLessons}</div>
                <span className="text-[10px] font-mono text-teal-400 font-bold block">Nodos completados</span>
              </div>

              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Minutos Inmersión</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">{realImmersionMinutes}m</div>
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

              <div className="p-5 rounded-3xl bg-[#090d16] border border-amber-500/30 space-y-2 bg-gradient-to-br from-amber-950/20 to-transparent">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="text-amber-400 font-bold">Tracks BPO</span>
                  <Headphones className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300">{Object.keys(specializedTracks).length}</div>
                <span className="text-[10px] font-mono text-amber-400 font-bold block">
                  Call Center Activo
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
                    <span className="text-cyan-400 font-bold">{realSkillScores.listening}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, realSkillScores.listening)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Reading (Narrow Reading & Glosario)</span>
                    <span className="text-emerald-400 font-bold">{realSkillScores.reading}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, realSkillScores.reading)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Speaking (Shadowing & Fonética)</span>
                    <span className="text-teal-400 font-bold">{realSkillScores.speaking}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, realSkillScores.speaking)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1 font-mono text-[11px] text-slate-400">
                    <span>Writing (Taller & Proyectos TBLT)</span>
                    <span className="text-purple-400 font-bold">{realSkillScores.writing}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, realSkillScores.writing)}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
            5. PESTAÑA: BIBLIOTECA IA (CONTENT LAKE & GESTIÓN DE HISTORIAS)
        =================================================================== */}
        {activeTab === 'AI_LIBRARY' && (
          <div className="p-6 md:p-8 space-y-6">

            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Content Lake • Reutilización Colectiva
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Caché Global Centralizado
                  </span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Biblioteca Global de Historias IA</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Banco compartido de narrativas generadas por IA. Cada lectura reutilizada ahorra tokens y reduce el costo de inferencia a cero.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    refreshLakeStories();
                    soundManager.playClick();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Sincronizar e indexar banco global"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sincronizar Banco</span>
                </button>
              </div>
            </div>

            {/* 4 TARJETAS DE MÉTRICAS GLOBALES */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/90 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-mono font-bold uppercase">Historias en Banco</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {lakeStats.totalStories}
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  A1 ({lakeStats.levelsBreakdown?.A1 || 0}) • B1 ({lakeStats.levelsBreakdown?.B1 || 0}) • B2 ({lakeStats.levelsBreakdown?.B2 || 0})
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/90 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-mono font-bold uppercase">Lecturas Totales</span>
                  <Users className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {lakeStats.totalReads.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-teal-400">
                  Exposiciones comprensibles acumuladas
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/90 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-mono font-bold uppercase">Tokens Ahorrados</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-300">
                  ~{lakeStats.estimatedTokensSaved.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-purple-400">
                  Ahorro en inferencia por caché global
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/90 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-mono font-bold uppercase">Temas Cubiertos</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {lakeStats.topicsCount}
                </div>
                <div className="text-[10px] font-mono text-cyan-400">
                  Call Center, Tech, Travel, etc.
                </div>
              </div>
            </div>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                {/* Filtro por Nivel */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
                  <span className="px-2 text-[10px] text-slate-400 font-bold uppercase">Nivel:</span>
                  {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setStoryFilterLevel(lvl)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition ${storyFilterLevel === lvl
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      {lvl === 'ALL' ? 'Todos' : lvl}
                    </button>
                  ))}
                </div>

                {/* Filtro por Tema */}
                <div className="flex items-center gap-1">
                  <select
                    value={storyFilterTopic}
                    onChange={(e) => setStoryFilterTopic(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="ALL">Todos los Temas</option>
                    {POPULAR_TOPICS.map((top) => (
                      <option key={top} value={top}>{top}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Búsqueda por texto */}
              <div className="w-full md:w-72 relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por título o contenido..."
                  value={storySearchTerm}
                  onChange={(e) => setStorySearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            {/* TABLA / GRILLA DE HISTORIAS */}
            {(() => {
              const filtered = GlobalStoriesService.getStoriesFiltered({
                level: storyFilterLevel,
                topic: storyFilterTopic,
                searchTerm: storySearchTerm
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-12 text-center rounded-2xl bg-[#090d16] border border-slate-800 text-slate-500 text-xs space-y-2">
                    <Database className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="font-bold text-slate-400">No se encontraron historias con los filtros seleccionados.</p>
                    <p>Prueba seleccionando otro Nivel o limpiando el campo de búsqueda.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 px-1">
                    Mostrando <strong className="text-white">{filtered.length}</strong> historias del banco global:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((story) => (
                      <div
                        key={story.id}
                        className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-sm relative group"
                      >
                        {/* Cabecera de Tarjeta */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                                {story.level}
                              </span>
                              <span className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold">
                                {story.topic}
                              </span>
                            </div>

                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${story.status === 'approved'
                              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                              }`}>
                              {story.status === 'approved' ? '✓ Aprobada' : '✕ Oculta'}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                            {story.title}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                            {story.paragraphs?.[0] || story.content}
                          </p>
                        </div>

                        {/* Metadatos y Acciones */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-mono text-[11px] text-teal-300 font-bold">
                            <span>📖 {story.times_read} lecturas</span>
                            <span>•</span>
                            <span className="text-slate-500 font-normal">{story.word_count} palabras</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Botón Leer */}
                            <button
                              onClick={() => {
                                setReadingStoryModal(story);
                                soundManager.playClick();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                              title="Leer historia completa"
                            >
                              Leer
                            </button>

                            {/* Botón Cambiar Estado */}
                            <button
                              onClick={() => handleToggleStoryStatus(story.id, story.status)}
                              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                              title={story.status === 'approved' ? 'Ocultar historia' : 'Aprobar historia'}
                            >
                              {story.status === 'approved' ? (
                                <ToggleRight className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-rose-400" />
                              )}
                            </button>

                            {/* Botón Eliminar */}
                            <button
                              onClick={() => handleDeleteStory(story.id)}
                              className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400 hover:text-rose-200 transition cursor-pointer"
                              title="Eliminar si la IA alucinó o tiene errores"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* MODAL DE LECTURA Y REVISIÓN PARA EL ADMINISTRADOR */}
        <AnimatePresence>
          {readingStoryModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#090d16] border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                      {readingStoryModal.level}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold">
                      {readingStoryModal.topic}
                    </span>
                    <span className="text-[10px] font-mono text-teal-300 font-bold">
                      📖 {readingStoryModal.times_read} lecturas
                    </span>
                  </div>
                  <button
                    onClick={() => setReadingStoryModal(null)}
                    className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-black text-white">
                    {readingStoryModal.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {readingStoryModal.subtitle}
                  </p>
                </div>

                {/* Párrafos */}
                <div className="space-y-3 font-sans leading-relaxed text-sm text-slate-200 bg-[#060911] p-4 rounded-2xl border border-slate-800">
                  {readingStoryModal.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Vocabulario */}
                {readingStoryModal.vocabulary && Object.keys(readingStoryModal.vocabulary).length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-1.5 text-xs">
                    <strong className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Vocabulario Introducido:
                    </strong>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(readingStoryModal.vocabulary).map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                          <strong className="text-teal-300">{k}:</strong> {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insight */}
                {readingStoryModal.cultural_insight && (
                  <div className="p-3 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-xs text-slate-300 space-y-1">
                    <strong className="text-[10px] font-mono text-teal-300 uppercase font-bold block">
                      💡 Insight Pragmático:
                    </strong>
                    <p>{readingStoryModal.cultural_insight}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleDeleteStory(readingStoryModal.id);
                      setReadingStoryModal(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Historia</span>
                  </button>

                  <button
                    onClick={() => setReadingStoryModal(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Cerrar Vista Previa
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            6. PESTAÑA: CONFIGURACIÓN DE APIS Y MODELOS DE IA
        =================================================================== */}
        {activeTab === 'API_KEYS' && (() => {
          const allProviderKeys: AiProvider[] = ['gemini', 'groq', 'cerebras', 'openrouter', 'mistral', 'cohere', 'cloudflare', 'openai', 'deepseek', 'elevenlabs'];
          const configuredCount = allProviderKeys.filter(p => aiSettings.providers[p]?.key && aiSettings.providers[p].key.trim().length > 5).length;
          const successfulList = allProviderKeys.filter(p => testResults[p]?.success);
          const testedCount = allProviderKeys.filter(p => testResults[p] !== null).length;
          const avgLatency = successfulList.length > 0
            ? Math.round(successfulList.reduce((acc, p) => acc + (testResults[p]?.latencyMs || 0), 0) / successfulList.length)
            : 0;

          return (
            <div className="p-6 md:p-8 space-y-6">

              {/* Cabecera Principal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      Centro de Integraciones & Token Lake
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      10 Motores de Inferencia Configurados
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" />
                    <span>Configuración de APIs, Tokens & Diagnóstico</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verifica la funcionalidad de tus claves, consulta saldos y monitorea los límites de cuota (TPM/RPM) de cada motor.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Botón Diagnosticar Todas las APIs */}
                  <button
                    onClick={handleTestAllProviders}
                    disabled={isBatchTesting}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="Ejecuta un ping de prueba en lote a todas las claves configuradas"
                  >
                    <RotateCcw className={`w-4 h-4 ${isBatchTesting ? 'animate-spin' : ''}`} />
                    <span>
                      {isBatchTesting
                        ? `Probando [${batchProgress?.current || 0}/${batchProgress?.total || 0}] ${batchProgress?.currentProviderName || ''}...`
                        : '⚡ Probar Todas las APIs a la Vez'}
                    </span>
                  </button>

                  <button
                    onClick={handleCopyEnvFormat}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                    title="Copiar todas las variables formateadas para .env.local"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{copiedEnvNotice ? '¡Copiado!' : 'Copiar .env'}</span>
                  </button>

                  <button
                    onClick={handleSaveAiSettings}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Todo</span>
                  </button>
                </div>
              </div>

              {/* BARRA DE PROGRESO DE DIAGNÓSTICO EN LOTE */}
              {isBatchTesting && batchProgress && (
                <div className="p-3.5 rounded-2xl bg-[#080d16] border border-cyan-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      Diagnóstico en progreso: Probando {batchProgress.currentProviderName}...
                    </span>
                    <span className="text-slate-400">
                      {batchProgress.current} de {batchProgress.total} claves
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 4 TARJETAS DEL MONITOR GLOBAL DE TOKENS & CAPACIDAD */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Estado de la Red */}
                <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-mono font-bold uppercase">Estado de la Red</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white flex items-center gap-2">
                    <span>{successfulList.length}</span>
                    <span className="text-xs font-mono text-slate-400 font-normal">/ {configuredCount} conectadas</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    {successfulList.length > 0 ? '✓ Red de inferencia operativa' : 'Sin diagnóstico reciente'}
                  </div>
                </div>

                {/* 2. Capacidad Diaria Estimada */}
                <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-mono font-bold uppercase">Tokens Diarios Reunidos</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-300">
                    ~{configuredCount > 0 ? (configuredCount * 500000).toLocaleString() : '0'}+
                  </div>
                  <div className="text-[10px] font-mono text-amber-400">
                    Equivale a ~{configuredCount > 0 ? (configuredCount * 250).toLocaleString() : '0'} historias completas/día
                  </div>
                </div>

                {/* 3. Latencia Promedio */}
                <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-mono font-bold uppercase">Latencia Promedio</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {avgLatency > 0 ? `${avgLatency} ms` : '—'}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">
                    {avgLatency > 0 && avgLatency < 300 ? '⚡ Ultra Rápida (LPU / CS-3)' : 'Tiempo de respuesta'}
                  </div>
                </div>

                {/* 4. Créditos / Saldos Detectados */}
                <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-mono font-bold uppercase">Saldos Detectados</span>
                    <Key className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-black text-purple-300 truncate">
                    {testResults.openrouter?.quotaInfo?.remainingCredits
                      ? `OpenRouter: ${testResults.openrouter.quotaInfo.remainingCredits}`
                      : testResults.elevenlabs?.quotaInfo?.remainingCredits
                        ? `ElevenLabs: ${testResults.elevenlabs.quotaInfo.remainingCredits}`
                        : 'Listo para diagnosticar'}
                  </div>
                  <div className="text-[10px] font-mono text-purple-400 truncate">
                    {testResults.elevenlabs?.quotaInfo?.usage
                      ? `ElevenLabs uso: ${testResults.elevenlabs.quotaInfo.usage}`
                      : 'Saldos directos por API'}
                  </div>
                </div>
              </div>

              {/* ORQUESTRACIÓN DEL ROTADOR INTELIGENTE (FAILOVER & REDUNDANCIA) */}
              <div className="p-5 rounded-2xl bg-[#080d16] border border-amber-500/30 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">Orquestador de Rotación y Respaldo Inteligente</h3>
                      <p className="text-[11px] text-slate-400">Si un proveedor agota su cuota de peticiones (429 Rate Limit), la plataforma salta al respaldo sin fricción.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-300 font-bold">Auto-Failover:</span>
                    <button
                      onClick={() => setAiSettings(prev => ({ ...prev, enableAutoFailover: !prev.enableAutoFailover }))}
                      className="cursor-pointer"
                    >
                      {aiSettings.enableAutoFailover ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  {/* Proveedor Principal */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      1. Proveedor Principal:
                    </label>
                    <select
                      value={aiSettings.primaryProvider}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, primaryProvider: e.target.value as AiProvider }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="gemini">Google Gemini (Recomendado)</option>
                      <option value="groq">Groq Cloud (500+ tokens/s)</option>
                      <option value="cerebras">Cerebras (2,000+ tokens/s)</option>
                      <option value="openrouter">OpenRouter (Hub 200+ Modelos)</option>
                      <option value="mistral">Mistral AI (Multilingüe Europeo)</option>
                      <option value="cohere">Cohere (Command R+)</option>
                      <option value="cloudflare">Cloudflare Workers AI (Edge)</option>
                      <option value="openai">OpenAI (GPT-4o Mini)</option>
                      <option value="deepseek">DeepSeek AI (Bajo Costo)</option>
                    </select>
                  </div>

                  {/* Proveedor de Respaldo */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      2. Proveedor de Respaldo (Fallback):
                    </label>
                    <select
                      value={aiSettings.fallbackProvider}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, fallbackProvider: e.target.value as AiProvider }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="groq">Groq Cloud (Llama 3.3 70B)</option>
                      <option value="cerebras">Cerebras (Hiper-Velocidad)</option>
                      <option value="openrouter">OpenRouter (Respaldo Universal)</option>
                      <option value="mistral">Mistral AI (Mistral Small)</option>
                      <option value="cohere">Cohere (Command R)</option>
                      <option value="cloudflare">Cloudflare Workers AI</option>
                      <option value="gemini">Google Gemini (Gemini 2.0 Flash)</option>
                      <option value="deepseek">DeepSeek AI (DeepSeek V3)</option>
                      <option value="openai">OpenAI (GPT-4o Mini)</option>
                    </select>
                  </div>

                  {/* Temperatura Pedagógica */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold">
                      <span>Temperatura SLA:</span>
                      <span className="text-amber-400">{aiSettings.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={aiSettings.temperature}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>0.2 (Rígido)</span>
                      <span>0.7 (Pedagógico i+1)</span>
                      <span>1.0 (Creativo)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LISTA DE TARJETAS DE CADA PROVEEDOR CON DIAGNÓSTICO ENRIQUECIDO */}
              <div className="space-y-4">
                {allProviderKeys.map((providerKey) => {
                  const info = PROVIDER_INFO[providerKey];
                  const config = aiSettings.providers[providerKey];
                  const testResult = testResults[providerKey];
                  const isTesting = testingProvider === providerKey;
                  const isConfigured = Boolean(config?.key && config.key.trim().length > 5);

                  return (
                    <div
                      key={providerKey}
                      className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800/90 hover:border-slate-700 transition space-y-4 shadow-sm"
                    >
                      {/* Header de la Tarjeta */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${info.color} text-slate-950 font-black flex items-center justify-center text-xs shadow-md`}>
                            {info.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-black text-white">{info.name}</h3>
                              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                                {info.badge}
                              </span>
                              {testResult?.success ? (
                                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                  ✓ Conexión Activa ({testResult.latencyMs} ms)
                                </span>
                              ) : isConfigured ? (
                                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 border border-teal-500/30 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> Clave Guardada
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                                  Sin configurar
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{info.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                          <a
                            href={info.dashboardUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline font-bold"
                          >
                            <span>Consola / Ver Saldo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Fila de Input de Key y Selector de Modelo */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-slate-800/80">
                        {/* Campo API Key con Toggle de Visibilidad */}
                        <div className="lg:col-span-7 space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Clave API Secreta (API Key):
                          </label>
                          <div className="relative">
                            <input
                              type={showKeys[providerKey] ? 'text' : 'password'}
                              value={config?.key || ''}
                              onChange={(e) => handleKeyChange(providerKey, e.target.value)}
                              placeholder={`Pega tu clave ${info.placeholder}`}
                              className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                            />
                            <button
                              type="button"
                              onClick={() => setShowKeys(prev => ({ ...prev, [providerKey]: !prev[providerKey] }))}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                              title={showKeys[providerKey] ? 'Ocultar clave' : 'Mostrar clave'}
                            >
                              {showKeys[providerKey] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Selector de Modelo */}
                        <div className="lg:col-span-3 space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Modelo Asignado:
                          </label>
                          <select
                            value={config?.model || info.models[0]?.id}
                            onChange={(e) => handleModelChange(providerKey, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                          >
                            {info.models.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Botón de Probar Conexión */}
                        <div className="lg:col-span-2 flex items-end">
                          <button
                            type="button"
                            disabled={isTesting}
                            onClick={() => handleTestProvider(providerKey)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${isConfigured
                              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                              } disabled:opacity-50`}
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-amber-400' : ''}`} />
                            <span>{isTesting ? 'Probando...' : 'Probar'}</span>
                          </button>
                        </div>
                      </div>

                      {/* DIAGNÓSTICO ENRIQUECIDO (TOKENS, TIER, LÍMITES Y SALDO) */}
                      {testResult && (
                        <div className={`p-3.5 rounded-xl border text-xs space-y-2 animate-in fade-in ${testResult.success
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                          }`}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-bold flex items-center gap-1.5">
                              {testResult.message}
                            </span>
                            {testResult.latencyMs > 0 && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/10 shrink-0 text-white">
                                ⚡ {testResult.latencyMs} ms
                              </span>
                            )}
                          </div>

                          {testResult.quotaInfo && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-[11px] font-mono">
                              {testResult.quotaInfo.tier && (
                                <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">
                                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Nivel / Tier:</span>
                                  <span className="text-white font-bold">{testResult.quotaInfo.tier}</span>
                                </div>
                              )}
                              {testResult.quotaInfo.tokensPerMinute && (
                                <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">
                                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Límite por Minuto (TPM):</span>
                                  <span className="text-teal-300 font-bold">{testResult.quotaInfo.tokensPerMinute}</span>
                                </div>
                              )}
                              {testResult.quotaInfo.remainingCredits && (
                                <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">
                                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Saldo / Créditos Restantes:</span>
                                  <span className="text-amber-300 font-bold">{testResult.quotaInfo.remainingCredits}</span>
                                </div>
                              )}
                              {testResult.quotaInfo.estimatedDailyTokens && (
                                <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20 sm:col-span-2 md:col-span-3">
                                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Capacidad & Rendimiento Estimado:</span>
                                  <span className="text-emerald-300">{testResult.quotaInfo.estimatedDailyTokens}</span>
                                  {testResult.quotaInfo.details && (
                                    <span className="text-slate-400 text-[10px] block mt-0.5">{testResult.quotaInfo.details}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Barra Inferior de Guardado */}
              <div className="p-4 rounded-2xl bg-[#080d16] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Las claves y configuraciones se aplican de inmediato en toda la plataforma Nativa.
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleTestAllProviders}
                    disabled={isBatchTesting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isBatchTesting ? 'animate-spin' : ''}`} />
                    <span>Re-testear Todas</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAiSettings}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Toda la Configuración</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })()}

        {/* ===================================================================
            7. PESTAÑA: CONFIGURACIÓN GLOBAL, PAYWALL Y LICENCIAS B2B (FASE 5)
        =================================================================== */}
        {activeTab === 'GLOBAL_CONFIG' && (() => {
          const filteredRequests = paymentRequests.filter(req => {
            if (paymentFilter === 'ALL') return true;
            return req.status === paymentFilter;
          });

          const pendingCount = paymentRequests.filter(r => r.status === 'pending').length;
          const approvedCount = paymentRequests.filter(r => r.status === 'approved').length;
          const rejectedCount = paymentRequests.filter(r => r.status === 'rejected').length;

          const handleTogglePaywall = () => {
            const next = !paywallEnabled;
            setPaywallEnabled(next);
            AppStorage.setPaywallEnabled(next);
            soundManager.playClick();
            setSaveSuccessNotice(next ? '✓ PAYWALL_ENABLED = ON (Niveles B1-C2 y Call Center bloqueados)' : '✓ PAYWALL_ENABLED = OFF (Modo de pruebas sin bloqueos)');
            setTimeout(() => setSaveSuccessNotice(null), 3500);
          };

          const handleApprovePayment = (id: string) => {
            AppStorage.approvePaymentRequest(id);
            setPaymentRequests(AppStorage.getPaymentRequests());
            soundManager.playLevelUp();
            setSaveSuccessNotice('✓ Pago aprobado: Alumno elevado a estado Premium automáticamente.');
            setTimeout(() => setSaveSuccessNotice(null), 3500);
          };

          const handleRejectPayment = (id: string) => {
            AppStorage.rejectPaymentRequest(id);
            setPaymentRequests(AppStorage.getPaymentRequests());
            soundManager.playWrong();
            setSaveSuccessNotice('Solicitud de pago marcada como rechazada.');
            setTimeout(() => setSaveSuccessNotice(null), 3500);
          };

          const handleCreateLicense = (e: React.FormEvent) => {
            e.preventDefault();
            if (!newCodeInput.trim()) return;
            const created = AppStorage.generateLicenseCode(newCodeInput, newCodeNote, newCodeMax || 100);
            setLicenseCodes(AppStorage.getLicenseCodes());
            setNewCodeInput('');
            setNewCodeNote('');
            soundManager.playVictory();
            setSaveSuccessNotice(`✓ Código de licencia ${created.code} generado con éxito.`);
            setTimeout(() => setSaveSuccessNotice(null), 3500);
          };

          const handleToggleLicense = (code: string) => {
            AppStorage.toggleLicenseCode(code);
            setLicenseCodes(AppStorage.getLicenseCodes());
            soundManager.playClick();
          };

          const handleCopy = (text: string) => {
            navigator.clipboard.writeText(text);
            setCopiedCodeNotice(text);
            soundManager.playClick();
            setTimeout(() => setCopiedCodeNotice(null), 2000);
          };

          return (
            <div className="p-6 md:p-8 space-y-8">

              {/* Cabecera de Configuración Global */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-black text-white tracking-tight">
                      Configuración Global y Paywall Comercial
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Controla el acceso al modelo SaaS de Nativa, aprueba transferencias locales BANPRO y emite licencias B2B.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                    Estado Actual: {paywallEnabled ? <span className="text-amber-400 font-bold">PAYWALL ON</span> : <span className="text-emerald-400 font-bold">PAYWALL OFF (Dev)</span>}
                  </span>
                </div>
              </div>

              {/* SECCIÓN 1: INTERRUPTOR MAESTRO PAYWALL_ENABLED */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1424] to-[#080d18] border-2 border-amber-500/40 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-black text-white uppercase tracking-wider font-mono">
                        Interruptor Maestro: PAYWALL_ENABLED
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Cuando está en <strong className="text-emerald-400">OFF (Desactivado)</strong>, puedes navegar, probar y verificar todos los niveles (A1-C2) y el Track de Call Center sin interrupciones. Cuando se activa en <strong className="text-amber-400">ON</strong>, el sistema bloquea B1-C2 y Call Center exigiendo Nativa Premium.
                    </p>
                  </div>

                  <button
                    onClick={handleTogglePaywall}
                    className={`px-5 py-3 rounded-2xl font-black text-xs transition flex items-center gap-3 cursor-pointer shrink-0 shadow-lg ${paywallEnabled
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                  >
                    {paywallEnabled ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-slate-950" />
                        <span>PAYWALL ACTIVO (ON)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                        <span>MODO PRUEBAS (OFF)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">Acceso Gratuito (Freemium):</span>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Niveles A1 y A2 (18 lecciones completas + vocabulario básico) siempre libres para atraer nuevos alumnos.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 block">Acceso Restringido (Premium):</span>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Niveles B1, B2, C1, C2 y Track Call Center BPO bloqueados si PAYWALL_ENABLED = ON y el alumno no es Premium.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: SOLICITUDES DE PAGO (TRANSFERENCIAS LOCALES BANPRO) */}
              <div className="p-6 rounded-3xl bg-[#090e1a] border border-slate-800 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">
                        Solicitudes de Pago (Transferencias BANPRO / Locales)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comprobantes y minutas enviadas por los alumnos. Al presionar "Aprobar", la cuenta del estudiante pasa a Premium.
                    </p>
                  </div>

                  {/* Filtros de Solicitudes */}
                  <div className="flex items-center gap-1.5 p-1 bg-[#05080f] rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setPaymentFilter('ALL')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${paymentFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Todas ({paymentRequests.length})
                    </button>
                    <button
                      onClick={() => setPaymentFilter('pending')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${paymentFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-amber-300'}`}
                    >
                      Pendientes ({pendingCount})
                    </button>
                    <button
                      onClick={() => setPaymentFilter('approved')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${paymentFilter === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-emerald-300'}`}
                    >
                      Aprobadas ({approvedCount})
                    </button>
                  </div>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#05080f] border border-slate-800/80 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">
                      No hay solicitudes registradas con el filtro actual.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl bg-[#060a12] border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{req.userName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({req.userEmail || req.userId})</span>
                            <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full border ${req.status === 'approved'
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                              : req.status === 'rejected'
                                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                                : 'bg-amber-950/80 border-amber-500/40 text-amber-300 animate-pulse'
                              }`}>
                              {req.status === 'approved' ? '✓ Aprobado' : req.status === 'rejected' ? 'Rechazado' : 'Pendiente de Revisión'}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono flex-wrap">
                            <span>Banco: <strong className="text-slate-200">{req.bankName}</strong></span>
                            <span>Monto: <strong className="text-emerald-400">{req.amount}</strong></span>
                            <span>Fecha: {new Date(req.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[11px] text-slate-500">Referencia:</span>
                            <code className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                              {req.referenceNumber}
                            </code>
                            <button
                              onClick={() => handleCopy(req.referenceNumber)}
                              className="text-slate-500 hover:text-white transition text-xs"
                              title="Copiar referencia"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {req.notes && (
                              <span className="text-[11px] text-slate-400 italic">"{req.notes}"</span>
                            )}
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                          {req.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApprovePayment(req.id)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Aprobar Pago (Activar Premium)</span>
                              </button>
                              <button
                                onClick={() => handleRejectPayment(req.id)}
                                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-bold transition cursor-pointer"
                              >
                                Rechazar
                              </button>
                            </>
                          ) : req.status === 'approved' ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                              <CheckCheck className="w-4 h-4" />
                              <span>Premium Acreditado</span>
                            </div>
                          ) : (
                            <span className="text-xs text-rose-400">Solicitud descartada</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECCIÓN 3: GENERADOR Y GESTOR DE CÓDIGOS B2B */}
              <div className="p-6 rounded-3xl bg-[#090e1a] border border-slate-800 space-y-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-400" />
                    <h3 className="text-base font-bold text-white">
                      Generador de Códigos de Licencia B2B & Convenios
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Genera cupones y licencias corporativas (ej. NATIVA-CALL-2026). Al canjearlos, los alumnos obtienen Premium instantáneo.
                  </p>
                </div>

                {/* Formulario de Emisión */}
                <form onSubmit={handleCreateLicense} className="p-4 rounded-2xl bg-[#060a12] border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold block">
                    Emitir Nuevo Código de Licencia:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        required
                        placeholder="CÓDIGO (ej: NATIVA-CALL-2026)"
                        value={newCodeInput}
                        onChange={(e) => setNewCodeInput(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition font-mono uppercase font-bold"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <input
                        type="text"
                        placeholder="Nota / Convenio (ej: Alianza Call Center BPO)"
                        value={newCodeNote}
                        onChange={(e) => setNewCodeNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        title="Cupo máximo de activaciones"
                        value={newCodeMax}
                        onChange={(e) => setNewCodeMax(parseInt(e.target.value, 10) || 100)}
                        className="w-20 px-3 py-2.5 rounded-xl bg-[#090e1a] border border-slate-800 text-xs text-white text-center font-mono"
                      />
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-md shadow-purple-600/20 cursor-pointer"
                      >
                        Generar
                      </button>
                    </div>
                  </div>
                </form>

                {/* Tabla de Códigos Existentes */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                    Licencias Activas Registradas:
                  </span>
                  {licenseCodes.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-[#060a12] border border-slate-800 space-y-2">
                      <Key className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">
                        Aún no hay códigos de licencia generados. Utiliza el formulario superior para emitir licencias corporativas o convenios B2B.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {licenseCodes.map((lic) => (
                        <div
                          key={lic.code}
                          className="p-4 rounded-2xl bg-[#060a12] border border-slate-800 hover:border-slate-700 transition space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <code className="text-sm font-black font-mono text-purple-300">
                              {lic.code}
                            </code>
                            <button
                              onClick={() => handleCopy(lic.code)}
                              className="text-slate-400 hover:text-white transition"
                              title="Copiar código"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {lic.note || 'Licencia B2B'}
                          </p>

                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[11px] font-mono text-slate-400">
                              <span>Canjes: {lic.currentRedemptions} / {lic.maxRedemptions}</span>
                              <span className={lic.active ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {lic.active ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${Math.min(100, (lic.currentRedemptions / lic.maxRedemptions) * 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <Link
                              href={`/admin/company/${encodeURIComponent(lic.code)}`}
                              className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold hover:underline"
                              title="Ver dashboard y colaboradores de esta empresa"
                            >
                              <span>Dashboard B2B</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            <button
                              onClick={() => handleToggleLicense(lic.code)}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition ${lic.active
                                ? 'text-amber-400 hover:bg-amber-950/40'
                                : 'text-emerald-400 hover:bg-emerald-950/40'
                                }`}
                            >
                              {lic.active ? 'Desactivar' : 'Reactivar'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          );
        })()}
      </main>

      {/* =====================================================================
          MODAL: AÑADIR NUEVO IDIOMA O CURSO ESPECIALIZADO
      ===================================================================== */}
      {isAddLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#090d16] border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {newCourseType === 'specialized' ? (
                  <>
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <span>Añadir Nuevo Curso Especializado</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Añadir Nuevo Idioma General</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => setIsAddLanguageModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cerrar
              </button>
            </div>

            {/* SELECTOR DE TIPO DE CURSO EN EL MODAL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 font-bold block">
                Tipo de Curso / Arquitectura Curricular:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0b101c] border border-slate-700">
                <button
                  type="button"
                  onClick={() => setNewCourseType('general')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${newCourseType === 'general'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Idioma General (A1-C2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewCourseType('specialized')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${newCourseType === 'specialized'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Especializado (4 Módulos)</span>
                </button>
              </div>
            </div>

            {/* FORMULARIO: IDIOMA GENERAL */}
            {newCourseType === 'general' ? (
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
                  💡 Al crear el idioma se generará automáticamente la estructura vacía de 6 niveles (A1 a C2) con 24 nodos listos para editar.
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
                    Crear y Generar Curriculum A1-C2
                  </button>
                </div>
              </form>
            ) : (
              /* FORMULARIO: CURSO ESPECIALIZADO */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateSpecializedTrack();
                }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-amber-400 font-bold block">
                    Nombre del Curso / Track:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Inglés para IT & Cloud, Inglés para Enfermería"
                    value={newTrackName}
                    onChange={(e) => setNewTrackName(e.target.value)}
                    className="w-full bg-[#0b101c] border border-amber-500/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">
                    Industria o Sector Profesional:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Tecnología & Helpdesk, Salud Hospitalaria, Ventas B2B"
                    value={newTrackIndustry}
                    onChange={(e) => setNewTrackIndustry(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 font-bold block">
                      Código Identificador (Slug):
                    </label>
                    <input
                      type="text"
                      placeholder="ej. it, nursing, sales"
                      value={newTrackSlug}
                      onChange={(e) => setNewTrackSlug(e.target.value)}
                      className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 font-bold block">
                      Nivel Objetivo:
                    </label>
                    <select
                      value={newTrackLevel}
                      onChange={(e) => setNewTrackLevel(e.target.value)}
                      className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="B1 - B2 Profesional">B1 - B2 Profesional</option>
                      <option value="B2 - C1 Avanzado">B2 - C1 Avanzado</option>
                      <option value="A2 - B1 Básico/Intermedio">A2 - B1 Básico/Intermedio</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-300 space-y-1">
                  <div className="font-bold">⚡ Generación Automática de 4 Fases:</div>
                  <div className="text-slate-300 text-[10px]">
                    1. Primer Contacto • 2. Procedimientos y Resolución • 3. Casos Complejos y Negociación • 4. Entrega y Cierre.
                  </div>
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:opacity-95 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  >
                    Crear Track y Generar 4 Fases
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
