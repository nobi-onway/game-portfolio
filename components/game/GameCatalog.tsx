import { PROJECT_GAMES } from '@/data/data';
import FilterBar from '../common/FilterBar';
import GameCard from './GameCard';

function GameCatalog() {
  return (
    <section id="games" className="m-auto mt-8 flex flex-col lg:w-[766px]">
      <FilterBar />

      <ul className="mt-4 grid grid-cols-5 gap-x-4 gap-y-8">
        {PROJECT_GAMES.map((game, index) => {
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
