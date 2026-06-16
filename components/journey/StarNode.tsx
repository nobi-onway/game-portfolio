'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORY_ACCENT, type StarNode } from '@/data/journey-data';

const SIZES = {
  sun: { core: 18, halo: 70 },
  major: { core: 11, halo: 44 },
  minor: { core: 7, halo: 28 },
} as const;

type Props = {
  node: StarNode;
  discovered: boolean;
  /** Highlighted by mouse hover OR the keyboard cursor — drives the active visuals. */
  focused: boolean;
  dimmed: boolean;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export default function StarNodeView({
  node,
  discovered,
  focused,
  dimmed,
  reducedMotion,
  onHover,
  onSelect,
}: Props) {
  const accent = node.accent ?? CATEGORY_ACCENT[node.category];
  const size = SIZES[node.magnitude];
  const hollow = node.category === 'future' && !discovered;
  const twinkleDuration = 2.6 + (node.id.length % 4) * 0.55;

  // Dense clusters tag some stars as hover-only so their labels don't pile up.
  const labelOpacity = focused ? 1 : dimmed ? 0 : node.labelOnHover ? 0 : 0.55;
  const outerScale = dimmed ? 0.88 : focused ? 1.28 : 1;

  // Place the label radially (away from the cluster) so taglines fan out instead
  // of stacking. `x`/`y` keep the pill centred on its axis; focus adds a small nudge.
  const labelDir = node.labelDir ?? 'bottom';
  const labelPos = {
    bottom: { cls: 'left-1/2 top-full mt-1', x: '-50%', y: focused ? 3 : 0 },
    top: { cls: 'left-1/2 bottom-full mb-1', x: '-50%', y: focused ? -3 : 0 },
    left: { cls: 'right-full top-1/2 mr-1.5', x: focused ? -3 : 0, y: '-50%' },
    right: { cls: 'left-full top-1/2 ml-1.5', x: focused ? 3 : 0, y: '-50%' },
  }[labelDir];

  return (
    <button
      type="button"
      aria-label={`Explore ${node.label}`}
      onClick={() => onSelect(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%`, zIndex: focused ? 20 : 10 }}
    >
      <motion.span
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size.halo, height: size.halo }}
        animate={{ opacity: dimmed ? 0.3 : 1, scale: outerScale }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      >
        {/* Hover glow bloom */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent}66 0%, transparent 60%)` }}
          animate={{ opacity: focused ? 1 : 0, scale: focused ? 1.6 : 0.8 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Base halo */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}AA 0%, ${accent}33 42%, transparent 70%)`,
            opacity: discovered ? 1 : 0.6,
            animation: reducedMotion ? undefined : `star-twinkle ${twinkleDuration}s ease-in-out infinite`,
          }}
        />

        {/* Pulse ring for the unreached "future" star */}
        {hollow && !reducedMotion && (
          <motion.span
            className="pointer-events-none absolute rounded-full"
            style={{ width: size.core + 8, height: size.core + 8, border: `1.5px solid ${accent}` }}
            animate={{ scale: [1, 2.1], opacity: [0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        <AnimatePresence>
          {focused && (
            <>
              {/* Sonar ripple rings */}
              {!reducedMotion &&
                [0, 1].map(ring => (
                  <motion.span
                    key={`ripple-${ring}`}
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      width: size.core + 6,
                      height: size.core + 6,
                      border: `1.5px solid ${accent}`,
                    }}
                    initial={{ scale: 1, opacity: 0.55 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: ring * 0.7 }}
                  />
                ))}

              {/* Lens-flare glint (4-point sparkle) */}
              <motion.span
                key="glint"
                className="pointer-events-none absolute"
                style={{ width: size.halo * 0.7, height: size.halo * 0.7 }}
                initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: reducedMotion ? 0 : 90 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{
                  opacity: { duration: 0.3 },
                  scale: { type: 'spring', stiffness: 200, damping: 13 },
                  rotate: { duration: 9, repeat: Infinity, ease: 'linear' },
                }}
              >
                <span
                  className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
                  style={{ background: 'linear-gradient(90deg, transparent, #fff 50%, transparent)' }}
                />
                <span
                  className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
                  style={{ background: 'linear-gradient(180deg, transparent, #fff 50%, transparent)' }}
                />
              </motion.span>
            </>
          )}
        </AnimatePresence>

        {/* Core */}
        <motion.span
          className="relative rounded-full"
          style={{
            width: size.core,
            height: size.core,
            background: hollow ? 'transparent' : '#ffffff',
            border: hollow ? `1.5px solid ${accent}` : 'none',
          }}
          animate={{
            scale: focused ? 1.2 : 1,
            boxShadow: focused
              ? `0 0 ${size.core * 1.6}px ${accent}, 0 0 ${size.core * 3.4}px ${accent}`
              : `0 0 ${size.core}px ${accent}, 0 0 ${size.core * 2.2}px ${accent}77`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        />

        {/* Discovered marker ring */}
        {discovered && !hollow && (
          <span
            className="pointer-events-none absolute rounded-full"
            style={{ width: size.core + 10, height: size.core + 10, border: `1px solid ${accent}aa` }}
          />
        )}

        {/* Label — always-on for anchor stars, on hover for the rest. Placed
            radially (labelDir) so dense clusters keep their taglines apart. */}
        <motion.span
          className={`pointer-events-none absolute z-20 whitespace-nowrap rounded-full border bg-black/70 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md ${labelPos.cls}`}
          initial={false}
          animate={{
            opacity: labelOpacity,
            x: labelPos.x,
            y: labelPos.y,
            borderColor: focused ? `${accent}80` : 'rgba(255,255,255,0.1)',
          }}
          transition={{ duration: 0.2 }}
        >
          {node.label}
        </motion.span>
      </motion.span>
    </button>
  );
}
