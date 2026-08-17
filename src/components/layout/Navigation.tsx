'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navigation, socialLinks } from '@/lib/constants/site';

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={`system-nav ${scrolled ? 'system-nav--scrolled' : ''}`}>
        <div className="system-nav__inner system-container">
          <Link href="/" className="system-nav__brand" aria-label="Surya.ai home">
            <span>Surya</span>
            <i>.ai</i>
            <small>AI builder · India</small>
          </Link>
          <nav className="system-nav__links" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={active(item.href) ? 'is-active' : ''}
                aria-current={active(item.href) ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <i />
              </Link>
            ))}
          </nav>
          <button
            className="system-nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <div className="system-menu">
          <div className="system-menu__grid system-container">
            <nav aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={active(item.href) ? 'is-active' : ''}
                  >
                    <small>0{index + 1}</small>
                    <span>{item.label}</span>
                    <ArrowUpRight />
                  </Link>
                </div>
              ))}
            </nav>
            <div className="system-menu__meta">
              <span className="system-label">Elsewhere</span>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.icon === 'mail' ? undefined : '_blank'}
                  rel="noreferrer"
                >
                  {link.name}
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
