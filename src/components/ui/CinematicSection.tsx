'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type CinematicSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  shot?: 'opening' | 'rise' | 'turn' | 'wide' | 'closing';
};

type ShotConfig = {
  y: number[];
  scale: number[];
  rotateX: number[];
  opacity: number[];
};

export function CinematicSection({
  children,
  className,
  id,
  shot = 'rise',
}: CinematicSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const configurations: Record<NonNullable<CinematicSectionProps['shot']>, ShotConfig> = {
    opening: { y: [0, 0, -90], scale: [1, 1, 0.94], rotateX: [0, 0, -4], opacity: [1, 1, 0.3] },
    rise: { y: [130, 0, -70], scale: [0.9, 1, 0.96], rotateX: [10, 0, -4], opacity: [0, 1, 0.55] },
    turn: { y: [110, 0, -55], scale: [0.92, 1, 0.97], rotateX: [8, 0, -3], opacity: [0, 1, 0.6] },
    wide: { y: [85, 0, -40], scale: [0.95, 1, 0.98], rotateX: [5, 0, -2], opacity: [0, 1, 0.7] },
    closing: { y: [100, 0, 0], scale: [0.9, 1, 1], rotateX: [9, 0, 0], opacity: [0, 1, 1] },
  };

  const config = configurations[shot];
  const y = useTransform(scrollYProgress, [0, 0.28, 1], config.y);
  const scale = useTransform(scrollYProgress, [0, 0.28, 1], config.scale);
  const rotateX = useTransform(scrollYProgress, [0, 0.28, 1], config.rotateX);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 1], config.opacity);
  const blur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.85, 1],
    [10, 0, 0, shot === 'closing' ? 0 : 3]
  );
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn('cinematic-scene', `cinematic-scene--${shot}`, className)}
      style={{ y, scale, rotateX, opacity, filter }}
    >
      {children}
    </motion.section>
  );
}
