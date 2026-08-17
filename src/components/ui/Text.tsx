'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextProps extends HTMLAttributes<
  HTMLParagraphElement | HTMLSpanElement | HTMLHeadingElement
> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote' | 'small';
  size?: 'xs' | 'sm' | 'body' | 'lg' | 'xl' | 'h3' | 'h2' | 'h1' | 'display';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'secondary' | 'accent' | 'foreground';
  align?: 'left' | 'center' | 'right' | 'justify';
  gradient?: boolean;
  gradientGold?: boolean;
}

function Text({
  className,
  as = 'p',
  size = 'body',
  weight = 'normal',
  color = 'default',
  align = 'left',
  gradient = false,
  gradientGold = false,
  children,
  ...props
}: TextProps) {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    body: 'text-body',
    lg: 'text-lg',
    xl: 'text-xl',
    h3: 'text-h3',
    h2: 'text-h2',
    h1: 'text-h1',
    display: 'text-display',
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colors = {
    default: 'text-foreground',
    muted: 'text-muted',
    secondary: 'text-secondary',
    accent: 'text-accent',
    foreground: 'text-foreground',
  };

  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const gradients = {
    default: 'gradient-text',
    gold: 'gradient-gold',
  };

  const Component = as;

  return (
    <Component
      className={cn(
        sizes[size],
        weights[weight],
        colors[color],
        aligns[align],
        gradient && gradients.default,
        gradientGold && gradients.gold,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Text };
