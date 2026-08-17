'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/project';

function position(index: number, total: number) {
  if (total === 1) return { x: 50, y: 50 };
  const angle = ((index * 137.508 - 24) * Math.PI) / 180;
  const ring = 24 + (index % 3) * 8 + Math.min(total, 10) * 0.45;
  return {
    x: Math.max(13, Math.min(87, 50 + Math.cos(angle) * ring)),
    y: Math.max(16, Math.min(84, 50 + Math.sin(angle) * ring * 0.64)),
  };
}

export function ProjectConstellation({
  projects,
  compact = false,
}: {
  projects: Project[];
  compact?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const nodes = useMemo(
    () =>
      projects.map((project, index) => ({ project, index, ...position(index, projects.length) })),
    [projects]
  );
  const selected = projects.find((project) => project.slug === active) || projects[0];
  return (
    <div className={`constellation ${compact ? 'constellation--compact' : ''}`}>
      <div className="constellation__stage" aria-label="Interactive map of Surya's projects">
        <svg
          className="constellation__lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {nodes.map((node) => (
            <line
              key={node.project.slug}
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              vectorEffect="non-scaling-stroke"
              opacity={active && active !== node.project.slug ? 0.08 : 0.32}
            />
          ))}
        </svg>
        <div className="constellation__core">
          <span>S.</span>
          <small>{projects.length} builds</small>
          <i />
        </div>
        {nodes.map((node) => (
          <motion.div
            key={node.project.slug}
            className={`constellation__node ${active === node.project.slug ? 'is-active' : ''} ${active && active !== node.project.slug ? 'is-muted' : ''}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onHoverStart={() => setActive(node.project.slug)}
            onHoverEnd={() => setActive(null)}
          >
            <Link
              href={`/projects/${node.project.slug}`}
              data-cursor="inspect"
              data-cursor-label="OPEN"
            >
              <span className="constellation__pulse" />
              <small>P-{String(node.index + 1).padStart(2, '0')}</small>
              <strong>{node.project.title}</strong>
              <em>{node.project.status.replace('-', ' ')}</em>
              <ArrowUpRight />
            </Link>
          </motion.div>
        ))}
      </div>
      <aside className="constellation__readout" aria-live="polite">
        <span className="system-label">In focus</span>
        <h3>{selected?.title || 'No projects yet'}</h3>
        <p>{selected?.tagline}</p>
        {selected && (
          <div>
            {selected.techStack.slice(0, 4).map((tech) => (
              <span key={tech.name}>{tech.name}</span>
            ))}
          </div>
        )}
      </aside>
      <div className="constellation__mobile">
        {projects.map((project, index) => (
          <Link
            href={`/projects/${project.slug}`}
            key={project.slug}
            data-cursor="inspect"
            data-cursor-label="OPEN"
          >
            <span>P-{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{project.title}</strong>
              <p>{project.tagline}</p>
            </div>
            <i>{project.status.replace('-', ' ')}</i>
            <ArrowUpRight />
          </Link>
        ))}
      </div>
    </div>
  );
}
