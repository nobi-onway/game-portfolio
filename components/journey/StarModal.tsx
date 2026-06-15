'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Horizontal reading rail — the body lays out in side-by-side panels and the
  // mouse wheel drives the X axis so a vertical scroll reads left → right.
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (lightboxSrc) setLightboxSrc(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, lightboxSrc]);

  // Reset the rail to the start whenever a new star is opened.
  useEffect(() => {
    if (railRef.current) railRef.current.scrollLeft = 0;
  }, [node?.id]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || event.deltaY === 0) return;
    rail.scrollLeft += event.deltaY;
  };

  const accent = node ? (node.accent ?? CATEGORY_ACCENT[node.category]) : '#ffffff';
  const chart = useMiniChart(node);
  const { typed, done } = useTypewriter(node?.body ?? '', node?.id, !reducedMotion);
  const { typed: typedPassion, done: donePassion } = useTypewriter(
    node?.personal?.passion ?? '',
    node?.id ? `${node.id}-passion` : undefined,
    !reducedMotion,
  );

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
            className="glass-card relative w-full max-w-5xl overflow-hidden"
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

            {/* ── Horizontal reading rail ───────────────────────────────────
                Panels sit side-by-side; the wheel scrolls along X so a normal
                vertical scroll reads the entry left → right. */}
            <div
              ref={railRef}
              onWheel={handleWheel}
              className="no-scrollbar relative flex h-[62vh] max-h-[560px] overflow-x-auto overflow-y-hidden"
            >
              {/* ── Panel · Identity ─────────────────────────────────────── */}
              <div className="flex w-[320px] shrink-0 flex-col overflow-y-auto px-6 py-6">
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

              {/* ── My role ──────────────────────────────────────────────────
                  Makes the personal contribution explicit on team/studio work. */}
              {node.role && (
                <div
                  className="mt-4 flex items-center gap-2.5 rounded-lg border-l-2 bg-white/[0.03] px-3 py-2"
                  style={{ borderColor: accent }}
                >
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                    My role
                  </span>
                  <span className="text-xs font-bold text-white/85">{node.role}</span>
                </div>
              )}

              {node.category === 'education' && node.image && (
                <button
                  type="button"
                  onClick={() => setLightboxSrc(node.image!)}
                  className="group relative mt-5 w-full cursor-zoom-in rounded-lg border bg-black/40 p-3 transition-colors duration-300"
                  style={{ borderColor: `${accent}30` }}
                >
                  {/* Corner brackets */}
                  {(['left-1.5 top-1.5 border-l border-t', 'right-1.5 top-1.5 border-r border-t', 'left-1.5 bottom-1.5 border-l border-b', 'right-1.5 bottom-1.5 border-r border-b'] as const).map((c, i) => (
                    <span
                      key={i}
                      className={`pointer-events-none absolute size-2.5 transition-opacity duration-300 group-hover:opacity-100 opacity-50 ${c}`}
                      style={{ borderColor: accent }}
                    />
                  ))}
                  {/* Accent glow on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 24px -8px ${accent}33` }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={node.image}
                    alt={node.title}
                    className="relative h-36 w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </button>
              )}
              </div>
              {/* ── /Panel · Identity ────────────────────────────────────── */}

              {/* ── Panel · Spectral plate (hero image) ──────────────────── */}
              {node.image && node.category !== 'education' && (
                <div className="w-[300px] shrink-0 border-l border-white/10 px-6 py-6">
                  <div className="relative h-full overflow-hidden rounded-lg border border-white/10">
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
                </div>
              )}

              {/* ── Panel · Log (body + bullets) ─────────────────────────── */}
              {(!!node.body || !!node.bullets) && (
              <div className="flex w-[380px] shrink-0 flex-col overflow-y-auto border-l border-white/10 px-6 py-6">
              {node.body && (
                <p className="min-h-[3.5rem] text-sm leading-relaxed text-white/70">
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
              )}

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
              </div>
              )}
              {/* ── /Panel · Log ─────────────────────────────────────────── */}

              {/* ── Panel · Narrative (sections for origin nodes) ──────────── */}
              {node.sections && node.sections.length > 0 && (
                <div className="flex w-[420px] shrink-0 flex-col overflow-y-auto border-l border-white/10 px-6 py-6">
                  <div className="space-y-7">
                    {node.sections.map((section, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <span
                            className="font-mono text-[10px] font-black tracking-[0.3em]"
                            style={{ color: accent }}
                          >
                            {section.number}
                          </span>
                          <span
                            className="text-xs font-bold uppercase tracking-[0.2em]"
                            style={{ color: accent }}
                          >
                            {section.title}
                          </span>
                        </div>
                        <p className="text-sm font-bold leading-tight text-white mb-1.5">
                          {section.hook}
                        </p>
                        <p className="text-xs leading-relaxed text-white/60">
                          {section.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* ── /Panel · Narrative ───────────────────────────────────── */}

              {/* ── Panel · Personal (Passion + Mindset) ────────────────── */}
              {node.personal?.passion && (
                <div className="flex w-[380px] shrink-0 flex-col gap-7 overflow-y-auto border-l border-white/10 px-6 py-6">
                  <div>
                    <span
                      className="mb-3 block font-mono text-[10px] font-black uppercase tracking-[0.3em]"
                      style={{ color: accent }}
                    >
                      ✦ Passion
                    </span>
                    <p className="text-sm font-bold italic leading-relaxed text-white/85">
                      &ldquo;{typedPassion}
                      {!donePassion ? (
                        <span
                          className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse not-italic"
                          style={{ background: accent }}
                        />
                      ) : '”'}
                    </p>
                  </div>

                  {node.personal.mindset && node.personal.mindset.length > 0 && (
                    <div>
                      <span
                        className="mb-3 block font-mono text-[10px] font-black uppercase tracking-[0.3em]"
                        style={{ color: accent }}
                      >
                        ✦ Mindset
                      </span>
                      <ul className="space-y-2">
                        {node.personal.mindset.map((line, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                            <span
                              className="shrink-0 font-mono text-[10px] font-black tabular-nums"
                              style={{ color: accent }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="leading-relaxed">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {node.personal.direction && node.personal.direction.length > 0 && (
                    <div>
                      <span
                        className="mb-3 block font-mono text-[10px] font-black uppercase tracking-[0.3em]"
                        style={{ color: accent }}
                      >
                        ✦ Direction
                      </span>
                      <ul className="space-y-2">
                        {node.personal.direction.map((line, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                            <span
                              className="shrink-0 font-mono text-[10px] font-black tabular-nums"
                              style={{ color: accent }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="leading-relaxed">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {/* ── /Panel · Personal ────────────────────────────────────── */}

              {/* ── Panel · Inspirations ─────────────────────────────────── */}
              {node.personal?.inspirations && node.personal.inspirations.length > 0 && (
                <div className="flex w-[360px] shrink-0 flex-col overflow-y-auto border-l border-white/10 px-6 py-6">
                  <span
                    className="mb-4 block font-mono text-[10px] font-black uppercase tracking-[0.3em]"
                    style={{ color: accent }}
                  >
                    ✦ Inspirations
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {node.personal.inspirations.map((item, i) => {
                      const Tag = item.link ? 'a' : 'div';
                      const linkProps = item.link
                        ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
                        : {};
                      return (
                        <Tag
                          key={i}
                          {...linkProps}
                          className={`group relative overflow-hidden rounded-lg border bg-white/[0.02] px-3 py-2.5 transition-all hover:bg-white/[0.05] ${item.link ? 'cursor-pointer' : ''}`}
                          style={{ borderColor: `${accent}33` }}
                        >
                          <div
                            className="pointer-events-none absolute -top-8 -right-8 size-16 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-40"
                            style={{ background: accent }}
                          />
                          <div className="relative flex items-center gap-3">
                            <svg
                              viewBox="0 0 24 24"
                              className="size-3.5 shrink-0 fill-current transition-colors group-hover:opacity-100"
                              style={{ color: item.link ? accent : 'rgba(255,255,255,0.2)' }}
                              aria-hidden="true"
                            >
                              <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.524s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.497 1.009 2.455-.397.957-1.497 1.41-2.455 1.012zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.663 0-3.015 1.353-3.015 3.015s1.352 3.015 3.015 3.015c1.662 0 3.015-1.353 3.015-3.015zm-5.273.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
                            </svg>
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-xs font-bold text-white/90">{item.name}</h4>
                              <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{item.note}</p>
                            </div>
                          </div>
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* ── /Panel · Inspirations ────────────────────────────────── */}

              {/* ── Panel · Details (readouts + links) ───────────────────── */}
              {(node.meta || (node.links && node.links.length > 0)) && (
                <div className="flex w-[320px] shrink-0 flex-col overflow-y-auto border-l border-white/10 px-6 py-6">
              {node.meta && (
                <div className="grid grid-cols-2 gap-3">
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

              {node.links && node.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {node.links.map((link, index) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-transform hover:scale-105 ${
                        index === 0
                          ? 'text-black'
                          : 'border border-white/15 bg-white/5 text-white/80'
                      }`}
                      style={index === 0 ? { background: accent } : undefined}
                    >
                      {link.label}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ))}
                </div>
              )}
                </div>
              )}
              {/* ── /Panel · Details ─────────────────────────────────────── */}
            </div>
            {/* ── /Horizontal reading rail ─────────────────────────────────── */}

            {/* ── Footer hint ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/30">
              <span style={{ color: `${accent}cc` }}>scroll → to read entry</span>
              {(onPrev || onNext) && <span>◀ ▶ · {chart.name}</span>}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxSrc && (
        <motion.div
          className="absolute inset-0 z-[80] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setLightboxSrc(null)}
            className="absolute inset-0 cursor-zoom-out bg-black/90 backdrop-blur-md"
          />
          <motion.div
            className="relative max-h-full max-w-3xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            <div
              className="overflow-hidden rounded-xl border-2 bg-black/60 p-2 shadow-2xl"
              style={{ borderColor: `${accent}66` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxSrc}
                alt="Certificate"
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute -right-3 -top-3 rounded-full border border-white/20 bg-black/70 p-1.5 text-white/70 backdrop-blur-md transition-colors hover:text-white"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
