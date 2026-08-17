'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Edit3, Eye, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import type { Project } from '@/types/project';

const filters = ['all', 'published', 'draft', 'live', 'in-progress', 'beta'];
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const update = async (project: Project, patch: Partial<Project>) => {
    await fetch(`/api/projects/${project.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, ...patch }),
    });
    refresh();
  };
  const duplicate = async (slug: string) => {
    await fetch(`/api/projects/${slug}/duplicate`, { method: 'POST' });
    refresh();
  };
  const remove = async (project: Project) => {
    if (!confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    await fetch(`/api/projects/${project.slug}`, { method: 'DELETE' });
    refresh();
  };
  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const needle = query.toLowerCase();
        return (
          (!needle ||
            [project.title, project.tagline, ...project.techStack.map((item) => item.name)].some(
              (value) => value.toLowerCase().includes(needle)
            )) &&
          (filter === 'all' || project.status === filter || project.publishState === filter)
        );
      }),
    [projects, query, filter]
  );
  return (
    <div className="admin-page admin-list-page">
      <header className="admin-list-header">
        <div>
          <span>Project inventory</span>
          <h1>Manage the work.</h1>
          <p>
            Create, publish, feature, duplicate, reorder, and archive projects from one readable
            workspace.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Plus />
          New project
        </Link>
      </header>
      <section className="admin-list-toolbar">
        <div>
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
      </section>
      <div className="admin-list-meta">
        <span>{String(filtered.length).padStart(2, '0')} projects visible</span>
        <span>Actions save immediately</span>
      </div>
      {loading ? (
        <div className="admin-list-empty">
          <i />
          <p>Loading projects…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-list-empty">
          <Search />
          <h2>No projects found.</h2>
          <button
            onClick={() => {
              setFilter('all');
              setQuery('');
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <section className="admin-project-stack">
          {filtered.map((project, index) => (
            <article key={project.slug} className="admin-project-card">
              <span className="admin-project-card__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="admin-project-card__identity">
                <Link href={`/admin/projects/${project.slug}/edit`}>{project.title}</Link>
                <p>{project.tagline}</p>
                <div>
                  {project.techStack.slice(0, 4).map((item) => (
                    <span key={item.name}>{item.name}</span>
                  ))}
                </div>
              </div>
              <div className="admin-project-card__state">
                <span>{project.status.replace('-', ' ')}</span>
                <button
                  className={project.publishState === 'published' ? 'is-on' : ''}
                  onClick={() =>
                    update(project, {
                      publishState: project.publishState === 'published' ? 'draft' : 'published',
                    })
                  }
                >
                  <Check />
                  {project.publishState}
                </button>
                <button
                  className={project.featured ? 'is-on' : ''}
                  onClick={() => update(project, { featured: !project.featured })}
                >
                  <Sparkles />
                  {project.featured ? 'Featured' : 'Feature'}
                </button>
              </div>
              <div className="admin-project-card__actions">
                <Link href={`/projects/${project.slug}`} target="_blank" title="View public page">
                  <Eye />
                </Link>
                <Link href={`/admin/projects/${project.slug}/edit`} title="Edit">
                  <Edit3 />
                </Link>
                <button onClick={() => duplicate(project.slug)} title="Duplicate">
                  <Copy />
                </button>
                <button onClick={() => remove(project)} title="Delete">
                  <Trash2 />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
