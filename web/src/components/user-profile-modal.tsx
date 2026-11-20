'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Flame, 
  Zap, 
  Headphones, 
  Save, 
  Check, 
  AlertCircle, 
  Globe, 
  Building2, 
  MapPin, 
  KeyRound, 
  CheckCircle2, 
  LogOut, 
  Sliders, 
  Award,
  Sparkles,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { AppStorage, UserProfile } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { APP_NAME } from '@/lib/config';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updated: UserProfile) => void;
  streakDays: number;
  userXp: number;
  immersionMinutes: number;
}

type ProfileTab = 'GENERAL' | 'SECURITY' | 'PREFERENCES' | 'STATS';

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🔬', '📚', '🌍', '🚀', '💡', '🎧'];

export function UserProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
  streakDays,
  userXp,
  immersionMinutes
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(() => AppStorage.getUserProfile());
  const [activeTab, setActiveTab] = useState<ProfileTab>('GENERAL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Manejar subida de foto de perfil (conversión a base64 DataURL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToastMessage('⚠️ La imagen no debe superar los 2MB.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updated = { ...profile, avatarUrl: base64String };
      setProfile(updated);
      AppStorage.saveUserProfile(updated);
      onProfileUpdated?.(updated);
      soundManager.playSuccess();
      setToastMessage('✓ Foto de perfil actualizada con éxito.');
      setTimeout(() => setToastMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const updated = { ...profile, avatarUrl: undefined };
    setProfile(updated);
    AppStorage.saveUserProfile(updated);
    onProfileUpdated?.(updated);
    soundManager.playClick();
    setToastMessage('Foto eliminada. Usando avatar predeterminado.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectEmojiAvatar = (emoji: string) => {
    const updated = { ...profile, avatarEmoji: emoji, avatarUrl: undefined };
    setProfile(updated);
    AppStorage.saveUserProfile(updated);
    onProfileUpdated?.(updated);
    soundManager.playClick();
  };

  // Guardar datos generales del perfil
  const handleSaveGeneralProfile = (e: React.FormEvent) => {
    e.preventDefault();
    AppStorage.saveUserProfile(profile);
    onProfileUpdated?.(profile);
    soundManager.playSuccess();
    setToastMessage('✓ Perfil guardado con éxito.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cambiar contraseña
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      soundManager.playClick();
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      soundManager.playClick();
      return;
    }

    if (!AppStorage.verifyCurrentPassword(currentPassword)) {
      setPasswordError('La contraseña actual es incorrecta.');
      soundManager.playClick();
      return;
    }

    AppStorage.updatePassword(newPassword);
    soundManager.playVictory();
    setPasswordSuccess('✓ Contraseña actualizada correctamente.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(null), 3500);
  };

  // Cálculo de fuerza de contraseña
  const getPasswordStrength = () => {
    if (!newPassword) return { label: 'Sin ingresar', percent: 0, color: 'bg-slate-700' };
    let score = 0;
    if (newPassword.length >= 6) score += 25;
    if (newPassword.length >= 8) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword) || /[A-Z]/.test(newPassword)) score += 25;

    if (score <= 25) return { label: 'Débil', percent: 25, color: 'bg-rose-500' };
    if (score <= 50) return { label: 'Regular', percent: 50, color: 'bg-amber-500' };
    if (score <= 75) return { label: 'Buena', percent: 75, color: 'bg-teal-400' };
    return { label: 'Excelente', percent: 100, color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-2xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* ===================================================================
            HEADER DEL PERFIL
        =================================================================== */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#070b13] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Perfil de Estudiante
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  Activo
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gestiona tu información personal, foto, seguridad y preferencias de aprendizaje.
              </p>
            </div>
          </div>

          <button
            onClick={() => { onClose(); soundManager.playClick(); }}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Notifier */}
        {toastMessage && (
          <div className="bg-emerald-950 border-b border-emerald-500/50 px-6 py-2 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ===================================================================
            AVATAR & PHOTO HERO BAR
        =================================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0b1220] to-[#070c17] border-b border-slate-800 flex flex-col sm:flex-row items-center gap-5">
          
          {/* Avatar Circular con Botón de Cámara */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-emerald-500/50 bg-[#050811] shadow-xl flex items-center justify-center text-4xl">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{profile.avatarEmoji || '👨‍🎓'}</span>
              )}
            </div>

            {/* Input oculto para subir archivo */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg transition"
              title="Subir foto desde tu dispositivo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Información Rápida & Acciones de Foto */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">{profile.name}</h3>
              <span className="text-xs font-mono text-emerald-400">@{profile.username}</span>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {profile.city ? `${profile.city}, ` : ''}{profile.country} • {profile.university || 'Universidad'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cambiar Foto</span>
              </button>

              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 border border-rose-500/30 text-xs font-bold text-rose-300 transition flex items-center gap-1"
                  title="Eliminar foto personalizada"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar</span>
                </button>
              )}

              {/* Selector Rápido de Emojis */}
              <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-slate-800">
                {AVATAR_OPTIONS.slice(0, 5).map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleSelectEmojiAvatar(emoji)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-sm transition"
                    title={`Usar ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ===================================================================
            PESTAÑAS DE NAVEGACIÓN DEL PERFIL
        =================================================================== */}
        <div className="flex border-b border-slate-800 bg-[#070b13] px-5 gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('GENERAL'); soundManager.playClick(); }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'GENERAL'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Datos Personales</span>
          </button>

          <button
            onClick={() => { setActiveTab('SECURITY'); soundManager.playClick(); }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SECURITY'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Seguridad & Clave</span>
          </button>

          <button
            onClick={() => { setActiveTab('PREFERENCES'); soundManager.playClick(); }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'PREFERENCES'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Metas & Ajustes</span>
          </button>

          <button
            onClick={() => { setActiveTab('STATS'); soundManager.playClick(); }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'STATS'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Resumen del Alumno</span>
          </button>
        </div>

        {/* ===================================================================
            CUERPO DE LAS PESTAÑAS (SCROLLABLE)
        =================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {/* 1. PESTAÑA: DATOS PERSONALES */}
          {activeTab === 'GENERAL' && (
            <form onSubmit={handleSaveGeneralProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Nombre Completo:</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Nombre de Usuario (@handle):</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">País de Residencia:</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Ciudad:</label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="ej. Managua"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Universidad / Institución:</label>
                  <input
                    type="text"
                    value={profile.university || ''}
                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="ej. Universidad Nacional de Ingeniería"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">
                  Biografía / Objetivo Académico:
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-2xl p-3 text-slate-200 leading-relaxed focus:outline-none focus:border-emerald-500"
                  placeholder="Describe brevemente tu meta con el inglés o la segunda lengua..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Datos Personales</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. PESTAÑA: SEGURIDAD & CONTRASEÑA */}
          {activeTab === 'SECURITY' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Protección de la Cuenta
                </span>
                <p className="text-[11px] text-slate-400">
                  Usa una contraseña segura de al menos 6 caracteres que combine letras y números.
                </p>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">Contraseña Actual:</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">Nueva Contraseña:</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {/* Medidor de Fortaleza */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Seguridad de la clave:</span>
                    <span className="font-bold text-white">{strength.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold block">Confirmar Nueva Contraseña:</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Actualizar Contraseña</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. PESTAÑA: METAS & PREFERENCIAS */}
          {activeTab === 'PREFERENCES' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Nivel MCER Objetivo:</label>
                  <select
                    value={profile.targetLevel}
                    onChange={(e) => {
                      const updated = { ...profile, targetLevel: e.target.value };
                      setProfile(updated);
                      AppStorage.saveUserProfile(updated);
                      onProfileUpdated?.(updated);
                    }}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-teal-500"
                  >
                    <option value="A2 • Supervivencia Cotidiana">A2 • Supervivencia Cotidiana</option>
                    <option value="B1 • Intermedio Independiente">B1 • Intermedio Independiente</option>
                    <option value="B2 • Intercambio Académico">B2 • Intercambio Académico</option>
                    <option value="C1 • Publicación y Conferencias">C1 • Publicación y Conferencias</option>
                    <option value="C2 • Maestría Bilingüe">C2 • Maestría Bilingüe</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Meta Diaria de Inmersión:</label>
                  <select
                    value={profile.dailyGoalMinutes}
                    onChange={(e) => {
                      const updated = { ...profile, dailyGoalMinutes: parseInt(e.target.value) || 20 };
                      setProfile(updated);
                      AppStorage.saveUserProfile(updated);
                      onProfileUpdated?.(updated);
                    }}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-teal-500"
                  >
                    <option value={10}>10 minutos / día (Casual)</option>
                    <option value={15}>15 minutos / día (Regular)</option>
                    <option value={20}>20 minutos / día (Recomendado Krashen)</option>
                    <option value={30}>30 minutos / día (Intensivo)</option>
                    <option value={45}>45 minutos / día (Inmersión Total)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Acento Preferido en Audios:</label>
                  <select
                    value={profile.accentPreference}
                    onChange={(e) => {
                      const updated = { ...profile, accentPreference: e.target.value as 'uk' | 'us' };
                      setProfile(updated);
                      AppStorage.saveUserProfile(updated);
                      onProfileUpdated?.(updated);
                    }}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-teal-500"
                  >
                    <option value="uk">🇬🇧 Inglés Británico (Oxford / Londres)</option>
                    <option value="us">🇺🇸 Inglés Americano (General Academic)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 font-bold block">Momento de Estudio Favorito:</label>
                  <select
                    value={profile.preferredStudyTime}
                    onChange={(e) => {
                      const updated = { ...profile, preferredStudyTime: e.target.value as any };
                      setProfile(updated);
                      AppStorage.saveUserProfile(updated);
                      onProfileUpdated?.(updated);
                    }}
                    className="w-full bg-[#0b101c] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-teal-500"
                  >
                    <option value="morning">🌅 Mañanas (Café y comprensión)</option>
                    <option value="afternoon">☀️ Tardes (Pausa universitaria)</option>
                    <option value="night">🌙 Noches (Repaso antes de dormir)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Efectos Sonoros y Zen
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {APP_NAME} utiliza frecuencias armónicas suaves (432Hz) diseñadas para bajar el Filtro Afectivo y prevenir la fatiga cognitiva durante la adquisición.
                </p>
              </div>
            </div>
          )}

          {/* 4. PESTAÑA: RESUMEN Y LOGROS */}
          {activeTab === 'STATS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 text-center space-y-1">
                  <Flame className="w-5 h-5 text-amber-400 mx-auto" />
                  <span className="text-[10px] font-mono text-slate-400 block">Racha Actual</span>
                  <strong className="text-lg font-black text-white">{streakDays} Días</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 text-center space-y-1">
                  <Zap className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="text-[10px] font-mono text-slate-400 block">XP Acumulado</span>
                  <strong className="text-lg font-black text-white">{userXp} XP</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 text-center space-y-1">
                  <Headphones className="w-5 h-5 text-teal-400 mx-auto" />
                  <span className="text-[10px] font-mono text-slate-400 block">Tiempo Total</span>
                  <strong className="text-lg font-black text-white">{immersionMinutes} min</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 text-center space-y-1">
                  <GraduationCap className="w-5 h-5 text-purple-400 mx-auto" />
                  <span className="text-[10px] font-mono text-slate-400 block">Nivel Actual</span>
                  <strong className="text-lg font-black text-white">A1.1</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Miembro desde:</span>
                  <span className="font-mono font-bold text-white">{profile.createdAt || 'Septiembre 2026'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ID de Estudiante:</span>
                  <span className="font-mono text-emerald-400">{profile.id}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <span className="text-[11px] text-slate-500 font-mono">Sesión activa como {profile.email}</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    soundManager.playClick();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cerrar</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </motion.div>
    </div>
  );
}
