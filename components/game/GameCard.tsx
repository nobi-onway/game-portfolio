'use client';
import Image from 'next/image';
import WindowsIcon from '@/public/images/windows.png';
import IconButton from '../common/IconButton';
import Button from '../common/Button';
import { ProjectGameType } from '@/data/type-data';

type GameCardPropsType = {} & ProjectGameType;

function GameCard(props: GameCardPropsType) {
  const { slug, name, genres, images, mode } = props;

  return (
    <section className="mb-1 flex w-full flex-col">
      <div className="group relative h-48 w-full overflow-hidden rounded-md">
        <Image alt="game-img" fill src={images[0]} className="object-cover" />
        <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-2 bg-[#292a2ee6] opacity-0 duration-300 ease-in-out group-hover:opacity-100">
          <Button
            onClick={() => alert('learn more game')}
            label="Learn More"
            type="outline"
          />
          <IconButton
            onClick={() => window.open(`/play-zone/${slug}?mode=${mode}`)}
            icon="windows"
            label="Play on web"
          />
        </div>
      </div>

      <span className="mt-2 mb-1 text-[10px]">{name}</span>
      <div className="w-full text-[10px] opacity-60">
        <div className="float-left">{genres.join(', ')}</div>
        <div className="float-right">
          <div className="relative size-3">
            <Image alt="platform-icon" fill src={WindowsIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameCard;
