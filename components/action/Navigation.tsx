'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import IconButton from '../common/IconButton';
import { motion } from 'framer-motion';
import { Kanit } from 'next/font/google';

const TitleFont = Kanit({
  variable: '--font-title',
  subsets: ['latin'],
  weight: '500',
});

const NAV_LINKS = [
  { label: 'About Me', href: '#about-me' },
  { label: 'Career', href: '#career-path' },
  { label: 'Games', href: '#games' },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed z-[999] h-14 w-full min-w-96 px-6 text-white transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(5,5,7,0.8)] backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex h-full items-center justify-between max-w-[1200px] mx-auto">
        {/* Logo */}
        <Link
          className={`${TitleFont.className} text-xl tracking-wider uppercase relative group`}
          href="/"
        >
          <span className="text-white">Portfolio</span>
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
            >
              <Link
                className="relative px-3 py-1.5 text-xs uppercase tracking-widest text-white/50 transition-colors duration-300 hover:text-white group"
                href={link.href}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-4/5" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tech stack badges */}
        <div className="flex items-center gap-3">
          <IconButton icon="react" label="React" />
          <IconButton icon="unity" label="Unity" />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
