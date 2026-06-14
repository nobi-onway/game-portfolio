'use client';
import { motion } from 'framer-motion';
import { CATEGORY_ACCENT, type StarCategory } from '@/data/journey-data';

export type Zone = {
  id: string;
  name: string;
  tagline: string;
  order: number;
  category: StarCategory;
  cx: number;
  cy: number;
  radius: number;
  total: number;
  found: number;
  active: boolean;
  completed: boolean;
};

// Percent string rounded to a short, stable precision. The raw geometry
// (`radius * 2 * 100` etc.) yields long floats like `30.643316977093242`, and
// framer-motion rounds those differently across the SSR vs hydration passes —
// which tripped a hydration mismatch. Rounding here makes both sides identical.
const pct = (n: number) => `${Math.round(n * 1e3) / 1e3}%`;

// Smooth curve passing near each zone centroid (quadratic through midpoints).
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  const scaled = points.map(point => ({ x: point.x * 100, y: point.y * 100 }));
  let path = `M ${scaled[0].x} ${scaled[0].y}`;
  for (let index = 1; index < scaled.length - 1; index++) {
    const midX = (scaled[index].x + scaled[index + 1].x) / 2;
    const midY = (scaled[index].y + scaled[index + 1].y) / 2;
    path += ` Q ${scaled[index].x} ${scaled[index].y} ${midX} ${midY}`;
  }
  const last = scaled[scaled.length - 1];
  path += ` L ${last.x} ${last.y}`;
  return path;
}

export default function JourneyOverview({
  zones,
  reducedMotion,
}: {
  zones: Zone[];
  reducedMotion: boolean;
}) {
  const path = smoothPath(zones.map(zone => ({ x: zone.cx, y: zone.cy })));

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Nebula auras — group stars into category-tinted regions */}
      {zones.map(zone => {
        const accent = CATEGORY_ACCENT[zone.category];
        return (
          <motion.div
            key={`aura-${zone.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[64px]"
            style={{
              left: pct(zone.cx * 100),
              top: pct(zone.cy * 100),
              width: pct(zone.radius * 2 * 100),
              height: pct(zone.radius * 2 * 100),
              background: `radial-gradient(circle, ${accent}2e 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: zone.active || zone.completed ? 0.95 : 0.45,
              scale: 1,
            }}
            transition={{ duration: 1, delay: zone.order * 0.08 }}
          />
        );
      })}

      {/* Journey spine — the chronological trail through all chapters */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="journey-spine" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#0077FF" />
            <stop offset="55%" stopColor="#5B21D4" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke="url(#journey-spine)"
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.4}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
        />
        {!reducedMotion && (
          <path
            d={path}
            fill="none"
            stroke="#A9C6FF"
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeDasharray="2 19"
            vectorEffect="non-scaling-stroke"
            style={{
              animation: 'energy-flow 2.4s linear infinite',
              filter: 'drop-shadow(0 0 3px #A9C6FF)',
              opacity: 0.5,
            }}
          />
        )}
      </svg>

      {/* Chapter watermarks — instantly legible structure */}
      {zones.map(zone => (
        <motion.div
          key={`label-${zone.id}`}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
          style={{ left: pct(zone.cx * 100), top: pct(zone.cy * 100) }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 + zone.order * 0.12 }}
        >
          <span
            className="font-black leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: zone.completed ? '#FDE68A' : '#ffffff',
              opacity: zone.active || zone.completed ? 0.16 : 0.07,
              transition: 'opacity 0.5s ease, color 0.5s ease',
            }}
          >
            {String(zone.order).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[11px] font-black uppercase tracking-[0.35em] text-white/70">
            {zone.name}
          </span>
          <span className="mt-0.5 text-[10px] font-medium tracking-wide text-white/35">
            {zone.tagline}
          </span>
          {zone.active && (
            <span
              className="mt-1.5 text-[9px] font-bold tracking-[0.2em]"
              style={{ color: CATEGORY_ACCENT[zone.category] }}
            >
              {zone.found}/{zone.total} EXPLORED
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
