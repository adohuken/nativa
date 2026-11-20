'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Headphones, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  GraduationCap, 
  Layers, 
  Clock, 
  Brain, 
  Volume2, 
  VolumeX, 
  Compass,
  Star,
  ShieldCheck,
  Check,
  Phone,
  Briefcase,
  Code
} from 'lucide-react';
import { FluentiaLogo, NativaLogo } from '@/components/fluentia-logo';
import { LANGUAGES_REGISTRY, LanguageHubEntry, getAllLanguages } from '@/content/course-content';
import { AppStorage, UserProfile } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { UserProfileModal } from '@/components/user-profile-modal';
import { APP_NAME } from '@/lib/config';

export default function FluentiaDashboardPage() {
  const [streakDays, setStreakDays] = useState<number>(2);
  const [userXp, setUserXp] = useState<number>(140);
  const [immersionMinutes, setImmersionMinutes] = useState<number>(15);
  const [completedEnglishNodes, setCompletedEnglishNodes] = useState<string[]>(['a1-lesson-1']);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeLang, setActiveLang] = useState<string>('english');
  const [languages, setLanguages] = useState<Record<string, LanguageHubEntry>>(LANGUAGES_REGISTRY);

  // Perfil de Usuario
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => AppStorage.getUserProfile());

  useEffect(() => {
    const savedStreak = AppStorage.getStreak('english');
    const savedXp = AppStorage.getXp('english');
    const savedImmersion = AppStorage.getImmersionMinutes('english');
    const savedNodes = AppStorage.getCompletedNodes('english');
    const savedSound = AppStorage.getSoundEnabled();
    const currentLang = AppStorage.getActiveLanguage();
    const allLangs = getAllLanguages();
    const profile = AppStorage.getUserProfile();

    setStreakDays(savedStreak);
    setUserXp(savedXp);
    setImmersionMinutes(savedImmersion);
    setCompletedEnglishNodes(savedNodes);
    setSoundEnabled(savedSound);
    setActiveLang(currentLang || 'english');
    setLanguages(allLangs);
    setUserProfile(profile);
    soundManager.enabled = savedSound;
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    AppStorage.saveSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  const englishProgressPct = Math.min(100, Math.round((completedEnglishNodes.length / 24) * 100));

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Glow ambiental superior */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-950/20 via-teal-950/10 to-transparent pointer-events-none -z-10" />

      {/* =====================================================================
          HEADER DEL DASHBOARD
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FluentiaLogo size="md" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Language Hub
          </span>
        </div>

        {/* Métricas Globales del Estudiante (Línea Horizontal Compacta) + Perfil */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#0b101c] border border-slate-800/90 text-xs font-mono shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-400" title="Racha de estudio">
              <Flame className="w-4 h-4 fill-current" />
              <span className="font-bold">{streakDays}d</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400" title="Experiencia total">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-bold">{userXp} XP</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-teal-300" title="Minutos de inmersión acumulados">
              <Headphones className="w-4 h-4" />
              <span className="font-bold">{immersionMinutes}m</span>
            </div>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonido Zen'}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Botón de Perfil de Usuario con Foto / Avatar */}
          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              soundManager.playClick();
            }}
            className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-[#0b101c] hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition group shadow-sm"
            title="Abrir Mi Perfil de Estudiante"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center shrink-0 text-base shadow-sm">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{userProfile.avatarEmoji || '👨‍🎓'}</span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition">{userProfile.name}</span>
              <span className="text-[10px] font-mono text-emerald-400">@{userProfile.username}</span>
            </div>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN CONTAINER
      ===================================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-10">
        
        {/* HERO SECTION: CONTINUAR APRENDIENDO */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0a1424] via-[#09111e] to-[#060a12] border-2 border-emerald-500/30 shadow-2xl">
          {/* Luz de fondo */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Plataforma de Adquisición Natural de Lenguas (SLA)</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                ¡Hola de nuevo, {userProfile.name.split(' ')[0]}! Continúa tu inmersión hoy.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Adquiere fluidez real mediante input comprensible (<span className="text-emerald-300 font-bold font-mono">i+1</span>), lecturas guiadas en contexto universitario y un filtro afectivo libre de ansiedad.
              </p>

              {/* Estadísticas de Inglés en Curso */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-base">🇬🇧</span> <strong>Inglés (English):</strong> Nivel A1 Elemental
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  {completedEnglishNodes.length} de 24 Nodos completados ({englishProgressPct}%)
                </span>
              </div>
            </div>

            {/* Botón Principal Grande de Acción */}
            <Link
              href="/learn/english"
              onClick={() => soundManager.playClick()}
              className="w-full md:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-base transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 group active:scale-95 shrink-0"
            >
              <span>Continuar aprendiendo Inglés</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* =====================================================================
            CURSOS ESPECIALIZADOS (SPECIALIZED TRACKS)
        ===================================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Cursos Especializados • Professional Tracks
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Especialízate en inglés para sectores profesionales de alta demanda con escenarios de inmersión técnica y situaciones reales de trabajo.
              </p>
            </div>

            <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              1 Track Activo • Call Center
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tarjeta 1: CALL CENTER ENGLISH (ACTIVO) */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#120e06] via-[#0f0c08] to-[#070b14] border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400 transition-all">
              {/* Brillo de acento */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/25 transition-colors" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300">
                    BPO & Soporte
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    Call Center English
                  </h3>
                  <p className="text-xs font-medium text-amber-400/90 font-mono mt-0.5">
                    Call Center & Customer Service Pro
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Apertura de llamadas, verificación de cuenta, escucha activa, desescalada de clientes difíciles, transferencias cálidas y métricas CSAT/FCR.
                </p>

                {/* Resumen de Módulos */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-black/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Estructura:</span>
                    <strong className="text-amber-300">4 Módulos</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Nivel:</span>
                    <strong className="text-orange-300">B1 - B2 Pro</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">1. Primer Contacto</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">2. Resolución</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">3. Cliente Difícil</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">4. Soporte & Cierre</span>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/learn/english/call-center"
                  onClick={() => soundManager.playClick()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 hover:opacity-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Iniciar Ruta de Call Center</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Tarjeta 2: IT & TECH SUPPORT ENGLISH (PRÓXIMAMENTE) */}
            <div className="rounded-3xl p-6 bg-[#080d16]/70 border border-slate-800/80 opacity-80 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-cyan-400 flex items-center justify-center text-2xl border border-slate-700">
                    <Code className="w-7 h-7" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                    Próximamente
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">IT & Tech Support English</h3>
                  <p className="text-xs font-mono text-cyan-400 mt-0.5">Software, Cloud & Helpdesk</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Documentación de bugs, standups ágiles, soporte de infraestructura en la nube y comunicación con ingenieros de software globales.
                </p>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                  <span>En desarrollo • cPanel Especializaciones</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-2xl bg-slate-800/60 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-800"
                >
                  <span>Próximamente en Nativa</span>
                </button>
              </div>
            </div>

            {/* Tarjeta 3: BUSINESS & SALES ENGLISH (PRÓXIMAMENTE) */}
            <div className="rounded-3xl p-6 bg-[#080d16]/70 border border-slate-800/80 opacity-80 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-teal-400 flex items-center justify-center text-2xl border border-slate-700">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                    Próximamente
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Sales & Negotiation English</h3>
                  <p className="text-xs font-mono text-teal-400 mt-0.5">B2B Sales & Closing Deals</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Pitch comercial, manejo de objeciones de precios, llamadas en frío (cold calls) y presentaciones ejecutivas de alto impacto.
                </p>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                  <span>En desarrollo • cPanel Especializaciones</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-2xl bg-slate-800/60 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-800"
                >
                  <span>Próximamente en Nativa</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            LANGUAGE HUB (SELECTOR DE IDIOMAS)
        ===================================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-teal-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Language Hub • Selector de Idiomas
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Elige el idioma en el que deseas formarte. Tu progreso, vocabulario SRS y minutos de exposición se guardan de forma independiente.
              </p>
            </div>

            <span className="text-xs font-mono text-slate-400 bg-[#0b101c] border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto font-bold">
              1 Activo • 4 Próximamente
            </span>
          </div>

          {/* Grilla de Tarjetas de Idiomas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(languages).map((lang) => {
              const isActive = lang.status === 'active';

              return (
                <div
                  key={lang.id}
                  className={`relative rounded-3xl p-6 transition flex flex-col justify-between border-2 overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-[#0c1626] to-[#070b13] border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-950/20'
                      : 'bg-[#090d16]/70 border-slate-800/80 hover:border-slate-700/80 opacity-80'
                  }`}
                >
                  {/* Glow sutil en la tarjeta activa */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    {/* Header de la Tarjeta */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-1 rounded-2xl bg-slate-900 border border-slate-800">
                          {lang.flag}
                        </span>
                        <div>
                          <h3 className="text-lg font-black text-white">
                            {lang.name}
                          </h3>
                          <span className="text-xs font-mono text-slate-400">
                            {lang.nativeName}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isActive
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        {lang.badgeText}
                      </span>
                    </div>

                    {/* Tagline & Descripción */}
                    <div className="space-y-1">
                      <strong className="text-xs text-slate-200 block font-semibold">
                        {lang.tagline}
                      </strong>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang.description}
                      </p>
                    </div>

                    {/* Barra de progreso si está activo */}
                    {isActive ? (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-mono font-bold">
                          <span className="text-slate-400">Progreso del Plan</span>
                          <span className="text-emerald-400">{englishProgressPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${englishProgressPct}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Estructura curricular de 6 niveles lista para inyección</span>
                      </div>
                    )}
                  </div>

                  {/* Botón de Acción Inferior */}
                  <div className="pt-6">
                    {isActive ? (
                      <Link
                        href={`/learn/${lang.id}`}
                        onClick={() => soundManager.playClick()}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group active:scale-95"
                      >
                        <span>Entrar a la Ruta de Aprendizaje</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Próximamente (Coming Soon)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            PILARES PEDAGÓGICOS SLA (KRASHEN COGNITIVE ARCHITECTURE)
        ===================================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#080d16] border border-slate-800/90 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-outfit">
              Arquitectura de Aprendizaje {APP_NAME} (Krashen SLA)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                1. Input Comprensible i+1
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adquieres la lengua comprendiendo significados contextuales sin memorización forzada de tablas gramaticales aisladas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                2. Filtro Afectivo Zen
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cero vidas punitivas, cero frustración. El error es una etapa natural del procesamiento lingüístico cerebral.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-cyan-400" />
                3. Tríada de Inmersión
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada lección desbloquea lectura guiada con click-to-define, escucha pasiva nativa y consolidación con repetición espaciada SRS.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs font-mono text-slate-500">
        {APP_NAME} • Ecosistema Multi-Idioma de Adquisición de Segundas Lenguas (SLA) • 2026
      </footer>

      {/* Modal de Perfil de Usuario Completo */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
        streakDays={streakDays}
        userXp={userXp}
        immersionMinutes={immersionMinutes}
      />

    </div>
  );
}
