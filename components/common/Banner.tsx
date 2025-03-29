'use client';
import { PROJECT_GAMES } from '@/data/data';
import Image from 'next/image';
import Button from './Button';
// import { useRouter } from 'next/navigation';

function Banner() {
  const { images, name, brief } = PROJECT_GAMES[0];
  // const { images, name, brief, slug } = PROJECT_GAMES[0];

  // const { push } = useRouter();

  return (
    <section className="flex h-[600px] pt-14 lg:h-[495px]">
      <div className="relative mx-auto h-full w-full lg:w-[766px]">
        <div className="absolute right-0 aspect-[4/3] h-full snap-center overflow-hidden">
          <Image
            className="object-cover"
            fill
            alt="banner-img"
            src={images[1]}
          />
        </div>
        <div className="absolute left-0 z-50 flex h-full w-60 flex-col justify-center gap-4">
          <span className="text-6xl">{name}</span>
          <span className="text-xs opacity-60">{brief}</span>
          <div>
            <Button
              label="Learn More"
              type="outline"
              onClick={() => alert('coming soon...')}
              // onClick={() => push(`/details/${slug}`)}
            />
          </div>
        </div>
        <div className="absolute top-0 -right-0.5 h-full w-60">
          <Image
            alt="shadow-right"
            fill
            src="https://web.nxfs.nexon.com/arena-home/assets/img/right.3d07e61b.png"
          />
        </div>
        <div className="absolute top-0 left-0 h-full w-96">
          <Image
            alt="shadow-left"
            fill
            src="https://web.nxfs.nexon.com/arena-home/assets/img/left.6cf31a98.png"
          />
        </div>
        <div className="absolute bottom-0 h-20 w-full">
          <Image
            alt="shadow-bottom"
            fill
            src="https://web.nxfs.nexon.com/arena-home/assets/img/bottom_1920.e08eb6f5.png"
          />
        </div>
      </div>
    </section>
  );
}

export default Banner;
