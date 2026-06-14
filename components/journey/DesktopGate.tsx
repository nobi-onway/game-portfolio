'use client';
import { MonitorUp } from 'lucide-react';
import { CV_HREF } from '@/data/journey-data';
import SocialLinks from './SocialLinks';

// The galaxy is a deliberately desktop-first experience (wide star-map canvas,
// hover/keyboard/scroll navigation). Below `lg` we don't try to reflow it —
// we show a styled "open on a PC" gate instead. Pure CSS visibility (lg:hidden)
// keeps it SSR-safe with no hydration flash.
export default function DesktopGate() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#04040a] px-7 text-center lg:hidden">
      {/* Ambient glows — keep the galaxy mood */}
      <div
        className="radial-glow absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 opacity-[0.14]"
        style={{ background: 'var(--primary)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

      <div className="relative flex flex-col items-center">
        <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary backdrop-blur-md">
          <MonitorUp className="size-8" />
        </span>

        <p className="section-label mt-6">An interactive self-portrait</p>
        <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight">
          Best experienced on a <span className="text-gradient">desktop</span>
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
          This portfolio is a wide, interactive star-map built for a bigger screen, a mouse and a
          keyboard. Please open it on a PC for the full journey.
        </p>

        <div className="mt-7 flex flex-col items-center gap-4">
          <SocialLinks size="lg" />
          <a
            href={CV_HREF}
            download
            className="rounded-full border border-primary/40 bg-primary/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-primary/25"
          >
            Download CV
          </a>
        </div>
      </div>
    </div>
  );
}
