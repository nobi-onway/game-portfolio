'use client';
import Image from 'next/image';
import WindowsIcon from '@/public/images/windows.png';
import IconButton from '../common/IconButton';
import Button from '../common/Button';

function GameCard() {
  return (
    <section className="mb-1 flex w-full flex-col">
      <div className="group relative h-48 w-full overflow-hidden rounded-md">
        <Image
          alt="game-img"
          fill
          src="https://nxl.nxfs.nexon.com/media/10912/240821_msm_main_game_card_544x720.webp"
          className="object-cover"
        />
        <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-2 bg-[#292a2ee6] opacity-0 duration-300 ease-in-out group-hover:opacity-100">
          <Button
            onClick={() => alert('learn more game')}
            label="Learn More"
            type="outline"
          />
          <IconButton
            onClick={() => alert('open game on new tab')}
            icon="windows"
            label="Play on web"
          />
        </div>
      </div>

      <span className="mt-2 mb-1 text-[10px]">MapleStory M</span>
      <div className="w-full text-[10px] opacity-60">
        <div className="float-left">MMORPG</div>
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
