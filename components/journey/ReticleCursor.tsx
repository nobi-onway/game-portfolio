'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// A sci-fi targeting reticle that replaces the native cursor inside the galaxy.
// It locks/expands when hovering a star. Position is pushed straight to the DOM
// via a ref (no React re-render on mousemove); only `active` flips state.
export default function ReticleCursor({
  active,
  visible,
  reducedMotion,
}: {
  active: boolean;
  visible: boolean;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    setFinePointer(query.matches);
    const handler = (event: MediaQueryListEvent) => setFinePointer(event.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!finePointer) return;
    const node = rootRef.current;
    if (!node) return;
    // Park it at viewport centre until the first mousemove.
    node.style.transform = `translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0)`;
    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [finePointer]);

  if (!finePointer) return null;

  const ringSize = active ? 26 : 40;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[55] mix-blend-screen"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        {/* Rotating bracket ring */}
        <motion.div
          className="relative"
          animate={{
            width: ringSize,
            height: ringSize,
            rotate: reducedMotion ? 0 : active ? 90 : 0,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          {(['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'] as const).map(
            corner => (
              <span
                key={corner}
                className={`absolute size-2 ${corner}`}
                style={{ borderColor: active ? 'var(--primary)' : 'rgba(255,255,255,0.7)' }}
              />
            ),
          )}
        </motion.div>

        {/* Center dot */}
        <motion.span
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{ background: active ? 'var(--primary)' : '#ffffff' }}
          animate={{
            width: active ? 5 : 3,
            height: active ? 5 : 3,
            x: '-50%',
            y: '-50%',
            boxShadow: active ? '0 0 10px var(--primary)' : '0 0 4px rgba(255,255,255,0.6)',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        />
      </div>
    </div>
  );
}
