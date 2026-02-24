'use client';


interface GameViewProps {
  slug: string;
}

export default function GameView({ slug }: GameViewProps) {
  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <p>Game: {slug}</p>
    </div>
  );
}
