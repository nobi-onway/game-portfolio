'use client';
import { Gamepad2, Github, Mail } from 'lucide-react';
import type { ComponentType } from 'react';
import { SOCIALS, type SocialKind } from '@/data/journey-data';

const ICONS: Record<SocialKind, ComponentType<{ className?: string }>> = {
  facebook: FacebookGlyph,
  email: Mail,
  github: Github,
  itch: Gamepad2,
};

/** lucide has no Facebook glyph — a tiny inline one keeps the set consistent. */
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.1H7.8V14h2.4v7h3.3z" />
    </svg>
  );
}

export default function SocialLinks({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'size-11' : 'size-8';
  const glyph = size === 'lg' ? 'size-5' : 'size-3.5';

  return (
    <div className="flex items-center gap-2">
      {SOCIALS.map(social => {
        const Icon = ICONS[social.kind];
        return (
          <a
            key={social.kind}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            title={social.label}
            className={`pointer-events-auto flex ${box} items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/55 backdrop-blur-md transition-colors hover:border-primary/50 hover:text-white`}
          >
            <Icon className={glyph} />
          </a>
        );
      })}
    </div>
  );
}
