'use client';

import { useEffect, useRef, useState } from 'react';

export function ContextCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'active' | 'inspect'>('idle');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
    if (!finePointer.matches) return;

    const move = (event: PointerEvent) => {
      if (ref.current)
        ref.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-cursor], a, button'
      );
      const mode = target?.dataset.cursor;
      if (mode === 'inspect') {
        setState('inspect');
        setLabel(target?.dataset.cursorLabel || 'Inspect');
      } else if (target) {
        setState('active');
        setLabel('');
      } else {
        setState('idle');
        setLabel('');
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div ref={ref} className="context-cursor" data-state={state} aria-hidden="true">
      <span className="context-cursor__dot" />
      <span className="context-cursor__label">{label}</span>
    </div>
  );
}
