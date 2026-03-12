'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Trophy, Layers } from 'lucide-react';
import { ProjectGameType } from '@/data/type-data';
import { PlatformToIcon } from '@/data/data';

type GameCardPropsType = ProjectGameType;

const PLATFORM_LABELS: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  window: 'Windows',
};

function GameCard(props: GameCardPropsType) {
  const { name, genres, images, platforms, role, achievements, deepInsights, brief, links } = props;

  return (
    <motion.article
      className="group relative flex flex-col h-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--accent)] cursor-pointer"
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(8,8,14,1) 100%)' }}
      whileHover={{ y: -6, borderColor: 'rgba(0,119,255,0.35)' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: '0 0 40px rgba(0,119,255,0.12) inset, 0 20px 60px rgba(0,0,0,0.6)' }}
      />

      {/* ── Image zone ── */}
      <div className="relative h-52 w-full overflow-hidden flex-shrink-0">
        {images && images[0] ? (
          <Image
            alt={name}
            fill
            src={images[0]}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-[var(--secondary)] flex items-center justify-center">
            <Layers size={32} className="text-[var(--text-muted)]" />
          </div>
        )}

        {/* Gradient scrim — always present, deepens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Achievement badge */}
        {achievements && achievements.length > 0 && (
          <motion.div
            className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--primary)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          >
            <Trophy size={10} />
            {achievements[0]}
          </motion.div>
        )}

        {/* Platform icons */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {platforms.map((platform, i) => (
            <div
              key={i}
              title={PLATFORM_LABELS[platform] ?? platform}
              className="relative size-5 opacity-70 hover:opacity-100 transition-opacity"
            >
              {PlatformToIcon[platform] && (
                <Image alt={platform} fill src={PlatformToIcon[platform]} />
              )}
            </div>
          ))}
        </div>

        {/* Slide-up brief — Nexon reveal layer */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-400 ease-out group-hover:translate-y-0">
          <div className="bg-gradient-to-t from-[#05050a] to-transparent pt-6 px-4 pb-3">
            <p className="text-xs text-white/80 italic leading-relaxed line-clamp-2">{brief}</p>
          </div>
        </div>
      </div>

      {/* ── Content zone ── */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-base text-white leading-tight">{name}</h4>
          {links?.store && (
            <a
              href={links.store}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              aria-label={`View ${name} on store`}
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Role + genres */}
        <p className="text-[10px] font-semibold font-mono uppercase tracking-widest text-[var(--primary)] opacity-80">
          {role ?? 'Developer'} &nbsp;·&nbsp; {genres.join(' / ')}
        </p>

        {/* Technical details */}
        {deepInsights && (
          <div className="mt-auto pt-3 border-t border-white/5 space-y-2">
            <p className="text-[11px] text-[var(--text-muted)] italic line-clamp-2 leading-relaxed">
              &ldquo;{deepInsights.solution}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5">
              {deepInsights.technicalDetails.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[var(--text-muted)] tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default GameCard;
