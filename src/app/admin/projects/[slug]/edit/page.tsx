import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/projects/loader';
import { ProjectForm } from '@/components/admin/ProjectForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug, true);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} isEditing={true} />;
}
