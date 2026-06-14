'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  CATEGORY_ACCENT,
  CATEGORY_LABEL,
  CONSTELLATIONS,
  STAR_NODES,
  type StarNode,
} from '@/data/journey-data';
import { usePrefersReducedMotion } from './motion-hooks';

// ── Mini constellation chart ─────────────────────────────────────────────────
// Re-projects the current star's constellation into a wide banner viewBox.
function useMiniChart(node: StarNode | null) {
  return useMemo(() => {
    if (!node) return null;

    const members = STAR_NODES.filter(n => n.constellationId === node.constellationId);
    const constellation = CONSTELLATIONS.find(c => c.id === node.constellationId);

    const W = 200;
    const H = 64;
    const pad = 18;

    const xs = members.map(m => m.x);
    const ys = members.map(m => m.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX;
    const spanY = maxY - minY;

    const project = (m: StarNode) => ({
      cx: spanX < 0.001 ? W / 2 : pad + ((m.x - minX) / spanX) * (W - 2 * pad),
      cy: spanY < 0.001 ? H / 2 : pad + ((m.y - minY) / spanY) * (H - 2 * pad),
    });

    const points = members.map(m => ({
      id: m.id,
      active: m.id === node.id,
      ...project(m),
    }));

    const lookup = new Map(points.map(p => [p.id, p]));
    const lines = (constellation?.edges ?? [])
      .map(([a, b]) => ({ a: lookup.get(a), b: lookup.get(b) }))
      .filter((edge): edge is { a: (typeof points)[number]; b: (typeof points)[number] } =>
        Boolean(edge.a && edge.b),
      );

    return {
      name: constellation?.name ?? '',
      points,
      lines,
    };
  }, [node]);
}

// ── Typewriter body reveal ───────────────────────────────────────────────────
function useTypewriter(text: string, key: string | undefined, enabled: boolean) {
  const [typed, setTyped] = useState(text);
  const [done, setDone] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setTyped(text);
      setDone(true);
      return;
    }
    setTyped('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(timer);
      }
    }, 12);
    return () => clearInterval(timer);
    // key changes whenever a new star is opened → restart the type-on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return { typed, done };
}

export default function StarModal({
  node,
  onClose,
  onPrev,
  onNext,
}: {
  node: StarNode | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const accent = node ? (node.accent ?? CATEGORY_ACCENT[node.category]) : '#ffffff';
  const chart = useMiniChart(node);
  const { typed, done } = useTypewriter(node?.body ?? '', node?.id, !reducedMotion);

  return (
    <AnimatePresence>
      {node && chart && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Prev / next — pair with ◀ ▶ keys and the scroll wheel */}
          {onPrev && (
            <button
              type="button"
              aria-label="Previous star"
              onClick={onPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white/60 backdrop-blur-md transition-colors hover:text-white md:left-6"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              aria-label="Next star"
              onClick={onNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white/60 backdrop-blur-md transition-colors hover:text-white md:right-6"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={node.title}
            className="glass-card relative w-full max-w-md overflow-hidden"
            style={{ borderColor: `${accent}55` }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {/* Corner brackets — the HUD frame */}
            {(['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-l border-b', 'right-3 bottom-3 border-r border-b'] as const).map(
              corner => (
                <span
                  key={corner}
                  className={`pointer-events-none absolute z-20 size-4 ${corner}`}
                  style={{ borderColor: `${accent}aa` }}
                />
              ),
            )}

            <div
              className="pointer-events-none absolute -top-16 right-0 size-40 rounded-full blur-3xl"
              style={{ background: accent, opacity: 0.18 }}
            />

            {/* ── Header bar ─────────────────────────────────────────────── */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div
                className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: accent }}
              >
                <span
                  className={`size-1.5 rounded-full ${reducedMotion ? '' : 'animate-pulse'}`}
                  style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                />
                Observation Log
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-black/40 p-1.5 text-white/70 transition-colors hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative max-h-[78vh] overflow-y-auto px-5 py-5 md:px-6">
              {/* ── Constellation chart banner ───────────────────────────── */}
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/40">
                <svg viewBox="0 0 200 64" className="h-20 w-full" aria-hidden="true">
                  {chart.lines.map((edge, index) => (
                    <line
                      key={index}
                      x1={edge.a.cx}
                      y1={edge.a.cy}
                      x2={edge.b.cx}
                      y2={edge.b.cy}
                      stroke={accent}
                      strokeWidth={0.5}
                      strokeOpacity={0.4}
                    />
                  ))}
                  {chart.points.map(point => (
                    <g key={point.id}>
                      {point.active && (
                        <circle
                          cx={point.cx}
                          cy={point.cy}
                          r={4}
                          fill="none"
                          stroke={accent}
                          strokeWidth={0.75}
                          opacity={0.7}
                        >
                          {!reducedMotion && (
                            <animate
                              attributeName="r"
                              values="3;6;3"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          )}
                        </circle>
                      )}
                      <circle
                        cx={point.cx}
                        cy={point.cy}
                        r={point.active ? 2.2 : 1.3}
                        fill={point.active ? accent : '#ffffff'}
                        fillOpacity={point.active ? 1 : 0.45}
                        style={point.active ? { filter: `drop-shadow(0 0 3px ${accent})` } : undefined}
                      />
                    </g>
                  ))}
                </svg>
                <span className="absolute bottom-1.5 right-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">
                  {chart.name}
                </span>
              </div>

              {/* ── Spectral plate (hero image) ──────────────────────────── */}
              {node.image && (
                <div className="relative mt-5 h-40 overflow-hidden rounded-lg border border-white/10 md:h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={node.image}
                    alt={node.title}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 3px)',
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: `inset 0 -40px 60px -20px ${accent}55` }}
                  />
                  <span className="absolute left-2 top-2 font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-white/55">
                    ▣ Spectral Plate
                  </span>
                </div>
              )}

              {/* ── Identity ─────────────────────────────────────────────── */}
              <div className="mt-5 flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
                />
                <span
                  className="text-[10px] font-black uppercase tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  {CATEGORY_LABEL[node.category]}
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                {node.title}
              </h3>
              {node.subtitle && (
                <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                  {node.subtitle}
                </p>
              )}

              {/* ── Typed body ───────────────────────────────────────────── */}
              <p className="mt-5 min-h-[3.5rem] text-sm leading-relaxed text-white/70">
                <span className="mr-1 font-mono" style={{ color: accent }}>
                  ›
                </span>
                {typed}
                {!done && (
                  <span
                    className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse"
                    style={{ background: accent }}
                  />
                )}
              </p>

              {node.bullets && (
                <ul className="mt-5 space-y-2.5 border-t border-white/5 pt-5">
                  {node.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs text-white/70">
                      <span
                        className="mt-px font-mono text-[10px] font-bold tabular-nums"
                        style={{ color: accent }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {node.meta && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {node.meta.map(item => (
                    <div
                      key={item.label}
                      className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <span
                        className="absolute left-0 top-3 h-4 w-px"
                        style={{ background: accent }}
                      />
                      <p className="pl-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                        {item.label}
                      </p>
                      <p className="mt-1 pl-2 text-sm font-bold text-white/90">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {node.link && (
                <a
                  href={node.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105"
                  style={{ background: accent }}
                >
                  {node.link.label}
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              {(onPrev || onNext) && (
                <p className="mt-6 border-t border-white/5 pt-4 font-mono text-[10px] font-medium uppercase tracking-wider text-white/25">
                  ◀ ▶ / scroll · next entry in {chart.name}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
