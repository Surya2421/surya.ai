import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectData, getProjectsData } from '@/lib/projects';
import ProjectDetail from '../ProjectDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);
  if (!project) return { title: 'Project Not Found' };
  const ogImage =
    project.coverImage || project.demoVideo?.poster || '/images/surya-portrait-cutout.png';
  return {
    title: `${project.title} — Surya.ai`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [{ url: ogImage }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.tagline,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  return (await getProjectsData()).map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectData(slug);
  if (!project) notFound();
  const relatedProjects = (await getProjectsData())
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
  return <ProjectDetail project={project} relatedProjects={relatedProjects} />;
}
