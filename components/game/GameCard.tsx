'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Trophy, Layers, MousePointer2 } from 'lucide-react';
import { ProjectGameType } from '@/data/type-data';
import { PlatformToIcon } from '@/data/data';
import dynamic from 'next/dynamic';

// Dynamic imports for mechanics to keep bundle size small
const PvPArcherMechanic = dynamic(() => import('@/components/mechanics/PvPArcherMechanic'), { ssr: false });
const TileTripleMatch = dynamic(() => import('@/components/mechanics/TileTripleMatch'), { ssr: false });
const KnightsVsOrcsMechanic = dynamic(() => import('@/components/mechanics/KnightsVsOrcsMechanic'), { ssr: false });
const ZombieShooterMechanic = dynamic(() => import('@/components/mechanics/ZombieShooterMechanic'), { ssr: false });

const MECHANIC_COMPONENTS: Record<string, React.ComponentType> = {
  'thetan-immortal': PvPArcherMechanic,
  'tile-travel': TileTripleMatch,
  'knights-vs-orcs': KnightsVsOrcsMechanic,
  'fpt-zombie-shooting': ZombieShooterMechanic,
};

type GameCardPropsType = ProjectGameType;

const PLATFORM_LABELS: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  window: 'Windows',
};

function GameCard(props: GameCardPropsType) {
  const { name, genres, images, platforms, role, achievements, deepInsights, brief, links, slug } = props;
  const Mechanic = MECHANIC_COMPONENTS[slug];

  return (
    <motion.article
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 bg-[#0A0A12] cursor-pointer"
      whileHover="hovered"
      initial="initial"
      variants={{
        initial: { y: 0 },
        hovered: { y: -8, borderColor: 'rgba(0,119,255,0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }
      }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* ── Image zone ── */}
      <div className="relative h-60 w-full overflow-hidden flex-shrink-0">
        {images && images[0] ? (
          <Image
            alt={name}
            fill
            src={images[0]}
            className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:blur-[1px] opacity-80 group-hover:opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <Layers size={32} className="text-white/20" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-transparent to-transparent opacity-80" />
        
        {/* Mechanic Attachment - Revealed on Hover */}
        {Mechanic && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <motion.div
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 20 },
                hovered: { opacity: 1, scale: 1, y: 0 }
              }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
            >
              <div className="relative group/mechanic">
                <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover/mechanic:opacity-100 transition-opacity" />
                <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                  <Mechanic />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Core Mechanic</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Achievement badge */}
        {achievements && achievements.length > 0 && (
          <motion.div
            className="absolute top-4 left-4 flex items-center gap-2 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,119,255,0.4)] z-30"
          >
            < Trophy size={10} />
            {achievements[0]}
          </motion.div>
        )}

        {/* Platform icons */}
        <div className="absolute top-4 right-4 flex gap-2 z-30">
          {platforms.map((platform, i) => (
            <div
              key={i}
              title={PLATFORM_LABELS[platform] ?? platform}
              className="relative size-5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            >
              {PlatformToIcon[platform] && (
                <Image alt={platform} fill src={PlatformToIcon[platform]} />
              )}
            </div>
          ))}
        </div>

        {/* Hint to hover */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:opacity-0 transition-opacity duration-300">
          <MousePointer2 size={10} className="animate-bounce" />
          <span>Interactive Mechanics</span>
        </div>
      </div>

      {/* ── Content zone ── */}
      <div className="p-6 flex flex-col flex-grow gap-4 bg-gradient-to-b from-transparent to-black/20">
        <div>
          <div className="flex items-start justify-between gap-4 mb-1">
            <h4 className="font-bold text-xl text-white tracking-tight group-hover:text-primary transition-colors">{name}</h4>
            {links?.store && (
              <a
                href={links.store}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-primary/50 transition-all"
                aria-label={`View ${name} on store`}
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <p className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-primary/80">
            {role ?? 'Developer'} &nbsp;·&nbsp; {genres.join(' / ')}
          </p>
        </div>

        <p className="text-sm text-white/60 leading-relaxed line-clamp-2 italic">
          &ldquo;{brief}&rdquo;
        </p>

        {/* Technical details */}
        {deepInsights && (
          <div className="mt-auto pt-5 border-t border-white/5 space-y-3">
            <div className="flex flex-wrap gap-2">
              {deepInsights.technicalDetails.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="text-[9px] font-bold bg-white/5 border border-white/5 px-2.5 py-1 rounded-md text-white/40 tracking-wider hover:border-primary/20 hover:text-white/60 transition-colors"
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
