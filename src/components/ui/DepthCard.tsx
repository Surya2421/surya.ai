'use client';

import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export function DepthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 170, damping: 24 });
  const smoothY = useSpring(y, { stiffness: 170, damping: 24 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const shineX = useTransform(smoothX, [-0.5, 0.5], ['10%', '90%']);
  const shineY = useTransform(smoothY, [-0.5, 0.5], ['15%', '85%']);

  return (
    <motion.div
      className={cn('depth-card-shell', className)}
      style={{ rotateX, rotateY }}
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - bounds.left) / bounds.width - 0.5);
        y.set((event.clientY - bounds.top) / bounds.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.i
        className="depth-card-shine"
        style={{ left: shineX, top: shineY }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}
