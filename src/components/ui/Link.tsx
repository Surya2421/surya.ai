'use client';

import { forwardRef, AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'muted' | 'gold' | 'inline';
  underline?: 'always' | 'hover' | 'never';
  external?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant = 'default', underline = 'hover', external = false, children, ...props },
    ref
  ) => {
    const variants = {
      default: 'text-foreground',
      muted: 'text-secondary',
      gold: 'text-accent',
      inline: 'text-foreground',
    };

    const underlines = {
      always: 'underline underline-offset-2',
      hover:
        'underline underline-offset-2 underline-offset-hover opacity-0 hover:opacity-100 transition-opacity',
      never: 'no-underline',
    };

    const isExternal = external || props.target === '_blank';

    return (
      <a
        ref={ref}
        className={cn(
          'transition-base inline-flex items-center gap-1.5 font-medium',
          variants[variant],
          underlines[underline],
          className
        )}
        {...props}
      >
        {children}
        {isExternal && (
          <svg
            className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
