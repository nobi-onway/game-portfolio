'use client';
import { PROJECT_GAMES } from '@/data/data';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import GameInfo from '../game/GameInfo';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeOutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleGoToNextIndex = () => {
    setCurrentIndex(prev => (prev + 1) % PROJECT_GAMES.length);
  };

  const handleGoToBackIndex = () => {
    setCurrentIndex(prev => (prev - 1 + PROJECT_GAMES.length) % PROJECT_GAMES.length);
  };

  useEffect(() => {
    clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(handleGoToNextIndex, 6000);
    return () => clearTimeout(timeOutRef.current);
  }, [currentIndex]);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-background overflow-hidden border-b border-white/5">
      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-4 z-50 flex items-center">
        <motion.button
          onClick={handleGoToBackIndex}
          className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
      </div>
      <div className="absolute inset-y-0 right-4 z-50 flex items-center">
        <motion.button
          onClick={handleGoToNextIndex}
          className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div className="relative h-full w-full mx-auto">
        {PROJECT_GAMES.map((project, index) => (
          <GameInfo 
            key={project.slug} 
            {...project} 
            enabled={index === currentIndex} 
          />
        ))}

        {/* Cinematic Overlays (Nexon assets or equivalents) */}
        <div className="absolute top-0 right-0 h-full w-1/4 pointer-events-none z-10">
          <Image
            alt="shadow-right"
            fill
            src="https://web.nxfs.nexon.com/arena-home/assets/img/right.3d07e61b.png"
            className="object-cover opacity-60"
          />
        </div>
        <div className="absolute top-0 left-0 h-full w-1/4 pointer-events-none z-10">
          <Image
            alt="shadow-left"
            fill
            src="https://web.nxfs.nexon.com/arena-home/assets/img/left.6cf31a98.png"
            className="object-cover opacity-60"
          />
        </div>
        <div className="absolute bottom-0 h-40 w-full pointer-events-none z-10">
          <Image
            alt="shadow-bottom"
            fill
            src="https://web.nxfs.nexon.com/arena-home/assets/img/bottom_1920.e08eb6f5.png"
            className="object-cover opacity-80"
          />
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center gap-3 px-6 lg:px-12 lg:justify-start">
          {PROJECT_GAMES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="group relative h-1 lg:w-32 bg-white/10 overflow-hidden rounded-full flex-grow lg:flex-grow-0"
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? "100%" : 0 }}
                  transition={{ 
                    duration: isActive ? 6 : 0.3, 
                    ease: "linear" 
                  }}
                  className="absolute inset-y-0 left-0 bg-primary"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Banner;
