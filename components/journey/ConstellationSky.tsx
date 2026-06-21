'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Download, Orbit } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CONSTELLATIONS, CV_HREF, SKY_HEIGHT_RATIO, SKY_WIDTH_REM, STAR_NODES } from '@/data/journey-data';
import CodexView from './CodexView';
import CosmicCanvas from './CosmicCanvas';
import SocialLinks from './SocialLinks';
import ConstellationLines from './ConstellationLines';
import DiscoveryHUD from './DiscoveryHUD';
import HudFrame from './HudFrame';
import JourneyOverview, { type Zone } from './JourneyOverview';
import { usePrefersReducedMotion } from './motion-hooks';
import ReticleCursor from './ReticleCursor';
import StarField from './StarField';
import StarModal from './StarModal';
import StarNodeView from './StarNode';

const STORAGE_KEY = 'nobi-galaxy-discovered';

export default function ConstellationSky() {
  const reducedMotion = usePrefersReducedMotion();

  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'galaxy' | 'codex'>('galaxy');
  const [toast, setToast] = useState<{ name: string; quote: string } | null>(null);
  const [finaleDismissed, setFinaleDismissed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(true);
  // Persists across effect re-runs so the wheel cooldown actually holds.
  const lastWheelRef = useRef(0);

  // ── Derived lookups ────────────────────────────────────────────────────────
  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    for (const node of STAR_NODES) map[node.id] = { x: node.x, y: node.y };
    return map;
  }, []);

  const members = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const constellation of CONSTELLATIONS) {
      map[constellation.id] = STAR_NODES.filter(
        node => node.constellationId === constellation.id,
      ).map(node => node.id);
    }
    return map;
  }, []);

  // ── Persistence ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDiscovered(new Set(JSON.parse(raw) as string[]));
    } catch {
      // ignore unavailable / malformed storage
    }
  }, []);

  // ── State derived from data ────────────────────────────────────────────────
  // The highlighted star = whatever the mouse is over, else the keyboard cursor.
  const highlightId = hoveredId ?? focusedId;
  const highlightNode = STAR_NODES.find(node => node.id === highlightId) ?? null;
  const activeNode = STAR_NODES.find(node => node.id === activeId) ?? null;
  const activeConstellationId = highlightNode?.constellationId ?? null;

  const completedIds = useMemo(() => {
    return new Set(
      CONSTELLATIONS.filter(
        constellation =>
          members[constellation.id].length > 0 &&
          members[constellation.id].every(id => discovered.has(id)),
      ).map(constellation => constellation.id),
    );
  }, [discovered, members]);

  const allExplored = discovered.size === STAR_NODES.length;

  const zones = useMemo<Zone[]>(() => {
    return CONSTELLATIONS.map((constellation, index) => {
      const ids = members[constellation.id];
      const points = ids.map(id => positions[id]);
      const cx = points.reduce((sum, point) => sum + point.x, 0) / points.length;
      const cy = points.reduce((sum, point) => sum + point.y, 0) / points.length;
      const spread = Math.max(
        0.06,
        ...points.map(point => Math.hypot(point.x - cx, point.y - cy)),
      );
      const category =
        STAR_NODES.find(node => node.id === ids[0])?.category ?? 'origin';
      return {
        id: constellation.id,
        name: constellation.name,
        tagline: constellation.tagline,
        order: index + 1,
        category,
        cx,
        cy,
        radius: spread + 0.07,
        total: ids.length,
        found: ids.filter(id => discovered.has(id)).length,
        active: activeConstellationId === constellation.id,
        completed: completedIds.has(constellation.id),
      };
    });
  }, [members, positions, discovered, activeConstellationId, completedIds]);

  // Follow the focused star — when the keyboard/wheel cursor moves to a star
  // (incl. carouseling through the modal, which also sets focus), pan the wide
  // sky so that star is centred. Hover is deliberately excluded so the mouse
  // never yanks the canvas around.
  useEffect(() => {
    if (!focusedId) return;
    const container = scrollRef.current;
    const node = STAR_NODES.find(item => item.id === focusedId);
    if (!container || !node) return;
    const target = node.x * container.scrollWidth - container.clientWidth / 2;
    container.scrollTo({
      left: Math.max(0, target),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [focusedId, reducedMotion]);

  const showIntro = discovered.size === 0;
  // Galaxy is in "immersive" mode (reticle cursor on, native cursor hidden)
  // whenever the map is front-and-centre — i.e. no modal and not in the codex.
  const immersiveCursor = view === 'galaxy' && activeId === null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (id: string) => {
      setActiveId(id);
      if (discovered.has(id)) return;

      const next = new Set(discovered);
      next.add(id);
      setDiscovered(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore unavailable storage
      }

      const node = STAR_NODES.find(item => item.id === id);
      const constellation = CONSTELLATIONS.find(item => item.id === node?.constellationId);
      if (
        constellation?.hiddenQuote &&
        members[constellation.id].every(memberId => next.has(memberId))
      ) {
        setToast({ name: constellation.name, quote: constellation.hiddenQuote });
      }
    },
    [discovered, members],
  );

  const handleReset = useCallback(() => {
    setDiscovered(new Set());
    setFinaleDismissed(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore unavailable storage
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleView = useCallback(() => {
    setView(current => (current === 'galaxy' ? 'codex' : 'galaxy'));
  }, []);

  // Move the keyboard cursor — only highlights a star (like hover), no modal.
  const moveFocus = useCallback((direction: 1 | -1) => {
    setFocusedId(current => {
      const currentIndex = STAR_NODES.findIndex(node => node.id === current);
      const base = currentIndex === -1 ? (direction === 1 ? -1 : 0) : currentIndex;
      const nextIndex = (base + direction + STAR_NODES.length) % STAR_NODES.length;
      return STAR_NODES[nextIndex].id;
    });
  }, []);

  // Carousel between stars while a modal is open (opens the next one).
  const stepModal = useCallback(
    (direction: 1 | -1) => {
      const currentNode = STAR_NODES.find(node => node.id === activeId);
      if (!currentNode) return;
      const siblings = STAR_NODES.filter(
        node => node.constellationId === currentNode.constellationId,
      );
      const currentIndex = siblings.findIndex(node => node.id === activeId);
      const base = currentIndex === -1 ? (direction === 1 ? -1 : 0) : currentIndex;
      const nextIndex = (base + direction + siblings.length) % siblings.length;
      handleSelect(siblings[nextIndex].id);
      setFocusedId(siblings[nextIndex].id);
    },
    [activeId, handleSelect],
  );

  // ── Gesture system ─────────────────────────────────────────────────────────
  // Track whether the galaxy is the dominant view so global keys/wheel only
  // act while the user is actually looking at it.
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.intersectionRatio > 0.4;
      },
      { threshold: [0, 0.4, 1] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Depth parallax — the deep background drifts opposite the cursor. Written
  // straight to the DOM (no re-render) and skipped for reduced-motion / touch.
  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const node = parallaxRef.current;
    if (!node) return;
    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        node.style.transform = `translate3d(${-x * 18}px, ${-y * 18}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const total = STAR_NODES.length;
    const WHEEL_COOLDOWN = 500; // ms between star steps — keeps touchpads from racing

    const onKey = (event: KeyboardEvent) => {
      if (!inViewRef.current) return;

      // Tab — switch between Galaxy and Codex
      if (event.key === 'Tab') {
        const target = event.target as HTMLElement | null;
        const interactive = target?.closest('a, button, input, textarea, select');
        // In Codex keep native tabbing for links; only hijack from "empty" focus.
        if (view === 'galaxy' || !interactive) {
          event.preventDefault();
          toggleView();
        }
        return;
      }

      if (view !== 'galaxy') return;

      // Modal open → arrows flip between cards.
      if (activeId !== null) {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          stepModal(1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          stepModal(-1);
        }
        return;
      }

      // Browsing the map → arrows only move the highlight; Enter opens it.
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveFocus(-1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        if (focusedId) {
          event.preventDefault();
          handleSelect(focusedId);
        }
      } else if (event.key === 'Escape') {
        setFocusedId(null);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!inViewRef.current || view !== 'galaxy') return;

      // Modal open → StarModal handles its own wheel, don't double-fire.
      if (activeId !== null) return;

      const now = Date.now();
      const direction = event.deltaY > 0 ? 1 : -1;

      // Normal mode → the first scroll enters hover mode on the first/last star.
      if (focusedId === null) {
        event.preventDefault();
        if (now - lastWheelRef.current < WHEEL_COOLDOWN) return;
        lastWheelRef.current = now;
        setFocusedId(direction === 1 ? STAR_NODES[0].id : STAR_NODES[total - 1].id);
        return;
      }

      const currentIndex = STAR_NODES.findIndex(node => node.id === focusedId);
      const nextIndex = currentIndex + direction;
      // Past either end → stop here (no more stars to move to).
      if (nextIndex < 0 || nextIndex >= total) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      if (now - lastWheelRef.current < WHEEL_COOLDOWN) return;
      lastWheelRef.current = now;
      setFocusedId(STAR_NODES[nextIndex].id);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
    };
  }, [view, activeId, focusedId, moveFocus, stepModal, handleSelect, toggleView]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="galaxy"
      aria-label="Interactive career galaxy"
      className="relative h-full w-full overflow-hidden bg-[#04040a]"
      style={{ cursor: immersiveCursor ? 'none' : 'auto' }}
    >
      {/* ── Scrollable canvas ──────────────────────────────────────────────
          Locked vertically; scrolls on X. The sky is intentionally wider than
          the screen (SKY_WIDTH_REM) so each constellation gets its own band with
          fixed spacing — see applyConstellationLayout in journey-data. */}
      <div
        ref={scrollRef}
        className="no-scrollbar absolute inset-0 overflow-x-auto overflow-y-hidden"
      >
        <div className="relative h-full" style={{ width: `max(100%, ${SKY_WIDTH_REM}rem)` }}>
          {/* Deep background — nebula glows + star field, drifts with parallax */}
          <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
            {/* Nebula glows */}
            <div
              className="radial-glow absolute left-[10%] top-[20%] h-[420px] w-[420px] opacity-[0.12]"
              style={{ background: 'var(--primary)' }}
            />
            <div
              className="radial-glow absolute bottom-[10%] right-[12%] h-[380px] w-[380px] opacity-[0.1]"
              style={{ background: '#5B21D4' }}
            />

            {/* Background star layer (stable) */}
            <div className="absolute inset-0">
              <StarField reducedMotion={reducedMotion} />
            </div>
          </div>

          {/* Constellation layer — aspect-locked & vertically centred.
              Stars/lines position with `left:x%` (of the wide canvas) but
              `top:y%`, so the shape inherits whatever pixel aspect the box has.
              The height is pinned to the canvas WIDTH × SKY_HEIGHT_RATIO so the
              box keeps a fixed aspect on every screen — never the viewport's —
              which is what the Arsenal pre-squeeze in journey-data assumes.
              We deliberately do NOT cap it to the viewport height: a viewport
              shorter than the ideal box would otherwise squash the ratio and
              distort the logo. The stars live in the middle band, so the box is
              vertically centred and any thin top/bottom overflow is clipped by
              the section without touching them. */}
          <div
            className="absolute inset-x-0 top-1/2"
            style={{
              height: `calc(max(100vw, ${SKY_WIDTH_REM}rem) * ${SKY_HEIGHT_RATIO})`,
              // Centre on the occupied star band (≈0.43 of the box, not 0.5) so the
              // top (Arsenal) and bottom (Horizon) stars share the vertical margin.
              transform: 'translateY(-43%)',
            }}
          >
            {/* Overview: auras, journey spine & chapter watermarks (behind the stars) */}
            <JourneyOverview zones={zones} reducedMotion={reducedMotion} />

            {CONSTELLATIONS.map(constellation => (
              <ConstellationLines
                key={constellation.id}
                constellation={constellation}
                positions={positions}
                active={activeConstellationId === constellation.id}
                completed={completedIds.has(constellation.id)}
                reducedMotion={reducedMotion}
              />
            ))}

            {STAR_NODES.map(node => (
              <StarNodeView
                key={node.id}
                node={node}
                discovered={discovered.has(node.id)}
                focused={highlightId === node.id}
                dimmed={
                  highlightId !== null &&
                  highlightNode?.constellationId !== node.constellationId
                }
                reducedMotion={reducedMotion}
                onHover={setHoveredId}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive FX layer — click detonations + sparse falling meteors.
          Sits above the vignette, below the HUD. pointer-events-none, so it
          reads clicks off the window and never steals them from the stars. */}
      <CosmicCanvas reducedMotion={reducedMotion} active={immersiveCursor} />

      {/* Vignette — pinned to the viewport, above the scrolling canvas */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />

      {/* Diegetic mission-console frame (brackets, scanlines, grain, telemetry) */}
      <HudFrame
        discovered={discovered.size}
        total={STAR_NODES.length}
        reducedMotion={reducedMotion}
      />

      {/* Persistent top-right controls — view toggle + CV, same spot in both views */}
      <div className="absolute right-5 top-5 z-[45] flex items-center gap-2.5 md:right-8 md:top-8">
        <button
          type="button"
          onClick={toggleView}
          className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-primary/20"
        >
          {view === 'galaxy' ? (
            <>
              <BookOpen className="size-4" /> Read all
            </>
          ) : (
            <>
              <Orbit className="size-4" /> Galaxy
            </>
          )}
        </button>
        <a
          href={CV_HREF}
          download
          className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-primary/25"
        >
          <Download className="size-4" /> Download CV
        </a>
      </div>

      {/* First-load framing — fades out once exploration begins */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[14%] z-30 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-base">
              Every star is a chapter of my story.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
              <motion.span
                animate={reducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Tap a star · or ◀ ▶ then Enter
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DiscoveryHUD
        discovered={discovered.size}
        total={STAR_NODES.length}
        onReset={handleReset}
      />

      {/* Constellation-completed toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-24 z-40 flex justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="glass-card max-w-sm border-amber-300/30 px-6 py-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300/80">
                {toast.name} · Completed
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-white/80">{toast.quote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finale */}
      <AnimatePresence>
        {allExplored && !finaleDismissed && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {!reducedMotion && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 w-1/2"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(0,119,255,0.25), rgba(91,33,212,0.25), transparent)',
                    animation: 'aurora-sweep 4s ease-in-out infinite',
                  }}
                />
              </div>
            )}
            <motion.div
              className="glass-card relative max-w-md p-8 text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <p className="section-label">Galaxy Complete</p>
              <h3 className="mt-3 text-3xl font-black">
                Let&apos;s build the <span className="text-gradient">next big thing</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Thanks for wandering through my journey. I&apos;m open to collaborations, game
                development internships, and full-time opportunities.
              </p>
              <div className="mt-6 flex justify-center">
                <SocialLinks size="lg" />
              </div>
              <button
                type="button"
                onClick={() => setFinaleDismissed(true)}
                className="mt-6 rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/60 transition-colors hover:text-white"
              >
                Keep exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CodexView
        open={view === 'codex'}
        discovered={discovered}
        onClose={() => setView('galaxy')}
      />
      <StarModal
        node={activeNode}
        onClose={() => setActiveId(null)}
        onPrev={() => stepModal(-1)}
        onNext={() => stepModal(1)}
      />

      {/* Custom targeting reticle — replaces the cursor while exploring */}
      <ReticleCursor
        active={hoveredId !== null}
        visible={immersiveCursor}
        reducedMotion={reducedMotion}
      />
    </section>
  );
}
