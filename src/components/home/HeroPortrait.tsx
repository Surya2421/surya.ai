'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function HeroPortrait() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 24, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 100, damping: 24, mass: 0.7 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4.5, 4.5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const personX = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const personY = useTransform(sy, [-0.5, 0.5], [-3, 3]);

  return (
    <div
      className="human-layer"
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - box.left) / box.width - 0.5);
        y.set((event.clientY - box.top) / box.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div className="human-layer__scene" style={{ rotateX, rotateY }}>
        <div className="human-layer__field" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="human-layer__id" aria-hidden="true">
          SURYA
        </div>
        <motion.div className="human-layer__portrait" style={{ x: personX, y: personY }}>
          <Image
            src="/images/surya-portrait-cutout.png"
            alt="Surya Teja Uta, AI product builder"
            width={1920}
            height={1920}
            priority
            sizes="(max-width: 780px) 100vw, 48vw"
          />
        </motion.div>
        <div className="human-layer__readout">
          <i />
          <span>Builder</span>
          <strong>India</strong>
        </div>
      </motion.div>
    </div>
  );
}
