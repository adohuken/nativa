import React from 'react';
import { APP_NAME } from '@/lib/config';

interface NativaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtext?: boolean;
  className?: string;
}

export function NativaGlyph({ size = 'md', className = '' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dim = sizeMap[size] || 'w-10 h-10';

  return (
    <div className={`relative ${dim} shrink-0 ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/35 via-teal-500/25 to-cyan-500/35 blur-md pointer-events-none" />

      {/* SVG Emblem: Globo de Lenguaje y Nodo de Conexión Neural */}
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="ntvLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c1626" />
            <stop offset="50%" stopColor="#070c18" />
            <stop offset="100%" stopColor="#04070d" />
          </linearGradient>

          <linearGradient id="ntvLogoBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="ntvLogoGlyph" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Badge Squircle */}
        <rect
          x="36"
          y="36"
          width="440"
          height="440"
          rx="110"
          fill="url(#ntvLogoBg)"
          stroke="url(#ntvLogoBorder)"
          strokeWidth="14"
        />

        {/* Globo Terráqueo de Red Neural / Nodo de Conexión de Lenguaje */}
        <g id="nativa-glyph-inner" transform="translate(256, 256)">
          {/* Anillo Exterior del Globo */}
          <circle cx="0" cy="0" r="132" fill="none" stroke="url(#ntvLogoGlyph)" strokeWidth="18" opacity="0.95" />

          {/* Elipse Ecuatorial de Flujo */}
          <ellipse cx="0" cy="0" rx="132" ry="48" fill="none" stroke="url(#ntvLogoGlyph)" strokeWidth="13" strokeDasharray="8 6" opacity="0.8" />

          {/* Meridiano Central Vertical */}
          <ellipse cx="0" cy="0" rx="54" ry="132" fill="none" stroke="url(#ntvLogoGlyph)" strokeWidth="13" opacity="0.85" />

          {/* Vías de Comunicación Neural */}
          <line x1="-75" y1="-65" x2="75" y2="65" stroke="#06b6d4" strokeWidth="8" opacity="0.75" />
          <line x1="-75" y1="65" x2="75" y2="-65" stroke="#10b981" strokeWidth="8" opacity="0.75" />

          {/* Nodo Central de Comprensión (i+1) */}
          <circle cx="0" cy="0" r="28" fill="#04070d" stroke="url(#ntvLogoGlyph)" strokeWidth="11" />
          <circle cx="0" cy="0" r="13" fill="#38bdf8" />

          {/* Nodos Satelitales Interconectados */}
          <circle cx="-75" cy="-65" r="11" fill="#34d399" />
          <circle cx="75" cy="-65" r="11" fill="#06b6d4" />
          <circle cx="-75" cy="65" r="11" fill="#06b6d4" />
          <circle cx="75" cy="65" r="11" fill="#34d399" />

          <circle cx="0" cy="-132" r="9" fill="#38bdf8" />
          <circle cx="0" cy="132" r="9" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
}

export function NativaLogo({
  size = 'md',
  showText = true,
  showSubtext = true,
  className = '',
}: NativaLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <NativaGlyph size={size} />

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-outfit font-black text-xl md:text-2xl tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              {APP_NAME.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 tracking-wider">
              SLA
            </span>
          </div>

          {showSubtext && (
            <span className="text-[10px] font-mono text-emerald-400/90 tracking-wider uppercase font-bold block mt-0.5">
              Ruta Universitaria A1 → C2
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Aliases para compatibilidad con código existente
export const FluentiaLogo = NativaLogo;
export const FluentiaGlyph = NativaGlyph;
export type FluentiaLogoProps = NativaLogoProps;
