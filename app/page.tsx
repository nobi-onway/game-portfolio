import Navigation from '@/components/action/Navigation';
import Banner from '@/components/common/Banner';
import ContactBanner from '@/components/common/ContactBanner';
import Footer from '@/components/common/Footer';
import GameCatalog from '@/components/game/GameCatalog';
import AboutMe from '@/components/profile/AboutMe';
// import AcademicPath from '@/components/profile/AcademicPath';
// import CareerPath from '@/components/profile/CareerPath';

export default function Home() {
  return (
    <div className="relative text-white">
      <Navigation />
      <Banner />
      <AboutMe />
      {/* <AcademicPath />
      <CareerPath /> */}
      <GameCatalog />
      <ContactBanner />
      <Footer />
    </div>
  );
}
