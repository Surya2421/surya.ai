import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Bot, CircuitBoard, Radio, Wrench } from 'lucide-react';
import { SceneReveal } from '@/components/ui/SceneReveal';

const modes = [
  [Bot, 'Agents', 'Research, search, and task workflows that can reason and use tools.'],
  [CircuitBoard, 'Products', 'Interfaces that turn AI capability into something a person can use.'],
  [Radio, 'Automation', 'Connected workflows that remove repeated operational work.'],
  [Wrench, 'Experiments', 'Focused builds that answer a technical or product question.'],
] as const;
export const metadata = {
  title: 'About',
  description: 'About Surya Teja, an ECE student and AI builder.',
};
export default function AboutPage() {
  return (
    <div className="system-page about-system">
      <div className="system-container">
        <section className="about-human">
          <SceneReveal className="about-human__portrait">
            <div className="about-human__field" />
            <Image
              src="/images/surya-portrait-cutout.png"
              alt="Surya Teja"
              width={1920}
              height={1920}
              priority
            />
            <span>SURYA TEJA · INDIA</span>
          </SceneReveal>
          <SceneReveal className="about-human__copy">
            <span className="system-label">About</span>
            <h1>I learn by building things that have to work.</h1>
            <p>
              I&apos;m Surya Teja, a third-year Electronics and Communication Engineering student
              who spends most of his time turning AI ideas into usable projects.
            </p>
            <div>
              <span>ECE</span>
              <span>AI engineering</span>
              <span>Building in public</span>
              <span>Product thinking</span>
            </div>
          </SceneReveal>
        </section>
        <section className="about-story">
          <SceneReveal>
            <span className="system-label">The overlap</span>
            <h2>Engineering gives me the constraints. AI gives me new tools.</h2>
          </SceneReveal>
          <SceneReveal>
            <p>
              My ECE background trained me to think in signals, components, and trade-offs. Building
              software taught me to think about people, interfaces, and iteration. Most of my work
              lives where those habits meet.
            </p>
            <p>
              I explore agents, RAG, computer vision, content automation, and practical workflows. I
              share the unfinished process because the decisions and failures are often more useful
              than a clean launch screenshot.
            </p>
          </SceneReveal>
        </section>
        <section className="about-modes">
          <div className="about-modes__head">
            <span className="system-label">What I keep exploring</span>
            <h2 className="system-subtitle">Four kinds of work.</h2>
          </div>
          <div>
            {modes.map(([Icon, title, copy], index) => (
              <SceneReveal key={title} delay={index * 0.04}>
                <article>
                  <span>0{index + 1}</span>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              </SceneReveal>
            ))}
          </div>
        </section>
        <SceneReveal className="about-next">
          <div>
            <span className="system-label">The work changed over time</span>
            <h2>See how experiments became complete builds.</h2>
          </div>
          <Link href="/journey" className="system-button system-button--primary">
            Follow the journey <ArrowUpRight />
          </Link>
        </SceneReveal>
      </div>
    </div>
  );
}
