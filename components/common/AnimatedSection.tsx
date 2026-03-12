'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationPreset = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn';

type AnimatedSectionProps = {
  children: ReactNode;
  preset?: AnimationPreset;
  delay?: number;
  duration?: number;
  className?: string;
  /** Stagger child elements. Combine with AnimatedItem inside. */
  stagger?: boolean;
};

const presets: Record<AnimationPreset, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/**
 * Wraps any section with a scroll-triggered entrance animation.
 * Use `preset` to select the animation style.
 * Use `stagger={true}` + wrap children in `<AnimatedItem />` for staggered lists.
 */
export function AnimatedSection({
  children,
  preset = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className,
  stagger = false,
}: AnimatedSectionProps) {
  const variants = stagger ? staggerContainer : presets[preset];

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={stagger ? undefined : { duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * An individual animated item, designed to be used as a stagger child inside
 * an <AnimatedSection stagger>. It inherits the staggered delay from the parent.
 */
export function AnimatedItem({
  children,
  className,
  preset = 'fadeUp',
}: {
  children: ReactNode;
  className?: string;
  preset?: AnimationPreset;
}) {
  return (
    <motion.div
      className={className}
      variants={presets[preset]}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
