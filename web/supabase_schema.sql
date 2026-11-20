-- ============================================================================
-- NATIVA • ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.
-- Crea las 4 tablas principales, triggers de registro y políticas RLS.
-- ============================================================================

-- 1. TABLA: PROFILES (Perfiles de usuario ligados a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Estudiante Nativa',
  current_level TEXT NOT NULL DEFAULT 'A1',
  xp INTEGER NOT NULL DEFAULT 140,
  streak INTEGER NOT NULL DEFAULT 1,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  license_code TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. TABLA: USER_PROGRESS (Progreso curricular, lecciones desbloqueadas y minutos de input)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  completed_nodes TEXT[] DEFAULT ARRAY['a1-lesson-1']::TEXT[],
  completed_subnodes TEXT[] DEFAULT ARRAY[]::TEXT[],
  immersion_minutes INTEGER DEFAULT 15,
  skills JSONB DEFAULT '{"listening": 65, "speaking": 45, "reading": 70, "writing": 50}'::JSONB,
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

-- ============================================================================
-- TRIGGER AUTOMÁTICO: CREAR PERFIL Y PROGRESO AL REGISTRARSE (Email o Google)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, current_level, xp, streak, is_premium)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'A1',
    140,
    1,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_progress (user_id, completed_nodes, completed_subnodes, immersion_minutes)
  VALUES (
    new.id,
    ARRAY['a1-lesson-1'],
    ARRAY[]::TEXT[],
    15
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

-- Políticas para Profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para User Progress
CREATE POLICY "Los usuarios pueden ver su propio progreso" 
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden modificar su propio progreso" 
  ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Políticas para Global Stories (Lectura pública para todos los alumnos autenticados)
CREATE POLICY "Historias globales legibles por todos" 
  ON public.global_stories FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Historias globales insertables por usuarios autenticados" 
  ON public.global_stories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Actualizar contador de lecturas en historias" 
  ON public.global_stories FOR UPDATE TO authenticated, anon USING (true);

-- Políticas para Project Submissions
CREATE POLICY "Los usuarios pueden ver sus propios proyectos" 
  ON public.project_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden enviar sus propios proyectos" 
  ON public.project_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
