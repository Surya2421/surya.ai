import { siteConfig } from '@/lib/constants/site';
import { getAllProjects } from '@/lib/projects';

export default function sitemap() {
  const baseUrl = siteConfig.url;
  const projects = getAllProjects();

  const staticRoutes = ['', '/projects', '/content', '/journey', '/about', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.launchedAt ? new Date(project.launchedAt) : new Date(project.startedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
