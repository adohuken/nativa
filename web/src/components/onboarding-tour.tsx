'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check, 
  Compass, 
  Flame, 
  Headphones, 
  Gift, 
  HelpCircle,
  Play
} from 'lucide-react';
import { soundManager } from '@/lib/sound-effects';

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  text: string;
  targetSelector?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export const PATH_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    stepNumber: 1,
    totalSteps: 6,
    badge: '¡Bienvenido a Nativa!',
    title: 'Adquisición Natural de Inglés',
    text: 'Tu cerebro está a punto de adquirir inglés de forma natural sin traducir mentalmente. Te guiaremos paso a paso por tu mapa de aprendizaje.',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'profile-stats',
    stepNumber: 2,
    totalSteps: 6,
    badge: 'Perfil y Progreso',
    title: 'Tu Perfil y Estadísticas',
    text: 'Aquí ves tu nombre, tu nivel actual (A1 a C2), tus días de racha continua, puntos de experiencia (XP) y minutos de inmersión acumulados.',
    targetSelector: '[data-tour="tour-profile-stats"]',
    icon: <Flame className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'daily-practice',
    stepNumber: 3,
    totalSteps: 6,
    badge: 'Hábitos Diarios',
    title: 'Práctica Diaria',
    text: 'Cumple tus 3 objetivos diarios: 3 Términos de vocabulario, Repaso Espaciado (SRS) e Inmersión Auditiva para acelerar tu adquisición.',
    targetSelector: '[data-tour="tour-daily-practice"]',
    icon: <Gift className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'level-filters',
    stepNumber: 4,
    totalSteps: 6,
    badge: 'Marco Europeo (MCER)',
    title: 'Filtros de Niveles A1 → C2',
    text: 'Tu camino sigue el Marco Común Europeo (MCER). Puedes explorar y filtrar los módulos desde A1 Fundamentos hasta C2 Maestría.',
    targetSelector: '[data-tour="tour-level-filters"]',
    icon: <Compass className="w-5 h-5 text-teal-400" />
  },
  {
    id: 'unit-banner',
    stepNumber: 5,
    totalSteps: 6,
    badge: 'Módulo Curricular',
    title: 'Unidad y Proyecto Real',
    text: 'Cada unidad aborda un reto comunicativo real. Al terminar sus lecciones, presentarás un proyecto práctico evaluado con inteligencia artificial.',
    targetSelector: '[data-tour="tour-unit-banner"]',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'first-node',
    stepNumber: 6,
    totalSteps: 6,
    badge: 'Punto de Inicio',
    title: 'Tu Primer Nodo de Aventura',
    text: '¡Este es tu punto de partida! Haz clic en este nodo circular para iniciar tu primera inmersión sonora con historias y práctica guiada.',
    targetSelector: '[data-tour="tour-first-node"]',
    icon: <Play className="w-5 h-5 text-emerald-400" />
  }
];

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    stepNumber: 1,
    totalSteps: 6,
    badge: '¡Bienvenido a Nativa!',
    title: 'Adquisición Natural de Inglés',
    text: '¡Bienvenido a Nativa! Tu cerebro está a punto de adquirir inglés de forma natural. Te mostraremos cómo funciona todo en 1 minuto.',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'header-stats',
    stepNumber: 2,
    totalSteps: 6,
    badge: 'Progreso y Hábitos',
    title: 'El Perfil y Stats',
    text: 'Aquí ves tu racha, tus XP y tu nivel actual. ¡Mantén la racha encendida todos los días!',
    targetSelector: '[data-tour="tour-header-stats"]',
    icon: <Flame className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'map-general',
    stepNumber: 3,
    totalSteps: 6,
    badge: 'Tu Aventura Principal',
    title: 'El Mapa de Aventura',
    text: 'Este es tu camino. Cada círculo es una lección. Haz clic aquí para empezar tu primera inmersión sonora.',
    targetSelector: '[data-tour="tour-btn-general"]',
    icon: <Play className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'daily-words',
    stepNumber: 4,
    totalSteps: 6,
    badge: 'Vocabulario Diario',
    title: 'El Cofre Diario',
    text: 'Abre este cofre cada día. Te dará 3 palabras nuevas que se guardarán en tu memoria a largo plazo.',
    targetSelector: '[data-tour="tour-daily-words"]',
    icon: <Gift className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'daily-missions',
    stepNumber: 5,
    totalSteps: 6,
    badge: 'Retos Gamificados',
    title: 'Misiones de Hoy',
    text: 'Completa estos 3 retos diarios para ganar XP extra y subir de nivel más rápido.',
    targetSelector: '[data-tour="tour-daily-missions"]',
    icon: <Compass className="w-5 h-5 text-teal-400" />
  },
  {
    id: 'call-center',
    stepNumber: 6,
    totalSteps: 6,
    badge: 'Especialización BPO',
    title: 'Ruta Call Center BPO',
    text: '¿Quieres trabajar en atención al cliente? Esta ruta especializada te prepara para entrevistas y llamadas reales.',
    targetSelector: '[data-tour="tour-btn-callcenter"]',
    icon: <Headphones className="w-5 h-5 text-amber-400" />
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  mode?: 'path' | 'dashboard';
  customSteps?: TourStep[];
}

