import Navigation from '@/components/action/Navigation';
import Banner from '@/components/common/Banner';
import GameCatalog from '@/components/game/GameCatalog';

export default function Home() {
  return (
    <div className="relative text-white">
      <Navigation />
      <Banner />
      <GameCatalog />
    </div>
  );
}
