import { cn } from '@/lib/utils/cn';

export interface ScrollRevealProps {
  className?: string;
  variant?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'stagger';
  delay?: number;
  children: React.ReactNode;
}

export function ScrollReveal({
  className,
  variant = 'slide-up',
  delay = 0,
  children,
}: ScrollRevealProps) {
  return (
    <div
      className={cn('safe-scroll-reveal', `safe-scroll-reveal--${variant}`, className)}
      style={{ '--reveal-delay': `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
