'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Crown,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  KeyRound,
  ArrowRight,
  ExternalLink,
  Award,
  Zap,
  Building2
} from 'lucide-react';
import { AppStorage } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { FluentiaLogo } from './fluentia-logo';

interface PremiumPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked?: () => void;
  reason?: string;
}

export function PremiumPaywallModal({
  isOpen,
  onClose,
  onUnlocked,
  reason
}: PremiumPaywallModalProps) {
  const [activeTab, setActiveTab] = useState<'transfer' | 'license'>('transfer');
  
  // Formulario de transferencia
  const [referenceNumber, setReferenceNumber] = useState('');
  const [studentName, setStudentName] = useState(() => AppStorage.getUserProfile().name || '');
  const [studentEmail, setStudentEmail] = useState(() => AppStorage.getUserProfile().email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Formulario de licencia B2B
  const [licenseCode, setLicenseCode] = useState('');
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [licenseSuccess, setLicenseSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const bankDetails = {
    bank: 'BANPRO Grupo Promerica',
    beneficiary: 'David Abarca',
    accountCordobas: '10020400192841',
    accountDollars: '10020400192842',
    priceUsd: '$29.99 USD',
    priceNio: 'C$ 1,095 NIO'
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    soundManager.playClick();
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;

    setIsSubmitting(true);
    soundManager.playClick();

    setTimeout(() => {
      const userProfile = AppStorage.getUserProfile();
      AppStorage.submitPaymentRequest({
        userId: userProfile.id,
        userName: studentName || userProfile.name,
        userEmail: studentEmail || userProfile.email,
        referenceNumber: referenceNumber.trim(),
        bankName: 'BANPRO (Nicaragua)',
        amount: `${bankDetails.priceUsd} / ${bankDetails.priceNio}`,
        notes: reason || 'Acceso Completo Nativa'
      });

      setIsSubmitting(false);
      setPaymentSuccess(true);
      soundManager.playLevelUp();
    }, 600);
  };

  const handleRedeemLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseError(null);
    setLicenseSuccess(null);

    const res = AppStorage.redeemLicenseCode(licenseCode);
    if (res.success) {
      soundManager.playLevelUp();
      setLicenseSuccess(res.message);
      if (onUnlocked) onUnlocked();
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      soundManager.playWrong();
      setLicenseError(res.message);
    }
  };

  const openWhatsApp = () => {
    const refText = referenceNumber ? ` Referencia enviada: ${referenceNumber}.` : '';
    const message = encodeURIComponent(
      `Hola David, estoy interesado en adquirir Nativa Premium para desbloquear el temario completo (B1-C2) y el Track de Call Center.${refText}`
    );
    window.open(`https://wa.me/50588888888?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e1626] to-[#080d16] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Halo decorativo superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="p-7 pb-4 text-center space-y-3 border-b border-slate-800/80 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Nativa Pro & Enterprise
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Desbloquea el Acceso Premium Ilimitado
          </h2>

          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            {reason ? (
              <span className="text-amber-300 font-semibold">{reason}</span>
            ) : (
              'Accede a los niveles intermedios y avanzados (B1-C2), el Track Especializado de Call Center BPO y evaluaciones ilimitadas con Rúbricas Oxford.'
            )}
          </p>

          {/* Beneficios Clave */}
          <div className="grid grid-cols-3 gap-2.5 pt-3 max-w-lg mx-auto text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Niveles B1 a C2</span>
              </div>
              <p className="text-[11px] text-slate-400">Fluidez operativa y académica completa.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Track Call Center</span>
              </div>
              <p className="text-[11px] text-slate-400">Simulaciones de llamadas y entrevistas.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Rúbricas Oxford</span>
              </div>
              <p className="text-[11px] text-slate-400">Evaluación de ensayos con 8 motores de IA.</p>
            </div>
          </div>
        </div>

        {/* Pestañas de Pago */}
        <div className="px-7 pt-4 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('transfer');
              soundManager.playClick();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'transfer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Transferencia Bancaria Local</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('license');
              soundManager.playClick();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'license'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Tengo un Código B2B / Beca</span>
          </button>
        </div>

        {/* Contenido según pestaña */}
        <div className="p-7 pt-5">
          {activeTab === 'transfer' ? (
            <div className="space-y-5">
              {/* Tarjeta con Datos Bancarios */}
              <div className="p-4 rounded-2xl bg-[#090e17] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">{bankDetails.bank}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {bankDetails.priceUsd} ({bankDetails.priceNio})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Beneficiario:</span>
                    <span className="text-white font-semibold">{bankDetails.beneficiary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Cuenta BANPRO Córdobas:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-amber-300 font-mono font-bold">{bankDetails.accountCordobas}</code>
                      <button
                        onClick={() => handleCopyAccount(bankDetails.accountCordobas)}
                        className="text-slate-400 hover:text-white transition"
                        title="Copiar número de cuenta"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de Confirmación o Notificación de Éxito */}
              {paymentSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-200">¡Referencia Registrada con Éxito!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Tu solicitud de activación para la referencia <strong className="text-white font-mono">{referenceNumber}</strong> ha sido enviada al panel del administrador. Tan pronto como sea validada, tu cuenta pasará automáticamente a estado <strong className="text-amber-300">Premium</strong>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={openWhatsApp}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Acelerar Activación por WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Número de Referencia Bancaria / Minuta:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: BANPRO-8923410 o número de transacción"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080d16] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition font-mono"
                    />
                    <p className="text-[11px] text-slate-500">
                      Ingresa el código que aparece en tu comprobante o captura de transferencia BANPRO.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting || !referenceNumber.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      {isSubmitting ? (
                        <span>Registrando referencia...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Enviar Comprobante de Pago</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp Directo</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Pestaña: Canjear Licencia B2B */
            <form onSubmit={handleRedeemLicense} className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs text-purple-200">
                <span className="font-bold flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-4 h-4" />
                  Convenios B2B y Becas Universitarias
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Si tu call center, universidad o empresa tiene un convenio con Nativa, ingresa tu código de acceso para desbloquear el plan Premium sin costo personal.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Código de Licencia:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: NATIVA-CALL-2026 o NATIVA-UNI-SCHOLAR"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080d16] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition font-mono uppercase"
                />
              </div>

              {licenseError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                  {licenseError}
                </div>
              )}

              {licenseSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{licenseSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!licenseCode.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <KeyRound className="w-4 h-4" />
                <span>Validar y Activar Licencia Premium</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Nativa Learning Engine • Acceso respaldado por garantía de satisfacción y soporte local en Managua, Nicaragua.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
