import BootScreen from '@/components/journey/BootScreen';
import ConstellationSky from '@/components/journey/ConstellationSky';
import DesktopGate from '@/components/journey/DesktopGate';

export default function Home() {
  // The whole portfolio now lives inside the galaxy. The page is pinned to the
  // viewport (full vh + vw, no vertical scroll); the galaxy itself scrolls on
  // the X axis when its canvas is wider than the screen.
  //
  // The galaxy is desktop-first by design — below `lg`, DesktopGate covers the
  // screen and invites the visitor to open it on a PC instead of reflowing.
  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-white">
      <ConstellationSky />
      <BootScreen />
      <DesktopGate />
    </main>
  );
}
