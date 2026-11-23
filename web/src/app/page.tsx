'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Brain, 
  Headphones, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Check, 
  X,
  Play, 
  Gift, 
  ChevronRight, 
  Star, 
  Phone, 
  Briefcase, 
  Layers, 
  Target, 
  Globe2, 
  Lock, 
  HeartHandshake, 
  Award,
  Users,
  Compass,
  LayoutDashboard
} from 'lucide-react';
import { FluentiaLogo, NativaLogo } from '@/components/fluentia-logo';
import { soundManager } from '@/lib/sound-effects';
import { AuthModal } from '@/components/auth-modal';
import { AppStorage, UserProfile } from '@/lib/storage';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

export default function PublicLandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Verificar si hay sesión activa para mostrar botón al Dashboard
  useEffect(() => {
    setSoundEnabled(soundManager.enabled);

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserProfile(AppStorage.getUserProfile());
        } else {
          const localSess = typeof window !== 'undefined' ? localStorage.getItem('fluentia_user_session') : null;
          setIsAuthenticated(Boolean(localSess));
          if (localSess) setUserProfile(AppStorage.getUserProfile());
        }
      });
    } else {
      const localSess = typeof window !== 'undefined' ? localStorage.getItem('fluentia_user_session') : null;
      setIsAuthenticated(Boolean(localSess));
      if (localSess) setUserProfile(AppStorage.getUserProfile());
    }
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    soundManager.playClick();
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    AppStorage.saveSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  const studentName = useMemo(() => {
    if (!userProfile) return 'Aventurero';
    if (userProfile.name && userProfile.name !== 'Estudiante' && !userProfile.name.includes('@')) {
      return userProfile.name.split(' ')[0];
    }
    return 'Aventurero';
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden font-sans">
      
      {/* Fondo Gamer Nebular */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),rgba(6,182,212,0.06),transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,158,11,0.07),rgba(139,92,246,0.05),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-10 -left-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* =====================================================================
          HEADER PÚBLICO
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <FluentiaLogo size="md" />
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <a 
              href="#metodo" 
              className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-slate-800/60 transition"
            >
              El Método Krashen
            </a>
            <a 
              href="#tracks" 
              className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-slate-800/60 transition"
            >
              Rutas & Tracks
            </a>
            <a 
              href="#comparativa" 
              className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-slate-800/60 transition"
            >
              Nativa vs Otros
            </a>
            <a 
              href="#precios" 
              className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-slate-800/60 transition"
            >
              Planes
            </a>
          </nav>
        </div>

        {/* Acciones de Autenticación / Acceso al Dashboard */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Alternar Sonido */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido Zen'}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {isAuthenticated ? (
            /* USUARIO CONECTADO -> BOTÓN DIRECTO AL DASHBOARD */
            <Link
              href="/dashboard"
              onClick={() => soundManager.playClick()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 border border-emerald-300/40 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ir a mi Panel ({studentName})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            /* USUARIO VISITANTE -> LOGIN & REGISTRO */
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5 border border-emerald-300/40 cursor-pointer"
              >
                <span>Empezar Gratis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================================
          SECCIÓN 1: HERO (EL GANCHO PRINCIPAL)
      ===================================================================== */}
      <section className="relative px-4 sm:px-8 pt-12 pb-20 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        
        {/* Badge Metodológico Krashen */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-md shadow-emerald-950/40 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Método de Adquisición Natural (SLA) • Stephen Krashen</span>
        </div>

        {/* Gran Título de Impacto */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
          Adquiere inglés real <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            sin traducir mentalmente.
          </span>
        </h1>

        {/* Subtítulo Claro y Conciso */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
          Aprende exactamente como adquiriste tu lengua materna: mediante <strong className="text-white font-semibold">Input Comprensible (i+1)</strong>, inmersión contextual profunda y un filtro afectivo libre de ansiedad.
        </p>

        {/* Botones de Acción Hero */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              onClick={() => soundManager.playClick()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 group border border-emerald-300/40 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Continuar en mi Panel de Estudio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={() => openAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 group border border-emerald-300/40 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Comenzar Ahora Gratis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          )}

          <a
            href="#metodo"
            onClick={() => soundManager.playClick()}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver cómo funciona el método</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </a>
        </div>

        {/* 3 Promesas Clave del Método */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl text-left">
          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Cero Gramática Aislada</p>
              <p className="text-slate-400">Adquisición natural por contexto.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Memoria a Largo Plazo</p>
              <p className="text-slate-400">Algoritmo SRS SM-2 integrado.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Track Call Center BPO</p>
              <p className="text-slate-400">Inglés laboral de alta demanda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 2: EL MÉTODO KRASHEN (SLA)
      ===================================================================== */}
      <section id="metodo" className="relative px-4 sm:px-8 py-20 max-w-6xl mx-auto w-full border-t border-slate-900">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300">
            <Brain className="w-3.5 h-3.5" />
            <span>Fundamentos de Lingüística Aplicada</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Por qué memorizar reglas no te da fluidez
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Según la hipótesis de Stephen Krashen (Universidad del Sur de California), los humanos no aprenden idiomas estudiando reglas sintácticas, sino mediante la <strong className="text-slate-200">adquisición subconsciente</strong> a través de mensajes comprensibles.
          </p>
        </div>

        {/* 4 Pilares de Nativa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pilar 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070e1b] to-[#050a14] border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Pilar 01</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Input Comprensible (i + 1)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cada lección está calibrada exactamente un nivel por encima de tu capacidad actual ($i$). Entiendes el 90% por el contexto y tu cerebro asimila el 10% nuevo de forma intuitiva, sin necesidad de traducir al español.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070e1b] to-[#050a14] border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">Pilar 02</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Filtro Afectivo Zen</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              La ansiedad y el estrés bloquean los centros del lenguaje en el cerebro. En Nativa <strong className="text-slate-200">no pierdes vidas</strong>, no hay temporizadores de pánico ni castigos. Creas confianza a tu propio ritmo.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070e1b] to-[#050a14] border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">Pilar 03</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Repetición Espaciada (SRS SM-2)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Combatimos la curva del olvido de Ebbinghaus. Las palabras y expresiones clave reaparecen en tus repasos justo cuando están a punto de desaparecer de tu memoria activa, consolidándolas para siempre.
            </p>
          </div>

          {/* Pilar 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070e1b] to-[#050a14] border border-slate-800 hover:border-teal-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-teal-400 font-bold uppercase">Pilar 04</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">TBLT (Task-Based Language Teaching)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Aprender haciendo. Cada nodo termina con un desafío comunicativo real: simular una llamada de atención al cliente, redactar un correo profesional o defender un argumento universitario.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 3: COMPARATIVA (NATIVA VS APPS TRADICIONALES)
      ===================================================================== */}
      <section id="comparativa" className="relative px-4 sm:px-8 py-20 max-w-5xl mx-auto w-full border-t border-slate-900">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ¿Por qué Nativa no es otro Duolingo?
          </h2>
          <p className="text-sm text-slate-400">
            Comparamos el enfoque científico de adquisición contra las tácticas de retención superficial de las aplicaciones comerciales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Apps Tradicionales */}
          <div className="p-6 rounded-3xl bg-rose-950/15 border border-rose-900/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <X className="w-5 h-5 shrink-0" />
              <span>Apps Tradicionales & Gamificación Tóxica</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✕</span>
                <span>Frases absurdas aisladas como <em>"La manzana es verde"</em> sin contexto real.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✕</span>
                <span>Sistema punitivo de corazones/vidas que castiga equivocarse y genera frustración.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✕</span>
                <span>Traducción literal constante que fomenta la traducción mental al hablar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✕</span>
                <span>Sin preparación para el mundo laboral ni inglés para llamadas o empresas.</span>
              </li>
            </ul>
          </div>

          {/* Nativa SLA */}
          <div className="p-6 rounded-3xl bg-emerald-950/25 border border-emerald-500/40 space-y-4 shadow-lg shadow-emerald-950/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Nativa • Adquisición Natural SLA</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Lecturas inmersivas con historias universitarias y corporativas ricas en contexto.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Vidas ilimitadas: el error es el motor de adquisición natural del cerebro.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Audio TTS fonético con acento nativo y reconocimiento de voz (Shadowing).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Tracks de especialización profesional inmediata (Call Center BPO & Negocios).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 4: LOS TRACKS DISPONIBLES
      ===================================================================== */}
      <section id="tracks" className="relative px-4 sm:px-8 py-20 max-w-6xl mx-auto w-full border-t border-slate-900">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
            <Compass className="w-3.5 h-3.5" />
            <span>Rutas Profesionales</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Diseñado para tus metas específicas
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Elige la ruta que necesitas: dominar el idioma desde cero o prepararte para conseguir un empleo en la industria BPO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* TRACK 1: INGLÉS GENERAL A1 - C2 */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#081220] to-[#040913] border border-emerald-500/30 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-2xl">
                  🇬🇧
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-bold">
                  24 Nodos • A1 a C2
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ruta General Universitaria
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                El mapa integral de fluidez. Desde tus primeras interacciones cotidianas hasta la redacción y debate formal de nivel avanzado. Incluye lecturas inmersivas, práctica auditiva y el mapa serpenteante de aprendizaje.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24 Nodos temáticos progresivos basados en MCER</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Inmersión con cuentos, artículos y diálogos guiados</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Test de Nivelación inicial para saltar directo a tu nivel</span>
                </div>
              </div>
            </div>

            <Link
              href={isAuthenticated ? "/learn/english" : "#"}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  openAuth('register');
                } else {
                  soundManager.playClick();
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Abrir Ruta General' : 'Comenzar Nivel A1'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TRACK 2: CALL CENTER BPO */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1107] via-[#0f0c08] to-[#080706] border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Headphones className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold">
                  Especialización Laboral
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Track Call Center & BPO Pro
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Capacitación intensiva en el vocabulario, métricas y situaciones reales de atención telefónica internacional. Aprende a manejar clientes difíciles, reducir AHT y aumentar tu CSAT en inglés.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>De-escalation: Manejo de clientes furiosos con empatía</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Métricas reales de la industria: CSAT, AHT, FCR y QA</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Simulación de llamadas con guiones en tiempo real</span>
                </div>
              </div>
            </div>

            <Link
              href={isAuthenticated ? "/learn/english/call-center" : "#"}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  openAuth('register');
                } else {
                  soundManager.playClick();
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Abrir Track Call Center' : 'Prepararme para Call Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 5: PLANES Y PRECIOS
      ===================================================================== */}
      <section id="precios" className="relative px-4 sm:px-8 py-20 max-w-6xl mx-auto w-full border-t border-slate-900">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
            <Award className="w-3.5 h-3.5" />
            <span>Precios Transparentes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Comienza gratis. Pasa a Pro cuando quieras acelerar.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Sin suscripciones trampa ni cancelaciones difíciles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* PLAN 1: EXPLORADOR (GRATIS) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">Plan Gratuito</span>
              <h3 className="text-xl font-black text-white">Explorador</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$0</span>
                <span className="text-xs text-slate-400">para siempre</span>
              </div>
              <p className="text-xs text-slate-400">
                Ideal para comenzar tu rutina diaria y experimentar el método de Krashen.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Acceso a Niveles A1 y A2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>3 Palabras Diarias (Cofre Daily Drop)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Misiones de estudio diarias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Vidas ilimitadas (Cero ansiedad)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openAuth('register')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Empezar Gratis
            </button>
          </div>

          {/* PLAN 2: NATIVA PRO (DESTACADO) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#071926] via-[#05111b] to-[#030911] border-2 border-emerald-400/80 shadow-2xl shadow-emerald-500/20 relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
              Recomendado
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Acceso Completo</span>
              <h3 className="text-xl font-black text-white">Nativa PRO</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$9.99</span>
                <span className="text-xs text-slate-400">/ mes</span>
              </div>
              <p className="text-xs text-slate-300">
                La experiencia definitiva con todos los niveles y la especialización laboral completa.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span><strong className="text-white">Todos los Niveles:</strong> A1, A2, B1, B2, C1 y C2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span><strong className="text-white">Track BPO Call Center Pro</strong> completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Audio TTS fonético con acento nativo US & UK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Reconocimiento de voz para Shadowing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Certificado digital de nivel alcanzado</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openAuth('register')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              Obtener Nativa PRO
            </button>
          </div>

          {/* PLAN 3: BPO ENTERPRISE & ACADEMIAS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">Empresas & Escuelas</span>
              <h3 className="text-xl font-black text-white">BPO & Universidades</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">A Medida</span>
              </div>
              <p className="text-xs text-slate-400">
                Para centros de contacto o instituciones educativas que buscan capacitar equipos masivamente.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Licencias masivas para agentes o estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Panel CPanel administrativo con analíticas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Pruebas de nivelación inicial automatizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Soporte prioritario y SLA corporativo</span>
                </div>
              </div>
            </div>

            <a
              href="mailto:ventas@nativa.edu?subject=Consulta%20Institucional%20Nativa"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition text-center block cursor-pointer"
            >
              Contactar a Ventas
            </a>
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 6: CTA FINAL
      ===================================================================== */}
      <section className="relative px-4 sm:px-8 py-20 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#061421] to-[#040810] border border-emerald-500/30 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            ¿Listo para adquirir tu inglés de forma definitiva?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Únete a cientos de estudiantes que han dejado atrás la frustración de traducir mentalmente gracias al método natural de Krashen.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openAuth('register')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-500/30 inline-flex items-center gap-2.5 border border-emerald-300/40 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Crear mi Cuenta Gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FOOTER PÚBLICO
      ===================================================================== */}
      <footer className="border-t border-slate-800/80 bg-[#03060c] px-4 sm:px-8 py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FluentiaLogo size="sm" />
            <span>• Plataforma de Adquisición Natural de Lenguas</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#metodo" className="hover:text-slate-300 transition">El Método</a>
            <a href="#tracks" className="hover:text-slate-300 transition">Tracks</a>
            <a href="#precios" className="hover:text-slate-300 transition">Precios</a>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-emerald-400 font-bold hover:underline">
                Mi Panel de Estudio
              </Link>
            )}
            <Link href="/admin" className="text-slate-600 hover:text-slate-400 transition" title="Portal de Administración">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* MODAL DE AUTENTICACIÓN (LOGIN / REGISTRO) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(profile) => {
          setIsAuthenticated(true);
          setUserProfile(AppStorage.getUserProfile());
        }}
      />

    </div>
  );
}
