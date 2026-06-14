'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { STAR_NODES } from '@/data/journey-data';
import { usePrefersReducedMotion } from './motion-hooks';

const SESSION_KEY = 'nobi-galaxy-entered';

const BOOT_LOG = [
  'INITIALIZING STAR CHART',
  `MAPPING ${STAR_NODES.length} STELLAR OBJECTS`,
  'CALIBRATING NAVIGATION SYSTEM',
  'SYSTEM READY',
];

// The cinematic landing — a game-style "main menu" boot sequence that the
// visitor steps through before the galaxy is revealed. Shown once per tab
// session so a refresh drops straight back into the map.
export default function BootScreen() {
  const reducedMotion = usePrefersReducedMotion();
  // Start open so first-time visitors never glimpse the galaxy underneath; a
  // same-session refresh closes it immediately via the sessionStorage flag.
  const [open, setOpen] = useState(true);
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let skip = false;
    try {
      skip = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // ignore unavailable storage
    }
    if (skip) setOpen(false);
  }, []);

  // Reveal the boot log line-by-line, then arm the ENTER prompt.
  useEffect(() => {
    if (!open) return;
    if (reducedMotion) {
      setLines(BOOT_LOG.length);
      setReady(true);
      return;
    }
    setLines(0);
    setReady(false);
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setLines(count);
      if (count >= BOOT_LOG.length) {
        clearInterval(timer);
        setTimeout(() => setReady(true), 350);
      }
    }, 480);
    return () => clearInterval(timer);
  }, [open, reducedMotion]);

  const enter = useCallback(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore unavailable storage
    }
    setOpen(false);
  }, [ready]);

  // Enter / Space confirm once armed.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        enter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, enter]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] hidden flex-col items-center justify-center overflow-hidden bg-[#04040a] px-6 lg:flex"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Ambient glow + vignette */}
          <div
            className="radial-glow absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
            style={{ background: 'var(--primary)' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.7)_100%)]" />

          {/* Corner brackets — frame the boot screen like a console */}
          {(['left-6 top-6 border-l border-t', 'right-6 top-6 border-r border-t', 'left-6 bottom-6 border-l border-b', 'right-6 bottom-6 border-r border-b'] as const).map(
            corner => (
              <span
                key={corner}
                className={`pointer-events-none absolute size-10 border-primary/40 ${corner}`}
              />
            ),
          )}

          <motion.div
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label">Game Developer · Portfolio</p>
            <h1 className="mt-3 text-4xl font-black leading-none tracking-tight md:text-6xl">
              ĐOÀN GIA <span className="text-gradient">BẢO</span>
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              An interactive career galaxy
            </p>

            {/* Boot log */}
            <div className="mt-9 min-h-[6rem] w-72 space-y-1.5 text-left font-mono text-[11px] tracking-wider text-white/55">
              {BOOT_LOG.slice(0, lines).map(line => (
                <motion.div
                  key={line}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-primary">›</span>
                  <span>{line}</span>
                  <span className="ml-auto text-emerald-400/70">OK</span>
                </motion.div>
              ))}
            </div>

            {/* ENTER prompt — armed after the boot log completes */}
            <div className="mt-8 h-14">
              <AnimatePresence>
                {ready && (
                  <motion.button
                    type="button"
                    onClick={enter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex items-center gap-3 rounded-full border border-primary/40 bg-primary/15 px-7 py-3.5 font-mono text-sm font-black uppercase tracking-[0.25em] text-white backdrop-blur-md transition-colors hover:bg-primary/25"
                  >
                    <span
                      className="size-2 rounded-full bg-primary"
                      style={{
                        boxShadow: '0 0 10px var(--primary)',
                        animation: reducedMotion ? undefined : 'hud-blink 1.4s ease-in-out infinite',
                      }}
                    />
                    Enter Galaxy
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {ready && (
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
                Click or press Enter
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
