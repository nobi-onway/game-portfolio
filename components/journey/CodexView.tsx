'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import {
  CATEGORY_ACCENT,
  CATEGORY_LABEL,
  CONSTELLATIONS,
  STAR_NODES,
  type StarNode,
} from '@/data/journey-data';

function StarCard({ node, discovered }: { node: StarNode; discovered: boolean }) {
  const accent = node.accent ?? CATEGORY_ACCENT[node.category];

  return (
    <div className="glow-card flex flex-col overflow-hidden p-6">
      {node.image && (
        <div className="relative -mx-6 -mt-6 mb-5 h-40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={node.image}
            alt={node.title}
            className="size-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: `inset 0 -30px 50px -20px ${accent}55` }}
          />
        </div>
      )}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
          <span
            className="text-[10px] font-black uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            {CATEGORY_LABEL[node.category]}
          </span>
        </div>
        {discovered && (
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-white/40">
            <Sparkles className="size-3" /> Explored
          </span>
        )}
      </div>

      <h4 className="text-lg font-black leading-tight text-white">{node.title}</h4>
      {node.subtitle && (
        <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
          {node.subtitle}
        </p>
      )}

      {node.role && (
        <div
          className="mt-3 flex items-center gap-2 rounded-md border-l-2 bg-white/[0.03] px-2.5 py-1.5"
          style={{ borderColor: accent }}
        >
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            Role
          </span>
          <span className="text-[11px] font-bold text-white/80">{node.role}</span>
        </div>
      )}

      <p className="mt-3 text-sm leading-relaxed text-white/65">{node.body}</p>

      {node.bullets && (
        <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
          {node.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs text-white/65">
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
        <div className="mt-4 flex flex-wrap gap-2">
          {node.meta.map(item => (
            <div
              key={item.label}
              className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                {item.label}:{' '}
              </span>
              <span className="text-xs font-bold text-white/80">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {node.links && node.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {node.links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-transform hover:scale-105 ${
                index === 0 ? 'text-black' : 'border border-white/15 bg-white/5 text-white/80'
              }`}
              style={index === 0 ? { background: accent } : undefined}
            >
              {link.label} <ExternalLink className="size-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CodexView({
  open,
  discovered,
  onClose,
}: {
  open: boolean;
  discovered: Set<string>;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex flex-col bg-[#050507]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Ambient glows */}
          <div
            className="radial-glow absolute left-[15%] top-0 h-72 w-72 opacity-[0.1]"
            style={{ background: 'var(--primary)' }}
          />
          <div
            className="radial-glow absolute bottom-0 right-[10%] h-72 w-72 opacity-[0.08]"
            style={{ background: '#5B21D4' }}
          />

          {/* Header (the persistent Galaxy/Read-all toggle lives top-right) */}
          <div className="sticky top-0 z-10 border-b border-white/10 bg-black/50 px-5 py-4 pr-32 backdrop-blur-xl md:px-8 md:pr-40">
            <span className="section-label">The Codex</span>
            <h3 className="text-xl font-black md:text-2xl">
              Every chapter, <span className="text-gradient">fully written</span>
            </h3>
          </div>

          {/* Body */}
          <div className="no-scrollbar relative flex-1 overflow-y-auto px-5 py-8 md:px-8">
            <div className="mx-auto max-w-5xl space-y-14">
              {CONSTELLATIONS.map((constellation, index) => {
                const members = STAR_NODES.filter(
                  node => node.constellationId === constellation.id,
                );
                const found = members.filter(node => discovered.has(node.id)).length;
                return (
                  <section key={constellation.id}>
                    <div className="mb-6 flex items-end gap-4">
                      <span className="text-4xl font-black leading-none text-white/10 md:text-5xl">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-lg font-black uppercase tracking-[0.2em] text-white md:text-xl">
                          {constellation.name}
                        </h4>
                        <p className="text-sm text-white/40">{constellation.tagline}</p>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/30">
                        {found}/{members.length}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {members.map(node => (
                        <StarCard
                          key={node.id}
                          node={node}
                          discovered={discovered.has(node.id)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
