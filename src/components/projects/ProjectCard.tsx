'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from '@/types/project';
import { ProjectVisual } from './ProjectVisual';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="premium-project-card"
      initial={{ opacity: 0, y: 70, rotateX: 8, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay: Math.min(index * 0.08, 0.28), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, rotateX: 2, rotateY: index % 2 ? 1.5 : -1.5 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <ProjectVisual index={index} title={project.title} />
        <div className="premium-project-body">
          <div className="premium-project-meta">
            <span>0{index + 1}</span>
            <i />
            <span>{project.status.replace('-', ' ')}</span>
          </div>
          <p>
            {project.techStack
              .slice(0, 3)
              .map((item) => item.name)
              .join(' · ')}
          </p>
          <h3>{project.title}</h3>
          <span className="premium-project-tagline">{project.tagline}</span>
          <span className="premium-project-arrow">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
