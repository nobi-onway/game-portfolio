'use client';
import { useEffect, useRef } from 'react';

// Film-grain tile — a tiny fractal-noise SVG repeated across the viewport.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// A persistent, diegetic "mission console" frame over the whole viewport:
// corner brackets, CRT scanlines + film grain, and a live telemetry readout.
// Purely decorative (pointer-events-none) so it never blocks the galaxy.
export default function HudFrame({
  discovered,
  total,
  reducedMotion,
}: {
  discovered: number;
  total: number;
  reducedMotion: boolean;
}) {
  const coordRef = useRef<HTMLSpanElement>(null);

  // Live cursor coordinates — written straight to the DOM (no re-render).
  useEffect(() => {
    const node = coordRef.current;
    if (!node) return;
    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const ra = Math.round((event.clientX / window.innerWidth) * 360);
        const dec = Math.round((event.clientY / window.innerHeight) * 180) - 90;
        node.textContent = `RA ${String(ra).padStart(3, '0')}° · DEC ${dec >= 0 ? '+' : '−'}${String(Math.abs(dec)).padStart(2, '0')}°`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
      {/* CRT scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px)',
          animation: reducedMotion ? undefined : 'scanline-drift 0.5s steps(3) infinite',
        }}
      />
      {/* Film grain */}
      <div
        className="absolute inset-[-10%] mix-blend-overlay"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: '120px 120px',
          opacity: 0.05,
          animation: reducedMotion ? undefined : 'grain-shift 1.1s steps(4) infinite',
        }}
      />

      {/* Corner brackets */}
      {(['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-l border-b', 'right-3 bottom-3 border-r border-b'] as const).map(
        corner => (
          <span
            key={corner}
            className={`absolute size-7 border-white/20 md:size-9 ${corner}`}
          />
        ),
      )}

      {/* Top-center telemetry strip — only where there's comfortable horizontal room */}
      <div className="absolute inset-x-0 top-0 hidden justify-center pt-5 md:pt-7 2xl:flex">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 backdrop-blur-md">
          <span className="text-primary">◈</span>
          <span className="text-white/70">Star Map</span>
          <span className="text-white/15">{'// '}</span>
          <span ref={coordRef}>RA 000° · DEC +00°</span>
          <span className="text-white/15">{'// '}</span>
          <span className="tabular-nums text-white/70">
            {String(discovered).padStart(2, '0')}/{String(total).padStart(2, '0')} LOGGED
          </span>
        </div>
      </div>
    </div>
  );
}
