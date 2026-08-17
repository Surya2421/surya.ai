'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-accent text-bg-primary hover:bg-accent-muted active:bg-accent-gold/90 shadow-glow',
      secondary: 'bg-surface text-foreground hover:bg-elevated border border-subtle',
      ghost: 'text-foreground hover:bg-elevated',
      outline: 'border border-subtle text-foreground hover:bg-elevated hover:border-accent/50',
      gold: 'bg-transparent border border-accent text-accent hover:bg-accent/10 hover:text-accent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-md',
      md: 'px-5 py-2.5 text-body gap-2 rounded-lg',
      lg: 'px-7 py-3.5 text-body gap-2.5 rounded-xl',
      xl: 'px-10 py-4.5 text-h3 gap-3 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
