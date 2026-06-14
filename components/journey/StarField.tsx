'use client';
import { useEffect, useMemo, useState } from 'react';

// Deterministic PRNG so server and client render identical background stars.
function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type BackgroundStar = {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

type ShootingStar = { id: number; x: number; y: number; dist: number };

export default function StarField({ reducedMotion }: { reducedMotion: boolean }) {
  const stars = useMemo<BackgroundStar[]>(() => {
    const random = mulberry32(20_240_614);
    return Array.from({ length: 110 }, () => ({
      x: random() * 100,
      y: random() * 100,
      size: random() * 1.8 + 0.4,
      duration: random() * 3 + 2,
      delay: random() * 4,
      opacity: random() * 0.5 + 0.2,
    }));
  }, []);

  const [shooting, setShooting] = useState<ShootingStar[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    let counter = 0;
    const spawn = () => {
      const current = counter++;
      setShooting(list => [
        ...list,
        {
          id: current,
          x: Math.random() * 55 + 10,
          y: Math.random() * 30,
          dist: 220 + Math.random() * 140,
        },
      ]);
      setTimeout(() => setShooting(list => list.filter(item => item.id !== current)), 1100);
    };
    const interval = setInterval(spawn, 4200);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: reducedMotion
              ? undefined
              : `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {shooting.map(item => (
        <span
          key={item.id}
          className="absolute"
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'rotate(32deg)' }}
        >
          <span
            className="block h-px w-20 bg-gradient-to-r from-transparent via-white/70 to-white"
            style={
              {
                '--dist': `${item.dist}px`,
                animation: 'shooting-star 1s ease-out forwards',
              } as React.CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
