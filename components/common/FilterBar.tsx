'use client';
import { motion } from 'framer-motion';

const TYPES: { type: 'All' | '2D' | '3D'; label: string }[] = [
  { type: 'All', label: 'All' },
  { type: '2D',  label: '2D' },
  { type: '3D',  label: '3D' },
];

type FilterBarPropsType = {
  onSelectType: (type: 'All' | '2D' | '3D') => void;
  selectedType: 'All' | '2D' | '3D';
};

function FilterBar({ onSelectType, selectedType }: FilterBarPropsType) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
      {/* Left label */}
      <span className="text-xl font-bold text-white">
        All Games
        <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
          — filter by type
        </span>
      </span>

      {/* Pill tabs with shared sliding indicator */}
      <div
        className="relative flex items-center gap-1 rounded-full p-1"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
      >
        {TYPES.map(({ type, label }) => {
          const isSelected = selectedType === type;

          return (
            <button
              key={type}
              onClick={() => onSelectType(type)}
              className="relative z-10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full transition-colors duration-200"
              style={{ color: isSelected ? '#fff' : 'var(--text-muted)' }}
              aria-pressed={isSelected}
            >
              {/* Sliding background pill */}
              {isSelected && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--gradient-primary)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
