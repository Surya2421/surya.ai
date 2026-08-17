import { Suspense } from 'react';
import { getProjectsData } from '@/lib/projects';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Projects',
  description: 'A selection of AI experiments and product work by Surya Teja Uta.',
};

export default async function ProjectsPage() {
  const projects = await getProjectsData();

  return (
    <Suspense fallback={<div className="bg-bg-primary min-h-screen" />}>
      <ProjectsClient projects={projects} />
    </Suspense>
  );
}
