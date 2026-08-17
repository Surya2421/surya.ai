'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Play } from 'lucide-react';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { SafeProjectImage } from '@/components/projects/SafeProjectImage';
import { SceneReveal } from '@/components/ui/SceneReveal';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import type { Project } from '@/types/project';

const exists = (value?: string) => Boolean(value && value.trim());
export default function ProjectDetail({
  project,
  relatedProjects = [],
}: {
  project: Project;
  relatedProjects?: Project[];
}) {
  const hasVideo = exists(project.demoVideo?.mp4) || exists(project.demoVideo?.webm);
  return (
    <div className="system-page project-machine">
      <div className="system-container">
        <Link className="project-machine__back" href="/projects">
          <ArrowLeft /> Back to work
        </Link>
        <section className="project-machine__hero">
          <SceneReveal className="project-machine__identity">
            <div>
              <span>P-{String(Math.max(project.order, 1)).padStart(2, '0')}</span>
              <i />
              <span>{project.status.replace('-', ' ')}</span>
              <span>{project.category}</span>
            </div>
            <h1>{project.title}</h1>
            <p>{project.tagline}</p>
            <nav>
              {exists(project.links.live) && (
                <a
                  className="system-button system-button--primary"
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open demo <ExternalLink />
                </a>
              )}
              {exists(project.links.github) && (
                <a
                  className="system-button system-button--ghost"
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub <ArrowUpRight />
                </a>
              )}
              {exists(project.links.caseStudy) && (
                <a
                  className="system-button system-button--ghost"
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noreferrer"
                >
                  Case study <ArrowUpRight />
                </a>
              )}
            </nav>
          </SceneReveal>
          <SceneReveal className="project-machine__visual">
            {project.coverImage ? (
              <SafeProjectImage
                src={project.coverImage}
                alt={`${project.title} cover`}
                index={Math.max(project.order - 1, 0)}
              />
            ) : (
              <ProjectVisual title={project.title} index={Math.max(project.order - 1, 0)} />
            )}
            <div>
              {project.techStack.slice(0, 6).map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </div>
          </SceneReveal>
        </section>
        <section className="machine-pair">
          <SceneReveal>
            <span className="system-label">01 · Problem</span>
            <h2>What needed to change.</h2>
            <p>{project.problem}</p>
          </SceneReveal>
          <SceneReveal delay={0.06}>
            <span className="system-label">02 · Idea</span>
            <h2>The direction I took.</h2>
            <p>{project.solution}</p>
          </SceneReveal>
        </section>
        {project.description && (
          <SceneReveal className="machine-section">
            <div>
              <span className="system-label">03 · Build</span>
              <h2>What I made.</h2>
            </div>
            <p>{project.description}</p>
          </SceneReveal>
        )}
        {project.howItWorks && (
          <SceneReveal className="machine-section">
            <div>
              <span className="system-label">04 · Approach</span>
              <h2>How it works.</h2>
            </div>
            <p>{project.howItWorks}</p>
          </SceneReveal>
        )}
        {project.architecture && (
          <SceneReveal className="machine-section machine-architecture">
            <div>
              <span className="system-label">05 · Architecture</span>
              <h2>Inside the build.</h2>
            </div>
            <pre>{project.architecture}</pre>
          </SceneReveal>
        )}
        {hasVideo && (
          <section className="project-video">
            <SceneReveal>
              <span className="system-label">
                <Play /> Demo video
              </span>
              <h2 className="system-title">See it working.</h2>
            </SceneReveal>
            <SceneReveal>
              <VideoPlayer
                mp4={project.demoVideo?.mp4}
                webm={project.demoVideo?.webm}
                poster={project.demoVideo?.poster}
                muted
                className="project-video__player"
              />
            </SceneReveal>
          </section>
        )}
        {project.screenshots.length > 0 && (
          <section className="machine-gallery">
            <SceneReveal>
              <span className="system-label">06 · Interface</span>
              <h2 className="system-title">The work, frame by frame.</h2>
              <p>Scroll through the interface evidence instead of seeing it dumped all at once.</p>
            </SceneReveal>
            <div>
              {project.screenshots.map((shot, index) => (
                <SceneReveal
                  key={`${shot.src}-${index}`}
                  delay={Math.min(index * 0.04, 0.12)}
                  className={index % 2 ? 'is-offset' : ''}
                >
                  <SafeProjectImage
                    src={shot.src}
                    alt={shot.alt}
                    caption={shot.caption}
                    index={index}
                  />
                </SceneReveal>
              ))}
            </div>
          </section>
        )}
        <section className="machine-tech">
          <SceneReveal>
            <span className="system-label">07 · Technology</span>
            <h2 className="system-title">Tools chosen for the job.</h2>
          </SceneReveal>
          <div>
            {project.techStack.map((item, index) => (
              <SceneReveal
                key={`${item.category}-${item.name}`}
                delay={Math.min(index * 0.025, 0.14)}
              >
                <article>
                  <span>{item.category}</span>
                  <strong>{item.name}</strong>
                  <i />
                </article>
              </SceneReveal>
            ))}
          </div>
        </section>
        {project.lessonsLearned.length > 0 && (
          <section className="machine-learnings">
            <SceneReveal>
              <span className="system-label">08 · Learnings</span>
              <h2 className="system-title">What I would carry forward.</h2>
            </SceneReveal>
            <div>
              {project.lessonsLearned.map((lesson, index) => (
                <SceneReveal key={lesson} delay={index * 0.03}>
                  <article>
                    <Check />
                    <span>{lesson}</span>
                  </article>
                </SceneReveal>
              ))}
            </div>
          </section>
        )}
        {relatedProjects.length > 0 && (
          <section className="machine-related">
            <span className="system-label">Keep exploring</span>
            <div>
              {relatedProjects.map((item, index) => (
                <Link
                  href={`/projects/${item.slug}`}
                  key={item.slug}
                  data-cursor="inspect"
                  data-cursor-label="OPEN"
                >
                  <span>P-{String(index + 1).padStart(2, '0')}</span>
                  <h2>{item.title}</h2>
                  <p>{item.tagline}</p>
                  <ArrowUpRight />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
