'use client';
import { PROJECT_GAMES } from '@/data/data';
import FilterBar from '../common/FilterBar';
import GameCard from './GameCard';
import { useEffect, useState } from 'react';

function GameCatalog() {
  const [sortedGames, setSortedGames] = useState(PROJECT_GAMES);
  const [type, setType] = useState<'All' | '2D' | '3D'>('All');

  useEffect(() => {
    const newSortedGames = [...PROJECT_GAMES].filter(
      game => game.type === type || type === 'All',
    );

    setSortedGames(newSortedGames);
  }, [type]);

  function handleOnSelectType(type: 'All' | '2D' | '3D') {
    setType(type);
  }

  return (
    <section id="games" className="m-auto mt-8 flex flex-col lg:w-[766px]">
      <FilterBar onSelectType={handleOnSelectType} selectedType={type} />

      <ul className="mt-4 grid grid-cols-5 gap-x-4 gap-y-8">
        {sortedGames.map((game, index) => {
          return (
            <li key={index}>
              <GameCard {...game} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default GameCatalog;
