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
      className="relative flex-shrink-0 w-[300px] md:w-[340px] cursor-pointer select-none"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onActivate}
    >
      {/* Connector line (except last card) */}
      {!isLast && (
        <div className="absolute top-[28px] left-full w-8 z-0 flex items-center">
          <div className="h-px w-full bg-gradient-to-r from-[var(--border)] to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)] flex-shrink-0" />
        </div>
      )}

      {/* Card */}
      <motion.div
        className="relative rounded-xl border overflow-hidden transition-colors duration-300"
        style={{
          background: isActive
            ? 'linear-gradient(160deg, rgba(0,119,255,0.08) 0%, rgba(15,15,22,0.9) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(10,10,18,0.9) 100%)',
          borderColor: isActive ? 'rgba(0,119,255,0.4)' : 'var(--border)',
          boxShadow: isActive
            ? '0 0 30px rgba(0,119,255,0.15), 0 8px 32px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        whileHover={{ y: -5, boxShadow: '0 0 30px rgba(0,119,255,0.15), 0 16px 40px rgba(0,0,0,0.5)' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ originX: 0, background: 'var(--gradient-primary)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Header — always visible */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Year badge */}
            <div className="relative">
              <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/25 px-2.5 py-1 rounded-full">
                {milestone.year}
              </span>
              {/* Pulse ring on active */}
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-[var(--primary)]"
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Expand indicator for mobile */}
            <motion.div
              className="md:hidden text-[var(--text-muted)] text-xs"
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▾
            </motion.div>
          </div>

          <h4 className="text-base font-bold text-white leading-tight mb-0.5">
            {milestone.company}
          </h4>
          <p className="text-xs text-[var(--primary)] font-medium tracking-wide uppercase opacity-80">
            {milestone.role}
          </p>
        </div>

        {/* Description — always visible */}
        <div className="px-5 pb-3">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
            {milestone.description}
          </p>
        </div>

        {/* Achievements — hover reveal on desktop, accordion on mobile */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="achievements"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <ul className="px-5 pb-5 pt-1 border-t border-white/5 space-y-2 mt-1">
                {milestone.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-2.5 text-xs text-white/75 items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                  >
                    <span className="text-[var(--primary)] mt-0.5 flex-shrink-0">▹</span>
                    <span>{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop hover prompt — only when not active */}
        {!isActive && (
          <div className="hidden md:flex px-5 pb-4 items-center gap-1.5 text-[10px] text-[var(--text-muted)]/60">
            <span>Hover to expand</span>
            <span>→</span>
          </div>
        )}
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

  // Desktop: activate on mouse enter, deactivate on leave
  function handleMouseEnter(index: number) {
    setActiveIndex(index);
  }

  function handleMouseLeave() {
    setActiveIndex(null);
  }

  // ─── Smooth Horizontal Scroll Logic ─────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      
      // If we're scrolling horizontally with the shift key, let the browser handle it
      if (e.shiftKey) return;

      // Translate vertical scroll to horizontal scroll
      // Only prevent default if we're actually scrolling horizontally within the container
      const isAtStart = el.scrollLeft === 0 && e.deltaY < 0;
      const isAtEnd = 
        Math.abs(el.scrollLeft + el.clientWidth - el.scrollWidth) < 2 && 
        e.deltaY > 0;

      if (!isAtStart && !isAtEnd) {
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2,
          behavior: 'smooth'
        });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section id="career-path" className="py-20 overflow-hidden">
      {/* Section heading */}
      <div className="mx-auto px-4 lg:max-w-[1000px] lg:px-0 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-label mb-4">Journey</h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h3 className="text-4xl font-bold">
              Development{' '}
              <span className="text-gradient">Journey</span>
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              {/* Scroll hint on desktop */}
              <span className="hidden md:block">
                ← Use mouse wheel to explore · Hover to reveal details
              </span>
              <span className="md:hidden">Swipe to explore · Tap to reveal</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-12 snap-x snap-proximity scroll-smooth"
        style={{
          paddingLeft: 'max(1rem, calc((100vw - 1000px) / 2))',
          paddingRight: 'max(1rem, calc((100vw - 1000px) / 2))',
          scrollPaddingLeft: 'max(1rem, calc((100vw - 1000px) / 2))',
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {CAREER_PATH.map((milestone, index) => (
          <div
            key={index}
            className="snap-start"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
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

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-2">
        {CAREER_PATH.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleActivate(index)}
            className="h-1.5 rounded-full transition-all duration-300"
            animate={{
              width: activeIndex === index ? 24 : 6,
              backgroundColor:
                activeIndex === index ? 'var(--primary)' : 'var(--border)',
            }}
            aria-label={`Go to ${CAREER_PATH[index].company}`}
          />
        ))}
      </div>
    </section>
  );
}

export default CareerPath;
