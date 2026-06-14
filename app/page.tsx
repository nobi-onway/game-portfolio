import ConstellationSky from '@/components/journey/ConstellationSky';

export default function Home() {
  // The whole portfolio now lives inside the galaxy. The page is pinned to the
  // viewport (full vh + vw, no vertical scroll); the galaxy itself scrolls on
  // the X axis when its canvas is wider than the screen.
  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-white">
      <ConstellationSky />
    </main>
  );
}
