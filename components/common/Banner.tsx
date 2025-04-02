'use client';
import { PROJECT_GAMES } from '@/data/data';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import GameInfo from '../game/GameInfo';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Banner() {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    undefined,
  );
  const timeOutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev !== undefined) return prev + 1;
        return prev;
      });
    }, 5000);
  }, [currentIndex]);

  return (
    <section className="relative flex h-[600px] pt-14 lg:h-[495px]">
      <button
        onClick={() =>
          setCurrentIndex(prev => {
            if (prev !== undefined) return prev - 1;
            return prev;
          })
        }
        className="absolute top-1/2 my-auto h-20 w-12 cursor-pointer border bg-[#151517] opacity-60 duration-500 hover:opacity-100"
      >
        <ChevronLeft className="m-auto" size={32} />
      </button>
      <button
        onClick={() =>
          setCurrentIndex(prev => {
            if (prev !== undefined) return prev + 1;
            return prev;
          })
        }
        className="absolute top-1/2 right-0 my-auto h-20 w-12 cursor-pointer border bg-[#151517] opacity-60 duration-500 hover:opacity-100"
      >
        <ChevronRight className="m-auto" size={32} />
      </button>
      <div className="relative mx-auto h-full w-full lg:w-[766px]">
        {PROJECT_GAMES.map((project, index) => {
          const enabled =
            currentIndex !== undefined &&
            index === Math.abs(currentIndex) % PROJECT_GAMES.length;

          return (
            <div key={index} data-display={enabled} className="group">
              <GameInfo {...project} />
            </div>
          );
        })}

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
        <div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-center gap-2">
          {PROJECT_GAMES.map((_, index) => {
            const enabled =
              currentIndex !== undefined &&
              index === Math.abs(currentIndex) % PROJECT_GAMES.length;

            return (
              <div
                data-enable={enabled}
                key={index}
                className="data-[enable=true]:bg-primary/20 group h-1 w-30 bg-white/20 duration-500 data-[enable=true]:h-2.5"
              >
                <div className="bg-primary h-0 w-0 transition-[width] duration-[5000ms] ease-linear group-data-[enable=true]:h-full group-data-[enable=true]:w-full"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Banner;
