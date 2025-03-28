import Navigation from '@/components/action/Navigation';
import Banner from '@/components/common/Banner';
import ContactBanner from '@/components/common/ContactBanner';
import Footer from '@/components/common/Footer';
import GameCatalog from '@/components/game/GameCatalog';

export default function Home() {
  return (
    <div className="relative text-white">
      <Navigation />
      <Banner />
      <GameCatalog />
      <ContactBanner />
      <Footer />
    </div>
  );
}
