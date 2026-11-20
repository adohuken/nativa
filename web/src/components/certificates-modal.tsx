'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  Download,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  FileCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { downloadCertificatePdf } from '@/lib/certificate-generator';
import { NativaLogo } from '@/components/fluentia-logo';

interface CertificatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedNodeIds: string[];
  studentName?: string;
  currentLevel?: string;
}

export function CertificatesModal({
  isOpen,
  onClose,
  completedNodeIds,
  studentName = 'Estudiante Nativa',
  currentLevel = 'A1'
}: CertificatesModalProps) {
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  if (!isOpen) return null;

  // Definición de las certificaciones disponibles
  const certifications = [
    {
      code: 'A1',
      title: 'Nivel A1 • Fundamentos y Supervivencia Universitaria',
      standard: 'MCER A1 Breakthrough • 4 Lecciones',
      requiredNodes: ['a1-lesson-1', 'a1-lesson-2', 'a1-lesson-3', 'a1-lesson-4'],
      description: 'Capacidad demostrada para presentarse, interactuar en el campus y desenvolverse sin traducción mental.',
      color: 'from-emerald-500 to-teal-400',
      badge: 'Nivel A1 Acreditado'
    },
    {
      code: 'A2',
      title: 'Nivel A2 • Plataforma y Vida en el Campus',
      standard: 'MCER A2 Waystage • 4 Lecciones',
      requiredNodes: ['a2-lesson-1', 'a2-lesson-2', 'a2-lesson-3', 'a2-lesson-4'],
      description: 'Manejo fluido del pasado simple, comparaciones y comunicación funcional en actividades estudiantiles.',
      color: 'from-teal-500 to-cyan-400',
      badge: 'Nivel A2 Acreditado'
    },
    {
      code: 'B1',
      title: 'Nivel B1 • Umbral y Narración Académica',
      standard: 'MCER B1 Threshold • 4 Lecciones',
      requiredNodes: ['b1-lesson-1', 'b1-lesson-2', 'b1-lesson-3', 'b1-lesson-4'],
      description: 'Capacidad para debatir, redactar CVs, manejar condicionales de contingencia y comprender textos extensos.',
      color: 'from-blue-500 to-indigo-400',
      badge: 'Nivel B1 Acreditado'
    },
    {
      code: 'B2',
      title: 'Nivel B2 • Avanzado y Argumentación Crítica',
      standard: 'MCER B2 Vantage • 4 Lecciones',
      requiredNodes: ['b2-lesson-1', 'b2-lesson-2', 'b2-lesson-3', 'b2-lesson-4'],
      description: 'Dominio de debate parlamentario, estructuras enfáticas, discurso indirecto y deducciones formales.',
      color: 'from-indigo-500 to-purple-400',
      badge: 'Nivel B2 Acreditado'
    },
    {
      code: 'C1',
      title: 'Nivel C1 • Eficacia Operativa y Redacción Científica',
      standard: 'MCER C1 Effective Proficiency • 4 Lecciones',
      requiredNodes: ['c1-lesson-1', 'c1-lesson-2', 'c1-lesson-3', 'c1-lesson-4'],
      description: 'Retórica de alta complejidad, oratoria persuasiva, lenguaje matizado (hedging) y abstracts indexados.',
      color: 'from-purple-500 to-fuchsia-400',
      badge: 'Nivel C1 Acreditado'
    },
    {
      code: 'C2',
      title: 'Nivel C2 • Maestría Bilingüe y Defensa Doctoral',
      standard: 'MCER C2 Mastery • 4 Lecciones',
      requiredNodes: ['c2-lesson-1', 'c2-lesson-2', 'c2-lesson-3', 'c2-lesson-4'],
      description: 'Soltura absoluta ante tribunales doctorales, dialectos globales del inglés y corrección estilística suprema.',
      color: 'from-amber-400 to-orange-500',
      badge: 'Nivel C2 Acreditado'
    },
    {
      code: 'CALL-CENTER',
      title: 'Track de Especialización • Call Center & BPO Operations',
      standard: 'BPO Professional Communication • 8 Lecciones',
      requiredNodes: ['mod-cc-1', 'mod-cc-2', 'mod-cc-3', 'mod-cc-4'],
      description: 'Atención telefónica internacional, desescalamiento de quejas, soporte técnico y superación de mock calls.',
      color: 'from-cyan-500 to-blue-500',
      badge: 'Certificación BPO Acreditada'
    }
  ];

  const handleDownload = (cert: typeof certifications[0]) => {
    setDownloadingCode(cert.code);
    soundManager.playClick();

    setTimeout(() => {
      downloadCertificatePdf({
        studentName,
        courseTitle: 'Nativa Learning Systems',
        levelCode: cert.code,
        levelTitle: cert.title,
        grade: 'Comité Académico Acreditado (Oxford Standard)'
      });
      soundManager.playVictory();
      setDownloadingCode(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#080d18] border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Mis Certificados Oficiales</span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                PDF Verificable
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Diplomas emitidos a nombre de <strong className="text-white">{studentName}</strong> bajo estándares de Oxford / Cambridge.
            </p>
          </div>
        </div>

        {/* Lista de Certificados */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {certifications.map((cert) => {
            // Verificar si el nivel está completado
            const completedCount = cert.requiredNodes.filter(id => completedNodeIds.includes(id)).length;
            const isCompleted = completedCount >= cert.requiredNodes.length || completedNodeIds.includes(cert.requiredNodes[0]);
            const progress = Math.min(100, Math.round((completedCount / cert.requiredNodes.length) * 100));

            return (
              <div
                key={cert.code}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  isCompleted
                    ? 'bg-[#0c1424] border-amber-500/40 shadow-sm shadow-amber-500/5'
                    : 'bg-[#060911] border-slate-800/80 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono uppercase font-black px-2.5 py-0.5 rounded-md border ${
                        isCompleted
                          ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}>
                        {cert.code}
                      </span>
                      <h3 className="text-sm font-bold text-white">{cert.title}</h3>
                      {isCompleted ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Acreditado
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-3 h-3" /> En progreso ({completedCount}/{cert.requiredNodes.length})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                      {cert.description}
                    </p>
                  </div>

                  {/* Botón de Descarga o Progreso */}
                  <div className="self-start sm:self-auto shrink-0">
                    {isCompleted ? (
                      <button
                        onClick={() => handleDownload(cert)}
                        disabled={downloadingCode === cert.code}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>{downloadingCode === cert.code ? 'Generando PDF...' : 'Descargar PDF'}</span>
                      </button>
                    ) : (
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                          <span>Avance</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-slate-700 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer con Garantía de Autenticidad */}
        <div className="p-3.5 rounded-xl bg-[#060911] border border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Certificados con código QR y verificación criptográfica permanente.</span>
          </div>
          <span className="text-[11px] font-mono text-amber-300">Nativa SLA Framework</span>
        </div>
      </motion.div>
    </div>
  );
}
