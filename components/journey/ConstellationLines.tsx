'use client';
import { Constellation } from '@/data/journey-data';

type Props = {
  constellation: Constellation;
  positions: Record<string, { x: number; y: number }>;
  active: boolean;
  completed: boolean;
  reducedMotion: boolean;
};

export default function ConstellationLines({
  constellation,
  positions,
  active,
  completed,
  reducedMotion,
}: Props) {
  const baseOpacity = completed ? 0.85 : active ? 0.55 : 0.16;
  const baseStroke = completed ? '#FBBF24' : '#5B8DEF';
  const flowing = !reducedMotion && active;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {constellation.edges.map(([from, to]) => {
        const a = positions[from];
        const b = positions[to];
        if (!a || !b) return null;

        return (
          <g key={`${from}-${to}`}>
            <line
              x1={a.x * 100}
              y1={a.y * 100}
              x2={b.x * 100}
              y2={b.y * 100}
              stroke={baseStroke}
              strokeWidth={completed ? 1 : 0.6}
              vectorEffect="non-scaling-stroke"
              opacity={baseOpacity}
              style={{ transition: 'opacity 0.5s ease' }}
            />
            {flowing && (
              <line
                x1={a.x * 100}
                y1={a.y * 100}
                x2={b.x * 100}
                y2={b.y * 100}
                stroke={completed ? '#FDE68A' : '#A9C6FF'}
                strokeWidth={0.3}
                strokeLinecap="round"
                strokeDasharray="0.3 9"
                style={{
                  animation: 'energy-flow 2s linear infinite',
                  filter: 'drop-shadow(0 0 1px currentColor)',
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
