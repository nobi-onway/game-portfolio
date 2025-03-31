export async function generateStaticParams() {
  const slugs = ['tiny-sword', 'rocket-escape', 'flappy-bird', 'tanks'];

  return slugs.map(slug => ({
    slug,
  }));
}

async function GameDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <div>{slug}</div>
    </div>
  );
}

export default GameDetail;
