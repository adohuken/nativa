'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SkillScores {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

interface RadarSkillsChartProps {
  scores: SkillScores;
  className?: string;
}

export function RadarSkillsChart({ scores, className = '' }: RadarSkillsChartProps) {
  const cx = 130;
  const cy = 105;
  const maxR = 52;

  // 4 Ejes ordenados: Norte (Listening), Este (Speaking), Sur (Reading), Oeste (Writing)
  const axes = [
    { key: 'listening', label: 'Listening', icon: '🎧', val: Math.min(100, Math.max(10, scores.listening)), angle: -Math.PI / 2, align: 'middle', textY: cy - maxR - 12 },
    { key: 'speaking', label: 'Speaking', icon: '🎙️', val: Math.min(100, Math.max(10, scores.speaking)), angle: 0, align: 'start', textX: cx + maxR + 10, textY: cy + 4 },
    { key: 'reading', label: 'Reading', icon: '📖', val: Math.min(100, Math.max(10, scores.reading)), angle: Math.PI / 2, align: 'middle', textY: cy + maxR + 18 },
    { key: 'writing', label: 'Writing', icon: '✍️', val: Math.min(100, Math.max(10, scores.writing)), angle: Math.PI, align: 'end', textX: cx - maxR - 10, textY: cy + 4 },
  ];

  // Coordenadas del polígono del alumno
  const points = axes.map((axis) => {
    const r = (axis.val / 100) * maxR;
    const x = cx + r * Math.cos(axis.angle);
    const y = cy + r * Math.sin(axis.angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Anillos concéntricos de referencia (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className={`relative flex flex-col items-center select-none w-full px-1 ${className}`}>
      <svg 
        viewBox="0 0 260 220" 
        className="w-full h-auto max-w-[250px] overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Gradiente verde esmeralda / cian translúcido */}
          <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
          </linearGradient>

          {/* Filtro de resplandor neón */}
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Círculos / Polígonos de Nivel de Fondo */}
        {levels.map((lvl, idx) => {
          const r = lvl * maxR;
          const polyPoints = [
            `${cx},${cy - r}`,
            `${cx + r},${cy}`,
            `${cx},${cy + r}`,
            `${cx - r},${cy}`,
          ].join(' ');

          return (
            <g key={idx}>
              <polygon
                points={polyPoints}
                fill={idx === levels.length - 1 ? 'rgba(15, 23, 42, 0.4)' : 'none'}
                stroke="#334155"
                strokeWidth={idx === levels.length - 1 ? '1.5' : '1'}
                strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
                strokeOpacity={idx === levels.length - 1 ? '0.7' : '0.4'}
              />
            </g>
          );
        })}

        {/* Ejes radiales desde el centro */}
        {axes.map((axis, idx) => {
          const x2 = cx + maxR * Math.cos(axis.angle);
          const y2 = cy + maxR * Math.sin(axis.angle);
          return (
            <line
              key={idx}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
            />
          );
        })}

        {/* Polígono de Destrezas del Alumno (Animado) */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          points={points}
          fill="url(#radarFillGrad)"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#radarGlow)"
        />

        {/* Puntos en cada vértice */}
        {axes.map((axis, idx) => {
          const r = (axis.val / 100) * maxR;
          const x = cx + r * Math.cos(axis.angle);
          const y = cy + r * Math.sin(axis.angle);
          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#06b6d4"
                stroke="#090d16"
                strokeWidth="2"
                className="transition-transform duration-300 hover:scale-125"
              />
              <circle
                cx={x}
                cy={y}
                r="2"
                fill="#ffffff"
              />
            </g>
          );
        })}

        {/* Etiquetas de los Ejes con Icono y Porcentaje */}
        {/* Norte: Listening */}
        <text
          x={cx}
          y={cy - maxR - 10}
          textAnchor="middle"
          className="fill-slate-200 text-[10px] font-bold tracking-wider"
        >
          🎧 List. <tspan className="fill-emerald-400 font-mono font-black">{scores.listening}%</tspan>
        </text>

        {/* Este: Speaking */}
        <text
          x={cx + maxR + 8}
          y={cy + 3}
          textAnchor="start"
          className="fill-slate-200 text-[10px] font-bold tracking-wider"
        >
          🎙️ Speak. <tspan className="fill-cyan-400 font-mono font-black">{scores.speaking}%</tspan>
        </text>

        {/* Sur: Reading */}
        <text
          x={cx}
          y={cy + maxR + 16}
          textAnchor="middle"
          className="fill-slate-200 text-[10px] font-bold tracking-wider"
        >
          📖 Read. <tspan className="fill-blue-400 font-mono font-black">{scores.reading}%</tspan>
        </text>

        {/* Oeste: Writing */}
        <text
          x={cx - maxR - 8}
          y={cy + 3}
          textAnchor="end"
          className="fill-slate-200 text-[10px] font-bold tracking-wider"
        >
          ✍️ Writ. <tspan className="fill-purple-400 font-mono font-black">{scores.writing}%</tspan>
        </text>
      </svg>
    </div>
  );
}
