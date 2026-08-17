-- SQL Schema for Surya.ai on Supabase

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'AI & Engineering',
  status TEXT NOT NULL DEFAULT 'in-progress', -- 'live', 'beta', 'archived', 'in-progress'
  publish_state TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published', 'archived'
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  how_it_works TEXT,
  architecture TEXT NOT NULL,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image TEXT,
  demo_video JSONB,
  youtube_url TEXT,
  vimeo_url TEXT,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  links JSONB NOT NULL DEFAULT '{}'::jsonb,
  lessons_learned JSONB NOT NULL DEFAULT '[]'::jsonb,
  challenges JSONB DEFAULT '[]'::jsonb,
  future_improvements JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL,
  launched_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ,
  metrics JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Media Library Table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'image' | 'video'
  mime_type TEXT,
  size_bytes BIGINT,
  associated_project_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Admin Config Table (Single row for hashed admin password)
CREATE TABLE IF NOT EXISTS public.admin_config (
  id INT PRIMARY KEY DEFAULT 1,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Public read access for published projects
CREATE POLICY "Public read for published projects" ON public.projects
  FOR SELECT USING (publish_state = 'published');

-- Public read access for media
CREATE POLICY "Public read for media" ON public.media
  FOR SELECT USING (true);

-- Service role bypasses RLS automatically for admin operations.

-- Storage Bucket Setup Instructions:
-- Create a public bucket named 'project-media' in Supabase Storage with public read access enabled.
