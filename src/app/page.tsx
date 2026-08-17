import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  FlaskConical,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';
import { HeroPortrait } from '@/components/home/HeroPortrait';
import { ProjectConstellation } from '@/components/projects/ProjectConstellation';
import { SceneReveal } from '@/components/ui/SceneReveal';
import { getProjectsData } from '@/lib/projects';
import { getSiteSettings } from '@/lib/settings';

const loop = [
  [Braces, 'Build', 'Turn a concrete problem into a working first version.'],
  [FlaskConical, 'Test', 'Put model behavior, latency, and cost against real use.'],
  [PackageCheck, 'Ship', 'Move past the demo and make the result usable.'],
  [RefreshCw, 'Learn', 'Keep the evidence and improve the next build.'],
] as const;

export default async function HomePage() {
  const [projects, settings] = await Promise.all([getProjectsData(), getSiteSettings()]);
  const selected = projects.filter((project) => project.featured).length
    ? projects.filter((project) => project.featured)
    : projects.slice(0, 8);
  return (
    <div className="system-page home-system">
      <section className="home-entry system-container">
        <div className="home-entry__copy">
          <span className="system-label">Surya Teja · ECE student · AI builder</span>
          <h1 className="system-display">
            I build useful
            <br />
            things with <span className="system-signal-text">AI.</span>
          </h1>
          <p>{settings.intro}</p>
          <div className="home-entry__actions">
            <Link href="/projects" className="system-button system-button--primary">
              See what I built <ArrowUpRight />
            </Link>
            <Link href="/about" className="system-button system-button--ghost">
              About me
            </Link>
          </div>
          <div className="home-entry__proof">
            <span>Agents</span>
            <span>Automation</span>
            <span>RAG</span>
            <span>Computer vision</span>
          </div>
        </div>
        <HeroPortrait />
        <a className="home-entry__scroll" href="#work">
          <ArrowDown />
          <span>Selected work</span>
        </a>
        <div className="home-entry__telemetry">
          <span>BASED IN INDIA</span>
          <span>BUILDING IN PUBLIC</span>
        </div>
      </section>
      <section id="work" className="system-section home-projects">
        <div className="system-container">
          <SceneReveal className="home-section-head">
            <div>
              <span className="system-label">Selected work</span>
              <h2 className="system-title">
                Real builds,
                <br />
                with the decisions visible.
              </h2>
            </div>
            <div>
              <p>
                The map is generated from project data. Add or feature a project in Admin and it
                joins this view automatically.
              </p>
              <Link href="/projects">
                View every project <ArrowUpRight />
              </Link>
            </div>
          </SceneReveal>
          <SceneReveal>
            <ProjectConstellation projects={selected.slice(0, 8)} compact />
          </SceneReveal>
        </div>
      </section>
      <section className="system-section home-loop">
        <div className="system-container">
          <SceneReveal className="home-section-head">
            <div>
              <span className="system-label">How I work</span>
              <h2 className="system-title">
                Make it real.
                <br />
                Then make it better.
              </h2>
            </div>
            <p>
              I use small, complete iterations to move from uncertainty to evidence without hiding
              the messy engineering.
            </p>
          </SceneReveal>
          <div className="home-loop__grid">
            {loop.map(([Icon, title, copy], index) => (
              <SceneReveal key={title} delay={index * 0.05}>
                <article>
                  <span>0{index + 1}</span>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <i />
                </article>
              </SceneReveal>
            ))}
          </div>
        </div>
      </section>
      <section className="system-section home-handoff">
        <div className="system-container">
          <SceneReveal className="home-handoff__panel">
            <div>
              <span className="system-label">Open to useful work</span>
              <h2 className="system-title">Have a real problem worth building around?</h2>
              <p>{settings.availability}</p>
            </div>
            <Link href="/contact" className="system-button system-button--primary">
              Start a conversation <ArrowUpRight />
            </Link>
          </SceneReveal>
        </div>
      </section>
    </div>
  );
}
