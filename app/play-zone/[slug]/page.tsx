import GameView from '@/components/game/GameView';

export async function generateStaticParams() {
  const slugs = ['tiny-sword', 'rocket-escape'];

  return slugs.map(slug => ({
    slug,
  }));
}

async function PlayZone({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: 'landscape' | 'portrait' }>;
}) {
  const { slug } = await params;
  const { mode = 'landscape' } = await searchParams;

  return (
    <div className="flex h-dvh items-center justify-center">
      <GameView mode={mode} slug={slug} />
    </div>
  );
}

export default PlayZone;
