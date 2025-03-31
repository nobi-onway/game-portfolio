import GameView from '@/components/game/GameView';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const slugs = ['tiny-sword', 'rocket-escape', 'flappy-bird', 'tanks'];

  return slugs.map(slug => ({
    slug,
  }));
}

async function PlayZone({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="flex h-dvh items-center justify-center">
      <Suspense>
        <GameView slug={slug} />
      </Suspense>
    </div>
  );
}

export default PlayZone;