interface TargetRect {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function OnboardingTour({ isOpen, onClose, onComplete, mode = 'path', customSteps }: OnboardingTourProps) {
  const steps = customSteps || (mode === 'path' ? PATH_TOUR_STEPS : DASHBOARD_TOUR_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const step = steps[currentStepIndex];

  // Actualizar rectángulo del elemento objetivo
  const updateTargetRect = useCallback(() => {
    if (typeof window === 'undefined') return;

    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    if (!step?.targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(step.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right
      });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Manejar el cambio de paso y scroll suave al elemento
  useEffect(() => {
    if (!isOpen) return;

    if (step?.targetSelector) {
      const el = document.querySelector(step.targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    const timer = setTimeout(() => {
      updateTargetRect();
    }, 150);

    const handleResize = () => updateTargetRect();
    const handleScroll = () => updateTargetRect();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, currentStepIndex, step, updateTargetRect]);

  // Reiniciar paso al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      try {
        soundManager.playClick();
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen || !step) return null;

  const handleNext = () => {
    try {
      soundManager.playClick();
    } catch {}

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      try {
        soundManager.playVictory();
      } catch {}
      onComplete();
    }
  };

  const handlePrev = () => {
    try {
      soundManager.playClick();
    } catch {}

    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    try {
      soundManager.playClick();
    } catch {}
    onClose();
  };

  // Dimensiones del foco
  const padding = 12;
  const isCentered = !step.targetSelector || !targetRect;

  // Calcular coordenadas de la tarjeta del globo
  const cardWidth = Math.min(420, windowDimensions.width - 32);
  let cardTop = 0;
  let cardLeft = 0;

  if (targetRect) {
    // Si el elemento objetivo está dentro del sidebar izquierdo (ancho <= 320px) en pantallas medianas/grandes
    if (targetRect.right <= 340 && windowDimensions.width > 860) {
      cardLeft = Math.min(windowDimensions.width - cardWidth - 24, targetRect.right + 24);
      cardTop = Math.max(24, Math.min(windowDimensions.height - 320, targetRect.top));
    } else {
      cardLeft = Math.max(16, Math.min(windowDimensions.width - cardWidth - 16, targetRect.left + (targetRect.width / 2) - (cardWidth / 2)));
      
      // Decidir si colocar arriba o abajo del objetivo
      const spaceBelow = windowDimensions.height - targetRect.bottom;
      const spaceAbove = targetRect.top;

      if (spaceBelow >= 260 || spaceBelow > spaceAbove) {
        cardTop = targetRect.bottom + 16;
      } else {
        cardTop = Math.max(20, targetRect.top - 240);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] select-none">
      {/* CAPA TRANSPARENTE BLOQUEADORA DE CLICS EXTERNOS */}
      <div 
        className="fixed inset-0 z-[101] bg-transparent" 
        onClick={(e) => {
          e.stopPropagation();
        }} 
      />

      {/* SVG SPOTLIGHT CON MÁSCARA TRANSPARENTE */}
      <svg 
        className="fixed inset-0 w-full h-full z-[102] pointer-events-none transition-all duration-300"
        style={{ width: '100vw', height: '100vh' }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* Fondo blanco: todo es opaco por defecto */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            
            {/* Rectángulo negro recortado: deja ver el elemento de fondo con esquinas redondeadas */}
            {targetRect && (
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="20"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Máscara oscura al 75% de opacidad */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(3, 7, 18, 0.75)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* ANILLO DE LUZ PULSANTE ALREDEDOR DEL ELEMENTO ILUMINADO */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-[103] rounded-[20px] border-2 border-emerald-400/90 shadow-[0_0_35px_rgba(16,185,129,0.55),inset_0_0_15px_rgba(16,185,129,0.25)] animate-pulse transition-all duration-300"
          style={{
            left: targetRect.left - padding,
            top: targetRect.top - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
        />
      )}

      {/* GLOBO DE TEXTO (TOOLTIP CARD) */}
      <div 
        className="fixed z-[105]"
        style={
          isCentered
            ? {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: cardWidth
              }
            : {
                top: cardTop,
                left: cardLeft,
                width: cardWidth
              }
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="rounded-3xl bg-[#090f1d] border border-emerald-500/40 p-6 sm:p-7 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl text-slate-100 flex flex-col space-y-4 relative overflow-hidden"
          >
            {/* Brillo ambiental dentro de la tarjeta */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* HEADER DE LA TARJETA */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono font-black text-emerald-300 tracking-wider">
                  Paso {step.stepNumber} de {step.totalSteps}
                </span>
                {step.badge && (
                  <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400">
                    • {step.badge}
                  </span>
                )}
              </div>

              {/* Botón Cerrar / Saltar */}
              <button
                onClick={handleSkip}
                className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-800 cursor-pointer"
                title="Cerrar tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  {step.icon || <Sparkles className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="text-lg font-black text-white leading-tight">
                  {step.title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal pt-1">
                {step.text}
              </p>
            </div>

            {/* INDICADOR DE PASOS (DOTS) */}
            <div className="flex items-center gap-1.5 py-1 relative z-10">
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'w-7 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : idx < currentStepIndex
                      ? 'w-2 bg-emerald-700/60'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* BOTONES DE NAVEGACIÓN */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80 relative z-10">
              <button
                onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-slate-200 font-semibold px-2 py-1.5 transition cursor-pointer"
              >
                Saltar Tour
              </button>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer"
                >
                  <span>
                    {currentStepIndex === steps.length - 1 ? '¡Empezar a Estudiar!' : 'Siguiente'}
                  </span>
                  {currentStepIndex === steps.length - 1 ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
