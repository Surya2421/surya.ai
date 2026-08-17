'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'subtle' | 'gold' | 'gradient';
  length?: 'full' | 'half' | 'quarter' | 'auto';
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = 'horizontal', variant = 'default', length = 'full', ...props },
    ref
  ) => {
    const variants = {
      default: 'bg-border',
      subtle: 'bg-border/50',
      gold: 'bg-accent',
      gradient: 'bg-gradient-to-r from-transparent via-accent to-transparent',
    };

    const lengths = {
      full: orientation === 'horizontal' ? 'w-full' : 'h-full',
      half: orientation === 'horizontal' ? 'w-1/2' : 'h-1/2',
      quarter: orientation === 'horizontal' ? 'w-1/4' : 'h-1/4',
      auto: orientation === 'horizontal' ? 'w-auto' : 'h-auto',
    };

    const orientations = {
      horizontal: 'h-px',
      vertical: 'w-px',
    };

    return (
      <div
        ref={ref}
        className={cn(orientations[orientation], lengths[length], variants[variant], className)}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
