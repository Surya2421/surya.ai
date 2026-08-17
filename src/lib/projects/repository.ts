import type { Project } from '@/types/project';
import { ProjectSchema } from '@/types/project';
import {
  getSupabaseAdmin,
  getSupabasePublic,
  isSupabaseAdminConfigured,
  isSupabasePublicConfigured,
} from '@/lib/supabase/server';
import {
  deleteProjectLocal,
  duplicateProjectLocal,
  getAllProjectsLocal,
  saveProjectLocal,
} from './loader';

const toRow = (project: Project) => ({
  id: project.id || undefined,
  slug: project.slug,
  title: project.title,
  short_description: project.tagline,
  description: project.description,
  category: project.category,
  status: project.status,
  publish_state: project.publishState,
  featured: project.featured,
  display_order: project.order,
  problem: project.problem,
  solution: project.solution,
  how_it_works: project.howItWorks || null,
  architecture: project.architecture,
  tech_stack: project.techStack,
  cover_media: project.coverImage || null,
  demo_video: project.demoVideo || null,
  youtube_url: project.youtubeUrl || null,
  vimeo_url: project.vimeoUrl || null,
  gallery_media: project.screenshots,
  links: project.links,
  learnings: project.lessonsLearned,
  challenges: project.challenges || [],
  future_improvements: project.futureImprovements || [],
  metrics: project.metrics || {},
  started_at: project.startedAt,
  launched_at: project.launchedAt || null,
  updated_at: new Date().toISOString(),
});

const fromRow = (row: Record<string, unknown>): Project | null => {
  const parsed = ProjectSchema.safeParse({
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.short_description || '',
    description: row.description || '',
    category: row.category || 'AI & Engineering',
    status: row.status || 'in-progress',
    publishState: row.publish_state || 'draft',
    featured: row.featured || false,
    order: row.display_order || 0,
    problem: row.problem || '',
    solution: row.solution || '',
    howItWorks: row.how_it_works || undefined,
    architecture: row.architecture || '',
    techStack: row.tech_stack || [],
    coverImage: row.cover_media || undefined,
    demoVideo: row.demo_video || undefined,
    youtubeUrl: row.youtube_url || undefined,
    vimeoUrl: row.vimeo_url || undefined,
    screenshots: row.gallery_media || [],
    links: row.links || {},
    lessonsLearned: row.learnings || [],
    challenges: row.challenges || [],
    futureImprovements: row.future_improvements || [],
    metrics: row.metrics || undefined,
    startedAt: row.started_at || row.created_at || new Date().toISOString(),
    launchedAt: row.launched_at || null,
    lastUpdated: row.updated_at || undefined,
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined,
  });
  return parsed.success ? parsed.data : null;
};

export async function getProjectsData(includeUnpublished = false): Promise<Project[]> {
  const client = includeUnpublished ? getSupabaseAdmin() : getSupabasePublic();
  const configured = includeUnpublished ? isSupabaseAdminConfigured : isSupabasePublicConfigured;
  if (!configured || !client)
    return getAllProjectsLocal().filter(
      (project) => includeUnpublished || project.publishState === 'published'
    );
  let query = client
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('updated_at', { ascending: false });
  if (!includeUnpublished) query = query.eq('publish_state', 'published');
  const { data, error } = await query;
  if (error) {
    console.error('Supabase project read failed:', error.message);
    return getAllProjectsLocal().filter(
      (project) => includeUnpublished || project.publishState === 'published'
    );
  }
  return (data || [])
    .map((row) => fromRow(row))
    .filter((project): project is Project => Boolean(project));
}

export async function getProjectData(
  slug: string,
  includeUnpublished = false
): Promise<Project | undefined> {
  const projects = await getProjectsData(includeUnpublished);
  return projects.find((project) => project.slug === slug);
}

export async function saveProjectData(input: Project): Promise<Project> {
  if (!isSupabaseAdminConfigured) return saveProjectLocal(input);
  const client = getSupabaseAdmin();
  if (!client) return saveProjectLocal(input);
  const { data, error } = await client
    .from('projects')
    .upsert(toRow(input), { onConflict: 'slug' })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  const project = fromRow(data);
  if (!project) throw new Error('Saved project could not be parsed');
  return project;
}

export async function deleteProjectData(slug: string): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return deleteProjectLocal(slug);
  const client = getSupabaseAdmin();
  if (!client) return false;
  const { error } = await client.from('projects').delete().eq('slug', slug);
  if (error) throw new Error(error.message);
  return true;
}

export async function duplicateProjectData(slug: string): Promise<Project | null> {
  if (!isSupabaseAdminConfigured) return duplicateProjectLocal(slug);
  const source = await getProjectData(slug, true);
  if (!source) return null;
  const suffix = Date.now().toString().slice(-5);
  return saveProjectData({
    ...source,
    id: undefined,
    slug: `${source.slug}-copy-${suffix}`,
    title: `${source.title} (Copy)`,
    publishState: 'draft',
    featured: false,
    startedAt: new Date().toISOString(),
  });
}
