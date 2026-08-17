'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { navigation, siteConfig } from '@/lib/constants/site';

type PublicSettings = {
  identity: string;
  availability: string;
  email: string;
  linkedin: string;
  github: string;
  youtube: string;
  instagram: string;
};
const defaults: PublicSettings = {
  identity: 'ECE student and AI builder working from India.',
  availability: 'Open to thoughtful collaborations and practical AI builds.',
  email: siteConfig.author.email,
  linkedin: siteConfig.links.linkedin,
  github: siteConfig.links.github,
  youtube: siteConfig.links.youtube,
  instagram: siteConfig.links.instagram,
};

export function Footer() {
  const [settings, setSettings] = useState(defaults);
  useEffect(() => {
    fetch('/api/public-settings')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => undefined);
  }, []);
  const channels = [
    ['Email', `mailto:${settings.email}`],
    ['LinkedIn', settings.linkedin],
    ['GitHub', settings.github],
    ['YouTube', settings.youtube],
    ['Instagram', settings.instagram],
  ];
  return (
    <footer className="system-footer">
      <div className="system-container">
        <div className="system-footer__lead">
          <div>
            <Link href="/" className="system-footer__brand">
              Surya<span>.ai</span>
            </Link>
            <h2>I make practical AI ideas real.</h2>
          </div>
          <p>
            {settings.identity} {settings.availability}
          </p>
        </div>
        <div className="system-footer__map">
          <nav aria-label="Footer navigation">
            {navigation.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="system-footer__channels">
            {channels.map(([name, href]) => (
              <a
                key={name}
                href={href}
                target={name === 'Email' ? undefined : '_blank'}
                rel="noreferrer"
              >
                {name}
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </div>
        <div className="system-footer__bottom">
          <span>© {new Date().getFullYear()} Surya.ai</span>
          <span>Designed and built by Surya Teja.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
