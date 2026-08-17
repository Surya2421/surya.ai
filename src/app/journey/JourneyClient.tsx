'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
const stages = [
  [
    'FOUNDATION',
    'Learning the tools',
    'Python, web development, and the habit of making small ideas visible.',
  ],
  [
    'FIRST BUILDS',
    'Working with AI',
    'RAG, LangChain, and automation experiments that exposed the gap between a prompt and a product.',
  ],
  [
    'PRODUCT THINKING',
    'Designing complete flows',
    'Interfaces, state, tools, memory, cost, and the unglamorous details that make a build usable.',
  ],
  [
    'NOW',
    'Shipping and learning in public',
    'Practical agents, automation, computer vision, and products—documented while they are still evolving.',
  ],
] as const;
export default function JourneyClient() {
  return (
    <div className="system-page journey-system">
      <div className="system-container">
        <header className="journey-hero">
          <div>
            <span className="system-label">Journey</span>
            <h1>The work became more complete over time.</h1>
          </div>
          <p>
            I did not start with a master plan. Each project revealed the next skill, constraint, or
            question worth following.
          </p>
        </header>
        <section className="journey-path">
          <div className="journey-path__rail">
            <i />
          </div>
          {stages.map(([phase, title, copy], index) => (
            <article key={phase} className={phase === 'NOW' ? 'is-current' : ''}>
              <div className="journey-path__node">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <i />
              </div>
              <div className="journey-path__state">
                <small>PHASE {String(index + 1).padStart(2, '0')}</small>
                <strong>{phase}</strong>
              </div>
              <div className="journey-path__copy">
                <h2>{title}</h2>
                <p>{copy}</p>
                {index === stages.length - 1 && (
                  <Link href="/projects">
                    See the current work <ArrowUpRight />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>
        <section className="journey-current">
          <span className="system-label">What stays constant</span>
          <div>
            <h2>Build → test → share → improve</h2>
            <p>
              The tools change. The method is still to make something real enough to learn from.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
