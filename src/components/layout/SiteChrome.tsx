'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ContextCursor } from './ContextCursor';
import { SystemBackdrop } from './SystemBackdrop';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return <main className="min-h-screen">{children}</main>;

  return (
    <>
      <SystemBackdrop />
      <ContextCursor />
      <Navigation />
      <main key={pathname} className="system-route" style={{ paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
