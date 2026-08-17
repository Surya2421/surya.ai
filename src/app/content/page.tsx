import { ArrowUpRight, BookOpen, Camera, Code2, Play, TerminalSquare } from 'lucide-react';
import { SceneReveal } from '@/components/ui/SceneReveal';
import { getSiteSettings } from '@/lib/settings';

const topics = [
  [
    TerminalSquare,
    'Build logs',
    'Architecture choices, implementation notes, and what changed during a project.',
  ],
  [
    BookOpen,
    'AI notes',
    'Clear explanations of agents, RAG, evaluation, and useful model behavior.',
  ],
  [
    Code2,
    'Technical breakdowns',
    'The engineering behind workflows, interfaces, and deployment decisions.',
  ],
] as const;
export const metadata = {
  title: 'Notes',
  description: 'Build logs, AI notes, experiments, and technical breakdowns by Surya Teja.',
};
export default async function ContentPage() {
  const settings = await getSiteSettings();
  const channels = [
    [Play, 'YouTube', 'Longer walkthroughs and build videos.', settings.youtube],
    [Code2, 'GitHub', 'Code and implementation evidence.', settings.github],
    [Camera, 'Instagram', 'Short progress notes from the build.', settings.instagram],
  ] as const;
  return (
    <div className="system-page content-system">
      <div className="system-container">
        <header className="content-hero">
          <div>
            <span className="system-label">Notes and publishing</span>
            <h1>I write down what the build taught me.</h1>
          </div>
          <p>
            Build logs, technical breakdowns, experiments, and lessons from making AI projects
            behave outside a demo.
          </p>
        </header>
        <section className="content-topics">
          <div className="content-topics__intro">
            <span className="system-label">Current threads</span>
            <h2>Ideas I&apos;m actively documenting.</h2>
          </div>
          <div>
            {topics.map(([Icon, title, copy], index) => (
              <SceneReveal key={title} delay={index * 0.05}>
                <article>
                  <span>0{index + 1}</span>
                  <Icon />
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              </SceneReveal>
            ))}
          </div>
        </section>
        <section className="content-channels">
          <div className="content-channels__heading">
            <span className="system-label">Published elsewhere</span>
            <h2>Choose the format you prefer.</h2>
          </div>
          {channels.map(([Icon, title, copy, href], index) => (
            <SceneReveal key={title} delay={index * 0.05}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor="inspect"
                data-cursor-label="OPEN ↗"
              >
                <span>0{index + 1}</span>
                <Icon />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <ArrowUpRight />
              </a>
            </SceneReveal>
          ))}
        </section>
      </div>
    </div>
  );
}
