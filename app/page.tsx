import Navigation from '@/components/action/Navigation';
import Banner from '@/components/common/Banner';
import ContactBanner from '@/components/common/ContactBanner';
import Footer from '@/components/common/Footer';
import GameCatalog from '@/components/game/GameCatalog';
import AboutMe from '@/components/profile/AboutMe';
import CareerPath from '@/components/profile/CareerPath';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export default function Home() {
  return (
    <div className="relative overflow-x-hidden text-white bg-background">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="radial-glow pointer-events-none fixed top-[-200px] left-[-200px] w-[600px] h-[600px] opacity-[0.07]"
        style={{ background: 'var(--primary)' }}
      />
      <div
        aria-hidden="true"
        className="radial-glow pointer-events-none fixed bottom-[-100px] right-[-150px] w-[500px] h-[500px] opacity-[0.05]"
        style={{ background: '#5B21D4' }}
      />

      <Navigation />

      <Banner />

      <main className="space-y-4 md:space-y-8 pb-32">
        <AboutMe />
        <CareerPath />
        <GameCatalog />
      </main>

      <AnimatedSection preset="fadeIn">
        <ContactBanner />
      </AnimatedSection>

      <Footer />
    </div>
  );
}
