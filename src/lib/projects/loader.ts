import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ProjectSchema, type Project } from '@/types/project';

const projectsDirectory = join(process.cwd(), 'data', 'projects');

// Read directly from JSON files on disk
export function getAllProjectsLocal(): Project[] {
  if (!existsSync(projectsDirectory)) return [];
  return readdirSync(projectsDirectory)
    .filter((filename) => filename.endsWith('.json'))
    .map((filename) => {
      try {
        const rawProject: unknown = JSON.parse(
          readFileSync(join(projectsDirectory, filename), 'utf8')
        );
        const result = ProjectSchema.safeParse(rawProject);
        if (!result.success) {
          console.error(`Invalid project data in ${filename}:`, result.error);
          return null;
        }
        return result.data;
      } catch (err) {
        console.error(`Failed reading ${filename}:`, err);
        return null;
      }
    })
    .filter((p): p is Project => p !== null)
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      return (
        new Date(b.launchedAt || b.startedAt).getTime() -
        new Date(a.launchedAt || a.startedAt).getTime()
      );
    });
}

// Sync accessor for SSG/RSC public site
export function getAllProjects(includeUnpublished = false): Project[] {
  const projects = getAllProjectsLocal();
  if (includeUnpublished) return projects;
  return projects.filter((p) => (p.publishState || 'published') === 'published');
}

export function getProjectBySlug(slug: string, includeUnpublished = false): Project | undefined {
  const projects = getAllProjects(includeUnpublished);
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects(false)
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProjectsByStatus(status: Project['status']): Project[] {
  return getAllProjects(false).filter((p) => p.status === status);
}

export function getProjectsByTechCategory(
  category: Project['techStack'][0]['category']
): Project[] {
  return getAllProjects(false).filter((p) => p.techStack.some((t) => t.category === category));
}

export function searchProjects(query: string): Project[] {
  const lowerQuery = query.toLowerCase();
  return getAllProjects(false).filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.tagline.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.techStack.some((t) => t.name.toLowerCase().includes(lowerQuery)) ||
      p.slug.toLowerCase().includes(lowerQuery)
  );
}

// Disk mutations for API routes / Admin CRUD
export function saveProjectLocal(
  projectData: Partial<Project> & { slug: string; title: string }
): Project {
  const existing = getProjectBySlug(projectData.slug, true);
  const now = new Date().toISOString();

  const fullData: Record<string, unknown> = {
    publishState: 'published',
    status: 'in-progress',
    featured: false,
    order: 0,
    category: 'AI & Engineering',
    startedAt: now,
    techStack: [],
    screenshots: [],
    lessonsLearned: [],
    links: {},
    problem: '',
    solution: '',
    architecture: '',
    description: '',
    tagline: '',
    ...existing,
    ...projectData,
    lastUpdated: now,
  };

  const parsed = ProjectSchema.parse(fullData);
  const filePath = join(projectsDirectory, `${parsed.slug}.json`);
  writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
  return parsed;
}

export function deleteProjectLocal(slug: string): boolean {
  const filePath = join(projectsDirectory, `${slug}.json`);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    return true;
  }
  return false;
}

export function duplicateProjectLocal(slug: string): Project | null {
  const source = getProjectBySlug(slug, true);
  if (!source) return null;

  const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
  const newTitle = `${source.title} (Copy)`;

  const copy: Project = {
    ...source,
    slug: newSlug,
    title: newTitle,
    publishState: 'draft',
    featured: false,
    startedAt: new Date().toISOString(),
  };

  return saveProjectLocal(copy);
}
