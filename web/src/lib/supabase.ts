// ============================================================================
// NATIVA • CLIENTE CENTRALIZADO DE SUPABASE
// Provee cliente singleton para Autenticación (Email / Google OAuth)
// y persistencia remota de perfiles, progreso, historias globales y proyectos.
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Normaliza la URL quitando /rest/v1/ o slashes finales si el usuario los copió
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Cliente Supabase seguro (no rompe si faltan credenciales antes de configurarlas)
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export function getSupabaseClient(): SupabaseClient | null {
  return clientInstance;
}

export const supabase = clientInstance as SupabaseClient;

// Tipos de datos sincronizados con Supabase
export interface DatabaseProfile {
  id: string;
  email: string;
  name: string;
  current_level: string; // 'A1' - 'C2'
  xp: number;
  streak: number;
  is_premium: boolean;
  is_admin?: boolean;
  has_seen_tour?: boolean;
  license_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseUserProgress {
  id?: string;
  user_id: string;
  completed_nodes: string[];
  completed_subnodes: string[];
  immersion_minutes: number;
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  daily_missions?: any;
  updated_at?: string;
}
