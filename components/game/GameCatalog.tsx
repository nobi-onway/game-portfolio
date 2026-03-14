'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECT_GAMES } from '@/data/data';
import FilterBar from '../common/FilterBar';
import GameCard from './GameCard';
import { ProjectGameType } from '@/data/type-data';

function AnimatedCard({ game, index }: { game: ProjectGameType; index: number }) {
  return (
    <motion.li
      key={game.slug}
      layout
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: -10 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <GameCard {...game} />
    </motion.li>
  );
}

function GameCatalog() {
  const [type, setType] = useState<'All' | '2D' | '3D'>('All');
  const [sortedGames, setSortedGames] = useState(PROJECT_GAMES);

  useEffect(() => {
    setSortedGames(
      PROJECT_GAMES.filter(game => game.type === type || type === 'All'),
    );
  }, [type]);

  return (
    <section
      id="games"
      className="mx-auto mt-20 flex flex-col px-4 lg:w-[1000px] lg:px-0"
    >
      {/* Section heading */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="section-label mb-3">Portfolio</h2>
          <h3 className="text-4xl md:text-5xl font-black">
            Featured <span className="text-gradient">Projects</span>
          </h3>
          <p className="text-[var(--text-muted)] mt-4 max-w-xl leading-relaxed">
            A collection of games ranging from rapid prototypes to high-polish live products. 
            <span className="text-white font-medium"> Hover over the cards </span> to explore the core mechanics of each project.
          </p>
        </div>
        
        <div className="flex items-baseline gap-2 pb-1">
          <span className="text-4xl font-black text-primary">{PROJECT_GAMES.length}</span>
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Selected Works</span>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar onSelectType={setType} selectedType={type} />

      {/* Game grid */}
      <motion.ul layout className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {sortedGames.map((game, index) => (
            <AnimatedCard key={game.slug} game={game} index={index} />
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* Empty state */}
      {sortedGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-[var(--text-muted)]"
        >
          No games found for this filter.
        </motion.div>
      )}
    </section>
  );
}

export default GameCatalog;
