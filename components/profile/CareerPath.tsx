'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CAREER_PATH } from '@/data/data';
import { CareerMilestone } from '@/data/type-data';

// ─── Individual milestone card ─────────────────────────────────────────────

type CardProps = {
  milestone: CareerMilestone;
  index: number;
  isActive: boolean;
  onActivate: () => void;
};

function MilestoneCard({ milestone, index, isActive, onActivate }: CardProps) {
  const isLast = index === CAREER_PATH.length - 1;

  return (
    <motion.div
      className="relative flex-shrink-0 w-[320px] md:w-[380px] cursor-pointer select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      onClick={onActivate}
    >
      {/* Connector line (except last card) */}
      {!isLast && (
        <div className="absolute top-[38px] left-full w-6 z-0 flex items-center">
          <div className="h-[2px] w-full bg-gradient-to-r from-primary/30 to-transparent" />
          <div className="size-2 rounded-full border border-primary/30 bg-background flex-shrink-0 -ml-1" />
        </div>
      )}

      {/* Card */}
      <motion.div
        className="relative rounded-2xl border overflow-hidden transition-all duration-500 group"
        style={{
          background: isActive
            ? 'linear-gradient(165deg, rgba(0,119,255,0.12) 0%, rgba(10,10,18,0.95) 100%)'
            : 'linear-gradient(165deg, rgba(255,255,255,0.03) 0%, rgba(5,5,10,0.95) 100%)',
          borderColor: isActive ? 'rgba(0,119,255,0.4)' : 'rgba(255,255,255,0.05)',
          boxShadow: isActive
            ? '0 0 40px rgba(0,119,255,0.15), 0 20px 50px rgba(0,0,0,0.6)'
            : '0 10px 30px rgba(0,0,0,0.3)',
        }}
        whileHover={{ 
          y: -8, 
          borderColor: 'rgba(0,119,255,0.3)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,119,255,0.1)'
        }}
      >
        {/* Animated Top Light */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-10"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </AnimatePresence>

        {/* Content Side Padding */}
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
             {/* Year badge */}
             <div className="relative">
              <span className="font-mono text-[10px] font-black tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg uppercase">
                {milestone.year}
              </span>
              {isActive && (
                <div className="absolute -inset-1 bg-primary/20 blur-md rounded-lg animate-pulse" />
              )}
            </div>

            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`size-1 rounded-full ${isActive ? 'bg-primary' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <h4 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors">
              {milestone.company}
            </h4>
            <p className="text-xs font-bold text-primary/70 uppercase tracking-[0.15em]">
              {milestone.role}
            </p>
          </div>

          <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
            {milestone.description}
          </p>

          {/* Achievements - Always rendered but height-animated */}
          <motion.div
            initial={false}
            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="pt-5 border-t border-white/5 space-y-3">
              <h6 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Key Impacts</h6>
              <ul className="space-y-3">
                {milestone.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-3 text-xs text-white/70 items-start italic"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="size-1.5 rounded-full bg-primary mt-1 flex-shrink-0 animate-pulse" />
                    <span className="leading-relaxed">{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {!isActive && (
            <div className="pt-4 flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">
              <span>Explore Milestone</span>
              <div className="h-px flex-grow bg-white/5" />
              <span>→</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Career Path section ───────────────────────────────────────────────────

function CareerPath() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleActivate(index: number) {
    setActiveIndex(prev => (prev === index ? null : index));
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0 || e.shiftKey) return;

      const isAtStart = el.scrollLeft === 0 && e.deltaY < 0;
      const isAtEnd = Math.abs(el.scrollLeft + el.clientWidth - el.scrollWidth) < 5 && e.deltaY > 0;

      if (!isAtStart && !isAtEnd) {
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'auto'
        });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section id="career-path" className="relative py-32 bg-background">
      {/* Decorative Overlays */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Section heading */}
      <div className="mx-auto px-4 lg:max-w-[1100px] lg:px-0 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[1px] w-8 bg-primary/50" />
            <h2 className="section-label text-primary/80">Evolution</h2>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-black tracking-tight text-white">
                Development <br />
                <span className="text-gradient">Journey</span>
              </h3>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3 translate-y-[-8px]">
               <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">
                {/* Scroll hint */}
                <span className="hidden md:block">
                  Wheel Scroll to Navigate Timeline
                </span>
                <span className="md:hidden text-primary animate-pulse">
                  Swipe Horizontal
                </span>
              </p>
              <div className="h-[2px] w-24 bg-gradient-to-r from-primary to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar pb-20 snap-x snap-proximity scroll-smooth px-4 md:px-0"
        style={{
          paddingLeft: 'max(1rem, calc((100vw - 1100px) / 2))',
          paddingRight: 'max(1rem, calc((100vw - 1100px) / 2))',
          scrollPaddingLeft: 'max(1rem, calc((100vw - 1100px) / 2))',
        }}
      >
        {CAREER_PATH.map((milestone, index) => (
          <div
            key={index}
            className="snap-start"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <MilestoneCard
              milestone={milestone}
              index={index}
              isActive={activeIndex === index}
              onActivate={() => handleActivate(index)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CareerPath;
