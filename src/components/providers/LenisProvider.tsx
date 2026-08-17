'use client';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useLenis() {
  return {
    scrollTo: (target: string | HTMLElement | number) => {
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
      else if (typeof target === 'string')
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      else target.scrollIntoView({ behavior: 'smooth' });
    },
  };
}
