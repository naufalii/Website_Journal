-- ==============================================================================
-- NEXUS WORKSPACE - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Jalankan skrip ini langsung di menu "SQL Editor" pada Dashboard Supabase Anda.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL: GOALS (Daily Goals & Habit Tracker)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'career',
    target_per_week INTEGER DEFAULT 7,
    completed_dates TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals" 
ON public.goals 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 3. TABEL: SCHEDULES (Schedule & Agenda Planner)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL, -- Format YYYY-MM-DD
    start_time TEXT NOT NULL, -- Format HH:mm
    end_time TEXT NOT NULL, -- Format HH:mm
    category TEXT NOT NULL DEFAULT 'work',
    priority TEXT NOT NULL DEFAULT 'medium',
    location_or_link TEXT,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own schedules" 
ON public.schedules 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 4. TABEL: COURSES (Course & Skill Tracker)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT,
    target_date TEXT,
    total_modules INTEGER NOT NULL DEFAULT 1,
    completed_modules INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'planned'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own courses" 
ON public.courses 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 5. TABEL: NOTES (Quick Notes & Knowledge Base)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'idea',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes" 
ON public.notes 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 6. TABEL: DOCUMENTS (Document & Resource Vault)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'link', -- 'link' atau 'file'
    category TEXT NOT NULL DEFAULT 'document',
    url TEXT, -- URL link eksternal atau URL public file
    file_path TEXT, -- Path file di Supabase Storage
    file_name TEXT,
    file_size BIGINT,
    file_type TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents" 
ON public.documents 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 7. STORAGE BUCKET CONFIGURATION (Supabase Storage: vault-documents)
-- ==============================================================================
-- Buat bucket penyimpanan berkas dokumen/PDF jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('vault-documents', 'vault-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage: Pengguna yang terautentikasi dapat membaca/mengunggah/menghapus file mereka
CREATE POLICY "Authenticated users can upload vault documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vault-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can view vault documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'vault-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can update vault documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vault-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete vault documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vault-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Izinkan public read jika URL dokumen dibagikan langsung
CREATE POLICY "Public read for vault-documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vault-documents');

-- ==============================================================================
-- 8. INDEXES UNTUK PERFORMA TINGGI
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id_date ON public.schedules(user_id, date);
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON public.courses(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
