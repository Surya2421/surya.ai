import { ArrowDown, ArrowUpRight, Camera, Code2, Link2, Mail, Play } from 'lucide-react';
import { SceneReveal } from '@/components/ui/SceneReveal';
import { getSiteSettings } from '@/lib/settings';
export const metadata = { title: 'Contact', description: 'Contact Surya Teja.' };
export default async function ContactPage() {
  const settings = await getSiteSettings();
  const channels = [
    [
      Mail,
      'Email',
      'Start with the problem, context, and what a useful outcome looks like.',
      `mailto:${settings.email}`,
    ],
    [
      Link2,
      'LinkedIn',
      'Professional conversations, collaborations, and opportunities.',
      settings.linkedin,
    ],
    [Code2, 'GitHub', 'Code, repositories, and technical work.', settings.github],
    [Play, 'YouTube', 'Project walkthroughs and longer build stories.', settings.youtube],
    [Camera, 'Instagram', 'Short progress notes and behind-the-scenes work.', settings.instagram],
  ] as const;
  return (
    <div className="system-page contact-system">
      <div className="system-container">
        <header className="contact-entry">
          <span className="system-label">Contact</span>
          <h1>Tell me what you want to make real.</h1>
          <p>
            {settings.availability} A useful first message explains the problem, who it affects, and
            what you have tried already.
          </p>
          <ArrowDown />
        </header>
        <section className="contact-flow">
          <div className="contact-flow__aside">
            <span>BEST START</span>
            <strong>{settings.email}</strong>
            <p>No corporate form. Use the channel that fits the conversation.</p>
          </div>
          <div className="contact-channels">
            {channels.map(([Icon, title, copy, href], index) => (
              <SceneReveal key={title} delay={index * 0.04}>
                <a
                  href={href}
                  target={title === 'Email' ? undefined : '_blank'}
                  rel="noreferrer"
                  data-cursor="inspect"
                  data-cursor-label="OPEN ↗"
                >
                  <span>0{index + 1}</span>
                  <Icon />
                  <div>
                    <h2>{title}</h2>
                    <p>{copy}</p>
                  </div>
                  <ArrowUpRight />
                </a>
              </SceneReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
