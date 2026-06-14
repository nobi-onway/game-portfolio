'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { CATEGORY_ACCENT, CATEGORY_LABEL, type StarNode } from '@/data/journey-data';

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
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const accent = node ? node.accent ?? CATEGORY_ACCENT[node.category] : '#ffffff';

  return (
    <AnimatePresence>
      {node && (
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
            className="glass-card relative w-full max-w-md overflow-hidden p-7 md:p-8"
            style={{ borderColor: `${accent}55` }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div
              className="pointer-events-none absolute -top-16 right-0 size-40 rounded-full blur-3xl"
              style={{ background: accent, opacity: 0.18 }}
            />

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 p-1.5 text-white/70 backdrop-blur-md transition-colors hover:text-white"
            >
              <X className="size-4" />
            </button>

            {node.image && (
              <div className="relative -mx-7 -mt-7 mb-6 h-44 overflow-hidden md:-mx-8 md:-mt-8 md:h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={node.image}
                  alt={node.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: `inset 0 -40px 60px -20px ${accent}55` }}
                />
              </div>
            )}

            <div className="relative">
              <div className="mb-4 flex items-center gap-2">
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

              <h3 className="text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                {node.title}
              </h3>
              {node.subtitle && (
                <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                  {node.subtitle}
                </p>
              )}

              <p className="mt-5 text-sm leading-relaxed text-white/70">{node.body}</p>

              {node.bullets && (
                <ul className="mt-5 space-y-2.5 border-t border-white/5 pt-5">
                  {node.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs text-white/70">
                      <span
                        className="mt-1.5 size-1.5 flex-shrink-0 rounded-full"
                        style={{ background: accent }}
                      />
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
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
                    >
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white/90">{item.value}</p>
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
                <p className="mt-6 border-t border-white/5 pt-4 text-[10px] font-medium uppercase tracking-wider text-white/25">
                  Scroll or ◀ ▶ to explore the next star
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
