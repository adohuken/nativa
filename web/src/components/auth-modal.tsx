'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Loader2,
  AtSign,
  Building2,
  MapPin,
  Compass
} from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured, DatabaseProfile } from '@/lib/supabase';
import { AppStorage } from '@/lib/storage';
import { soundManager } from '@/lib/sound-effects';
import { NativaLogo } from '@/components/fluentia-logo';
import { getPostLoginRedirectUrl } from '@/content/course-content';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (profile: DatabaseProfile) => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [learningFocus, setLearningFocus] = useState('Inglés General & Conversacional');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reiniciar campos siempre que se abra el modal o cambie de modo para evitar autofill
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);
      setEmail('');
      setPassword('');
      setFullName('');
      setUsername('');
      setCountry('');
      setCity('');
      setUniversity('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    soundManager.playClick();

    const client = getSupabaseClient();
    const cleanUsername = (username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || email.split('@')[0]);

    // MODO LOCAL / DEMO SI SUPABASE AÚN NO TIENE CREDENCIALES
    if (!client || !isSupabaseConfigured) {
      setTimeout(() => {
        setIsLoading(false);
        // Usuario nuevo: reiniciar progreso a cero estricto
        AppStorage.resetProgressForNewUser();

        const demoProfile: DatabaseProfile = {
          id: 'usr_local_demo',
          email: email || 'estudiante@nativa.edu',
          name: fullName.trim() || 'Aventurero',
          current_level: 'A1',
          xp: 0,
          streak: 0,
          is_premium: false
        };

        // Guardar sesión local limpia
        AppStorage.saveUserProfile({
          id: demoProfile.id,
          name: demoProfile.name,
          username: cleanUsername,
          email: demoProfile.email,
          avatarEmoji: '👨‍🎓',
          avatarUrl: undefined,
          country: country.trim(),
          city: city.trim(),
          university: university.trim(),
          targetLevel: 'A1 • Principiante',
          dailyGoalMinutes: 20,
          learningFocus: learningFocus,
          bio: '',
          createdAt: new Date().toISOString().split('T')[0],
          accentPreference: 'us',
          preferredStudyTime: 'afternoon',
          interfaceLanguage: 'es'
        });

        if (mode === 'register') {
          try { localStorage.setItem('nativa_should_show_placement', 'true'); } catch {}
        }

        soundManager.playVictory();
        setSuccessMessage('✓ Sesión iniciada correctamente (Modo Local).');
        if (onAuthSuccess) onAuthSuccess(demoProfile);
        setTimeout(() => {
          onClose();
          if (typeof window !== 'undefined') {
            window.location.href = getPostLoginRedirectUrl();
          }
        }, 1000);
      }, 700);
      return;
    }

    try {
      if (mode === 'register') {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim() || 'Aventurero',
              username: cleanUsername,
              country: country.trim(),
              city: city.trim(),
              university: university.trim(),
              learning_focus: learningFocus
            }
          }
        });

        if (error) throw error;

        // Si el usuario ya estaba registrado en Supabase, identities viene vacío
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setErrorMessage('Este correo ya está registrado en Nativa. Por favor ingresa con tu contraseña.');
          setMode('login');
          soundManager.playGentleError();
          return;
        }

        // Si Supabase devuelve sesión activa (sin requerir confirmación por email)
        if (data.session && data.user) {
          // Usuario nuevo: reiniciar progreso a cero estricto
          AppStorage.resetProgressForNewUser();

          const profile: DatabaseProfile = {
            id: data.user.id,
            email: data.user.email || email.trim(),
            name: fullName.trim() || 'Aventurero',
            current_level: 'A1',
            xp: 0,
            streak: 0,
            is_premium: false
          };

          // Guardar perfil local limpio del usuario actual
          AppStorage.saveUserProfile({
            id: data.user.id,
            name: profile.name,
            username: cleanUsername,
            email: profile.email,
            avatarEmoji: '👨‍🎓',
            avatarUrl: undefined,
            country: country.trim(),
            city: city.trim(),
            university: university.trim(),
            targetLevel: 'A1 • Principiante',
            dailyGoalMinutes: 20,
            learningFocus: learningFocus,
            bio: '',
            createdAt: new Date().toISOString().split('T')[0],
            accentPreference: 'us',
            preferredStudyTime: 'afternoon',
            interfaceLanguage: 'es',
            hasSeenTour: false
          });

          const isAdo = profile.email.toLowerCase().includes('adohuken') ||
            ((profile as any).username || '').toLowerCase().includes('adohuken');

          if (isAdo) {
            profile.is_admin = true;
            try {
              document.cookie = 'nativa_admin_session=true; path=/; max-age=604800; SameSite=Lax';
            } catch {}
          }

          // Resetear estado del tour para que el nuevo usuario lo vea en su Dashboard
          AppStorage.setHasSeenTour(false);

          // Guardar inmediatamente en tabla profiles y user_progress de Supabase
          try {
            await client.from('profiles').upsert({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              current_level: profile.current_level,
              xp: 0,
              streak: 0,
              is_premium: profile.is_premium || isAdo,
              is_admin: isAdo,
              has_seen_tour: false,
              updated_at: new Date().toISOString()
            });

            await client.from('user_progress').upsert({
              user_id: profile.id,
              completed_nodes: [],
              completed_subnodes: [],
              immersion_minutes: 0,
              skills: { listening: 0, speaking: 0, reading: 0, writing: 0 },
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
          } catch (dbErr) {
            console.warn('Advertencia al insertar perfil inicial:', dbErr);
          }

          soundManager.playVictory();
          setSuccessMessage('✓ ¡Cuenta creada e iniciada exitosamente!');
          try {
            localStorage.setItem('nativa_should_show_placement', 'true');
            localStorage.setItem('fluentia_user_session', JSON.stringify({
              id: profile.id,
              email: profile.email,
              role: isAdo ? 'ADMIN' : 'STUDENT'
            }));
          } catch {}
          if (onAuthSuccess) onAuthSuccess(profile);
          setTimeout(() => {
            onClose();
            if (typeof window !== 'undefined') {
              if (isAdo && window.location.search.includes('unauthorized_admin')) {
                window.location.href = '/admin';
              } else {
                window.location.href = getPostLoginRedirectUrl();
              }
            }
          }, 1200);
        } else if (data.user) {
          // Requiere confirmación por email según la config del proyecto Supabase
          soundManager.playVictory();
          setSuccessMessage('✓ ¡Cuenta creada! Si tienes activado "Confirm email" en Supabase, revisa tu correo para confirmar, o apágalo en Authentication > Providers para entrar directo.');
          setMode('login');
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) throw error;

        if (data.user) {
          // 1. Obtener perfil desde Supabase
          let profileData: DatabaseProfile | null = null;
          try {
            const { data: fetchedProfile } = await client
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();
            profileData = fetchedProfile;
          } catch (fetchErr) {
            console.warn('Error leyendo perfil:', fetchErr);
          }

          // 2. Si no existía la fila en profiles, crearla de inmediato en la base de datos
          if (!profileData) {
            const initialProfile: DatabaseProfile = {
              id: data.user.id,
              email: data.user.email || email.trim(),
              name: data.user.user_metadata?.full_name || 'Aventurero',
              current_level: 'A1',
              xp: 140,
              streak: 1,
              is_premium: false,
              has_seen_tour: false
            };
            try {
              await client.from('profiles').upsert({
                id: initialProfile.id,
                email: initialProfile.email,
                name: initialProfile.name,
                current_level: initialProfile.current_level,
                xp: initialProfile.xp,
                streak: initialProfile.streak,
                is_premium: initialProfile.is_premium,
                has_seen_tour: false,
                updated_at: new Date().toISOString()
              });
              profileData = initialProfile;
            } catch (createErr) {
              console.warn('No se pudo crear perfil en profiles:', createErr);
              profileData = initialProfile;
            }
          }

          if (profileData && profileData.has_seen_tour !== undefined) {
            AppStorage.setHasSeenTour(Boolean(profileData.has_seen_tour));
          }

          const userEmail = (profileData.email || data.user.email || '').toLowerCase().trim();
          const userUname = ((profileData as any).username || '').toLowerCase().trim();
          const isAdminUser = Boolean(
            profileData.is_admin ||
            userEmail.includes('adohuken') ||
            userUname.includes('adohuken') ||
            userEmail === 'adohuken2005@gmail.com'
          );
          try {
            if (isAdminUser) {
              document.cookie = 'nativa_admin_session=true; path=/; max-age=604800; SameSite=Lax';
            } else {
              document.cookie = 'nativa_admin_session=; path=/; max-age=0';
            }
          } catch {}

          // 3. Descargar inmediatamente todo el progreso desde Supabase hacia localStorage (Eliminar Split-Brain)
          try {
            await AppStorage.syncFromSupabase(data.user.id);
            localStorage.setItem('fluentia_user_session', JSON.stringify({
              id: data.user.id,
              email: profileData.email || data.user.email || '',
              role: isAdminUser ? 'ADMIN' : 'STUDENT'
            }));
          } catch (syncErr) {
            console.warn('Advertencia en syncFromSupabase:', syncErr);
          }

          soundManager.playVictory();
          setSuccessMessage(`✓ ¡Bienvenido de nuevo, ${profileData.name}!`);
          if (onAuthSuccess) onAuthSuccess(profileData);
          setTimeout(() => {
            onClose();
            if (typeof window !== 'undefined') {
              if (isAdminUser && window.location.search.includes('unauthorized_admin')) {
                window.location.href = '/admin';
              } else {
                window.location.href = getPostLoginRedirectUrl();
              }
            }
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      soundManager.playGentleError();
      const rawMsg = err?.message || '';
      if (
        rawMsg.toLowerCase().includes('rate limit') ||
        rawMsg.toLowerCase().includes('frecuencia') ||
        err?.code === 'over_email_send_rate_limit'
      ) {
        setErrorMessage('Límite de correos por hora de Supabase alcanzado. Solución rápida: en tu Supabase ve a Authentication > Providers > Email y desactiva "Confirm email" para permitir registros inmediatos sin límite.');
      } else if (
        rawMsg.toLowerCase().includes('user already registered') ||
        rawMsg.toLowerCase().includes('already registered')
      ) {
        setErrorMessage('Este correo ya está registrado en Nativa. Te hemos cambiado a la pestaña "Iniciar Sesión" para que ingreses tu contraseña.');
        setMode('login');
      } else if (
        rawMsg.toLowerCase().includes('invalid login credentials') ||
        rawMsg.toLowerCase().includes('invalid_grant')
      ) {
        setErrorMessage('Correo o contraseña incorrectos. Por favor verifica tus datos e inténtalo de nuevo.');
      } else {
        setErrorMessage(rawMsg || 'Error al conectar con el servicio de autenticación.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    soundManager.playClick();
    const client = getSupabaseClient();

    if (!client || !isSupabaseConfigured) {
      setErrorMessage('Para autenticación con Google, añade tu NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en web/.env.local');
      soundManager.playGentleError();
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Error al iniciar sesión con Google.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        className="relative w-full max-w-md my-auto rounded-3xl bg-[#090d16] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

        {/* Header con Logo y Botón Cerrar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NativaLogo size="md" />
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              SaaS v2.5
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Título de Bienvenida */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Bienvenido a Nativa' : 'Crea tu Cuenta en Nativa'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Accede a tus lecciones de inmersión y tu progreso guardado.'
              : 'Empieza con tu camino de adquisición natural y test de nivelación.'}
          </p>
        </div>

        {/* Alternador Login / Registro */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[#0e1626] border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { 
              setMode('login'); 
              setErrorMessage(null); 
              setSuccessMessage(null);
              setEmail('');
              setPassword('');
              soundManager.playClick(); 
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { 
              setMode('register'); 
              setErrorMessage(null); 
              setSuccessMessage(null);
              setEmail('');
              setPassword('');
              setFullName('');
              setUsername('');
              soundManager.playClick(); 
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Mensajes de Estado */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5" autoComplete="off">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-emerald-400 uppercase font-bold block">
                  Tu Nombre (Ej. David): *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. David"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                  Nombre de Usuario (@handle):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="Ej. bryanc"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                    País:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Ej. Nicaragua"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                    Ciudad:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej. Managua"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                  Universidad o Empresa (Opcional):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Ej. Teleperformance, UNI, UCA o Particular"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                  Meta de Aprendizaje:
                </label>
                <div className="relative">
                  <select
                    value={learningFocus}
                    onChange={(e) => setLearningFocus(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium appearance-none cursor-pointer"
                  >
                    <option value="Inglés General & Fluidez Natural">Inglés General & Fluidez Natural (MCER)</option>
                    <option value="Call Center & Industria BPO">Call Center & Industria BPO (Customer Support)</option>
                    <option value="Carrera Universitaria & Papers">Carrera Universitaria & Artículos Académicos</option>
                    <option value="Entrevistas de Trabajo & Tech">Entrevistas de Trabajo & Tecnología</option>
                    <option value="Viajes & Supervivencia Internacional">Viajes & Supervivencia Internacional</option>
                  </select>
                  <Compass className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
              Correo Electrónico:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name={mode === 'register' ? 'nativa_reg_email' : 'email'}
                autoComplete={mode === 'register' ? 'off' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
              Contraseña:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                name={mode === 'register' ? 'nativa_reg_password' : 'password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarme y Comenzar'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-[#090d16] text-[10px] font-mono uppercase text-slate-500">
            o continúa con
          </span>
        </div>

        {/* Botón Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#0e1626] hover:bg-[#121c30] border border-slate-800 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continuar con Google</span>
        </button>

        {/* Aviso de Configuración de Supabase */}
        {!isSupabaseConfigured && (
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" /> Modo Local de Demostración Activo
            </div>
            <div className="text-slate-400">
              Puedes iniciar sesión de inmediato. Cuando introduzcas las credenciales de Supabase en <code>web/.env.local</code>, tus datos se sincronizarán automáticamente con la nube.
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
