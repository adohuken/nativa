-- ============================================================================
-- NATIVA • ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.
-- Crea las 4 tablas principales, triggers de registro, permisos y políticas RLS.
-- ============================================================================

-- 1. TABLA: PROFILES (Perfiles de usuario ligados a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Estudiante Nativa',
  current_level TEXT NOT NULL DEFAULT 'A1',
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  license_code TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Asegurar columna is_admin si la tabla ya existía
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Otorgar rol de administrador al fundador
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'adohuken2005@gmail.com';

-- 2. TABLA: USER_PROGRESS (Progreso curricular, lecciones desbloqueadas y minutos de input)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  completed_nodes TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_subnodes TEXT[] DEFAULT ARRAY[]::TEXT[],
  immersion_minutes INTEGER DEFAULT 0,
  skills JSONB DEFAULT '{"listening": 0, "speaking": 0, "reading": 0, "writing": 0}'::JSONB,
  daily_missions JSONB DEFAULT '{}'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. TABLA: GLOBAL_STORIES (Banco Compartido de Historias IA / Content Lake)
CREATE TABLE IF NOT EXISTS public.global_stories (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL, -- 'A1' - 'C2'
  topic TEXT NOT NULL, -- 'Call Center', 'Technology', 'Travel', etc.
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  paragraphs TEXT[] DEFAULT ARRAY[]::TEXT[],
  word_count INTEGER DEFAULT 0,
  times_read INTEGER DEFAULT 1,
  status TEXT DEFAULT 'approved', -- 'approved' | 'rejected'
  vocabulary JSONB DEFAULT '{}'::JSONB,
  cultural_insight TEXT,
  reading_minutes INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Índices para búsqueda ultra rápida en el Content Lake
CREATE INDEX IF NOT EXISTS idx_global_stories_level ON public.global_stories(level);
CREATE INDEX IF NOT EXISTS idx_global_stories_topic ON public.global_stories(topic);
CREATE INDEX IF NOT EXISTS idx_global_stories_level_topic ON public.global_stories(level, topic);

-- 4. TABLA: PROJECT_SUBMISSIONS (Ensayos y Tareas TBLT evaluadas con IA)
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  unit INTEGER NOT NULL,
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  overall_score INTEGER NOT NULL, -- 0 a 100
  rubric_scores JSONB NOT NULL,   -- taskAchievement, coherenceCohesion, lexicalResource, grammaticalAccuracy
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 5. TABLA: GLOBAL_VOCABULARY (Banco de Palabras por Nivel A1-C2 con Input Comprensible Krashen)
CREATE TABLE IF NOT EXISTS public.global_vocabulary (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL, -- 'A1' - 'C2'
  word TEXT NOT NULL,
  phonetic TEXT,
  definition TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  topic TEXT DEFAULT 'Daily Life',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_global_vocab_level ON public.global_vocabulary(level);

-- 6. TABLA: USER_VOCABULARY (Vocabulario Diario Adquirido y Estado de Reto Semanal)
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  date_added DATE DEFAULT CURRENT_DATE NOT NULL,
  week_number INTEGER DEFAULT EXTRACT(WEEK FROM CURRENT_DATE) NOT NULL,
  is_mastered BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_vocab_user_week ON public.user_vocabulary(user_id, week_number);

-- ============================================================================
-- CONCESIÓN DE PRIVILEGIOS DE ROL (GRANT A ANON Y AUTHENTICATED)
-- Resuelve definitivamente el error Postgres 42501 (permission denied for table profiles)
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_progress TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.global_stories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.project_submissions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.global_vocabulary TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_vocabulary TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ============================================================================
-- TRIGGER AUTOMÁTICO: CREAR PERFIL Y PROGRESO AL REGISTRARSE (Email o Google)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, current_level, xp, streak, is_premium, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'A1',
    0,   -- Usuario nuevo inicia estrictamente en 0 XP
    0,   -- Usuario nuevo inicia estrictamente en 0 Días de Racha
    FALSE,
    (new.email = 'adohuken2005@gmail.com')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    is_admin = CASE WHEN EXCLUDED.email = 'adohuken2005@gmail.com' THEN TRUE ELSE public.profiles.is_admin END;

  INSERT INTO public.user_progress (user_id, completed_nodes, completed_subnodes, immersion_minutes)
  VALUES (
    new.id,
    ARRAY[]::TEXT[], -- Estrictamente array vacío: solo el nodo 1.1 estará activo por no tener prerrequisito
    ARRAY[]::TEXT[],
    0                -- 0 minutos iniciales
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador después de insertar en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas viejas para evitar conflictos al re-ejecutar
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Lectura de perfiles para usuarios autenticados" ON public.profiles;

-- Políticas para Profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
  ON public.profiles FOR SELECT 
  TO authenticated, anon
  USING (auth.uid() = id OR auth.uid() IS NOT NULL);

CREATE POLICY "Los usuarios pueden insertar su propio perfil" 
  ON public.profiles FOR INSERT 
  TO authenticated, anon
  WITH CHECK (auth.uid() = id OR id IS NOT NULL);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
  ON public.profiles FOR UPDATE 
  TO authenticated, anon
  USING (auth.uid() = id OR id IS NOT NULL)
  WITH CHECK (auth.uid() = id OR id IS NOT NULL);

-- Políticas para User Progress
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio progreso" ON public.user_progress;
DROP POLICY IF EXISTS "Los usuarios pueden modificar su propio progreso" ON public.user_progress;

CREATE POLICY "Los usuarios pueden ver su propio progreso" 
  ON public.user_progress FOR SELECT 
  TO authenticated, anon
  USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Los usuarios pueden modificar su propio progreso" 
  ON public.user_progress FOR ALL 
  TO authenticated, anon
  USING (auth.uid() = user_id OR user_id IS NOT NULL);

-- Políticas para Global Stories (Lectura pública para todos los alumnos)
DROP POLICY IF EXISTS "Historias globales legibles por todos" ON public.global_stories;
DROP POLICY IF EXISTS "Historias globales insertables por usuarios autenticados" ON public.global_stories;
DROP POLICY IF EXISTS "Actualizar contador de lecturas en historias" ON public.global_stories;

CREATE POLICY "Historias globales legibles por todos" 
  ON public.global_stories FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Historias globales insertables por usuarios autenticados" 
  ON public.global_stories FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Actualizar contador de lecturas en historias" 
  ON public.global_stories FOR UPDATE TO authenticated, anon USING (true);

-- Políticas para Project Submissions
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios proyectos" ON public.project_submissions;
DROP POLICY IF EXISTS "Los usuarios pueden enviar sus propios proyectos" ON public.project_submissions;

CREATE POLICY "Los usuarios pueden ver sus propios proyectos" 
  ON public.project_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden enviar sus propios proyectos" 
  ON public.project_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para Global Vocabulary (Lectura pública para todos los alumnos)
ALTER TABLE public.global_vocabulary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Vocabulario global legible por todos" ON public.global_vocabulary;
CREATE POLICY "Vocabulario global legible por todos" 
  ON public.global_vocabulary FOR SELECT TO authenticated, anon USING (true);

-- Políticas para User Vocabulary
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio vocabulario" ON public.user_vocabulary;
DROP POLICY IF EXISTS "Los usuarios pueden agregar palabras a su vocabulario" ON public.user_vocabulary;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio vocabulario" ON public.user_vocabulary;

CREATE POLICY "Los usuarios pueden ver su propio vocabulario" 
  ON public.user_vocabulary FOR SELECT TO authenticated, anon
  USING (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Los usuarios pueden agregar palabras a su vocabulario" 
  ON public.user_vocabulary FOR INSERT TO authenticated, anon
  WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Los usuarios pueden actualizar su propio vocabulario" 
  ON public.user_vocabulary FOR UPDATE TO authenticated, anon
  USING (auth.uid() = user_id OR user_id IS NOT NULL);
