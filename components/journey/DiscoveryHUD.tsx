'use client';
import { RotateCcw, Sparkles } from 'lucide-react';
import { CATEGORY_ACCENT, CATEGORY_LABEL, type StarCategory } from '@/data/journey-data';
import SocialLinks from './SocialLinks';

type Props = {
  discovered: number;
  total: number;
  onReset: () => void;
};

const LEGEND: StarCategory[] = ['origin', 'education', 'studio', 'project', 'future'];

export default function DiscoveryHUD({ discovered, total, onReset }: Props) {
  const percent = total === 0 ? 0 : Math.round((discovered / total) * 100);

  return (
    <>
      {/* Top-left — heading + progress (top-right is the view toggle) */}
      <div className="pointer-events-none absolute left-0 top-0 z-30 max-w-[70%] p-5 md:p-8">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-primary/60" />
          <span className="section-label">An interactive self-portrait</span>
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
          A journey told as a <span className="text-gradient">galaxy</span>
        </h2>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-white">{discovered}</span>
            <span className="text-white/40">/ {total}</span>
          </div>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom-center — gesture hints (desktop only) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 hidden justify-center md:flex">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/45 backdrop-blur-md">
          <span>
            <kbd className="text-white/70">◀ ▶</kbd> / scroll · explore
          </span>
          <span className="text-white/15">|</span>
          <span>
            <kbd className="text-white/70">Tab</kbd> · switch view
          </span>
          <span className="text-white/15">|</span>
          <span>
            <kbd className="text-white/70">Esc</kbd> · close
          </span>
        </div>
      </div>

      {/* Bottom bar — legend + reset */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 p-5 md:p-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {LEGEND.map(category => (
            <div key={category} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ background: CATEGORY_ACCENT[category], boxShadow: `0 0 6px ${CATEGORY_ACCENT[category]}` }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                {CATEGORY_LABEL[category]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <SocialLinks />
          {discovered > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}
