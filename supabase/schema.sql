-- Surya.ai content architecture
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  category text not null default 'AI & Engineering',
  status text not null default 'in-progress' check (status in ('live','beta','archived','in-progress')),
  publish_state text not null default 'draft' check (publish_state in ('draft','published','archived')),
  featured boolean not null default false,
  display_order integer not null default 0,
  problem text not null default '',
  solution text not null default '',
  how_it_works text,
  architecture text not null default '',
  tech_stack jsonb not null default '[]'::jsonb,
  cover_media text,
  demo_video jsonb,
  gallery_media jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  learnings jsonb not null default '[]'::jsonb,
  challenges jsonb not null default '[]'::jsonb,
  future_improvements jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  youtube_url text,
  vimeo_url text,
  started_at timestamptz not null default now(),
  launched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx on public.projects (publish_state, display_order, updated_at desc);
create index if not exists projects_featured_idx on public.projects (featured) where publish_state = 'published';

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_slug text references public.projects(slug) on update cascade on delete cascade,
  filename text not null,
  storage_path text not null unique,
  public_url text not null,
  media_type text not null check (media_type in ('image','video')),
  mime_type text not null,
  size_bytes bigint not null default 0,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  category text not null default 'Build Log',
  body text not null default '',
  cover_media text,
  publish_state text not null default 'draft' check (publish_state in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.site_settings enable row level security;
alter table public.content_entries enable row level security;

drop policy if exists "Public reads published projects" on public.projects;
create policy "Public reads published projects" on public.projects for select using (publish_state = 'published');
drop policy if exists "Public reads media for published projects" on public.project_media;
create policy "Public reads media for published projects" on public.project_media for select using (project_slug is null or exists (select 1 from public.projects where projects.slug = project_media.project_slug and projects.publish_state = 'published'));
drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings for select using (true);
drop policy if exists "Public reads published content" on public.content_entries;
create policy "Public reads published content" on public.content_entries for select using (publish_state = 'published');

-- Mutations are intentionally not granted to anon/authenticated roles.
-- Server-side admin routes use SUPABASE_SECRET_KEY after a verified admin session.

insert into storage.buckets (id, name, public) values ('project-media','project-media',true) on conflict (id) do update set public = excluded.public;
drop policy if exists "Public reads project media objects" on storage.objects;
create policy "Public reads project media objects" on storage.objects for select using (bucket_id = 'project-media');
-- Upload/update/delete are performed server-side with the secret key only.
