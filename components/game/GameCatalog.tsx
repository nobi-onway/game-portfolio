import FilterBar from '../common/FilterBar';
import GameCard from './GameCard';

function GameCatalog() {
  return (
    <section className="m-auto mt-8 flex flex-col lg:w-[766px]">
      <FilterBar />

      <div className="grid grid-cols-5 gap-4">
        <GameCard />
      </div>
    </section>
  );
}

export default GameCatalog;
