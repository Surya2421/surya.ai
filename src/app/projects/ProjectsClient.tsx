'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react';
import { ProjectConstellation } from '@/components/projects/ProjectConstellation';
import { SceneReveal } from '@/components/ui/SceneReveal';
import type { Project } from '@/types/project';

const filters = ['all', 'featured', 'live', 'in-progress', 'beta', 'archived'];
export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const state =
          filter === 'all' ||
          (filter === 'featured' ? project.featured : project.status === filter);
        const needle = query.trim().toLowerCase();
        const search =
          !needle ||
          [
            project.title,
            project.tagline,
            project.category,
            ...project.techStack.map((item) => item.name),
          ].some((value) => value?.toLowerCase().includes(needle));
        return state && search;
      }),
    [projects, filter, query]
  );
  return (
    <div className="system-page projects-system">
      <div className="system-container">
        <header className="projects-hero">
          <div>
            <span className="system-label">
              Work archive · {String(projects.length).padStart(2, '0')} projects
            </span>
            <h1>
              Things I built,
              <br />
              and what they taught me.
            </h1>
          </div>
          <p>
            Agents, automation, computer vision, RAG, and small products—each shown with the
            thinking and engineering behind it.
          </p>
        </header>
        <div className="projects-controls">
          <div>
            <SlidersHorizontal />
            {filters.map((item) => (
              <button
                key={item}
                className={filter === item ? 'is-active' : ''}
                onClick={() => setFilter(item)}
              >
                {item.replace('-', ' ')}
              </button>
            ))}
          </div>
          <label>
            <Search />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects or technology"
            />
          </label>
        </div>
        {filtered.length ? (
          <>
            <SceneReveal>
              <ProjectConstellation projects={filtered} />
            </SceneReveal>
            <section className="projects-index">
              <div className="projects-index__head">
                <span>Project index</span>
                <span>{String(filtered.length).padStart(2, '0')} shown</span>
              </div>
              {filtered.map((project, index) => (
                <SceneReveal key={project.slug} delay={Math.min(index * 0.03, 0.16)}>
                  <Link
                    href={`/projects/${project.slug}`}
                    data-cursor="inspect"
                    data-cursor-label="OPEN"
                  >
                    <span>P-{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <small>{project.category}</small>
                      <h2>{project.title}</h2>
                      <p>{project.tagline}</p>
                    </div>
                    <div className="projects-index__tech">
                      {project.techStack.slice(0, 3).map((item) => (
                        <i key={item.name}>{item.name}</i>
                      ))}
                    </div>
                    <strong>{project.status.replace('-', ' ')}</strong>
                    <ArrowUpRight />
                  </Link>
                </SceneReveal>
              ))}
            </section>
          </>
        ) : (
          <div className="projects-empty">
            <Search />
            <h2>No projects match that search.</h2>
            <p>Clear the query or choose another filter.</p>
            <button
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
