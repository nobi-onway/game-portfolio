'use client';
import { ProjectGameType } from '@/data/type-data';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

function GameInfo(props: ProjectGameType & { enabled: boolean }) {
  const { images, name, brief, enabled } = props;

  return (
    <AnimatePresence>
      {enabled && (
        <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between">
          {/* Content side */}
          <motion.div 
            className="z-50 flex flex-col items-center lg:items-start justify-center gap-6 px-6 lg:pl-12 lg:w-1/2 text-center lg:text-left h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="space-y-2">
              <motion.span 
                className="section-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Featured Project
              </motion.span>
              <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-none">
                {name}
              </h2>
            </div>
            
            <p className="text-sm lg:text-base text-white/60 max-w-md leading-relaxed">
              {brief}
            </p>
            
            <motion.button 
              className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all hover:bg-primary hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LEARN MORE
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Image side */}
          <motion.div 
            className="relative w-full h-1/2 lg:h-full lg:w-full overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
             <Image 
                className="object-cover" 
                fill 
                alt={name} 
                src={images[1] || images[0]} 
                priority
              />
              {/* Overlay gradients for Nexon look */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/40 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent lg:hidden" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default GameInfo;
