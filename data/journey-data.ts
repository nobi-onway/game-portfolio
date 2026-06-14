// ─────────────────────────────────────────────────────────────────────────────
// The Constellation — data for the interactive "galaxy" section.
// Each StarNode is one abstracted fact from the portfolio (mirrors the facts in
// CAREER_PATH / PROJECT_GAMES / AboutMe). Positions are normalised 0..1 of the
// sky so the layout scales with the viewport.
// ─────────────────────────────────────────────────────────────────────────────

export type StarCategory = 'origin' | 'education' | 'studio' | 'project' | 'future';
export type StarMagnitude = 'sun' | 'major' | 'minor';

export interface StarNode {
  id: string;
  label: string; // short name shown on hover
  category: StarCategory;
  constellationId: string;
  x: number; // 0..1
  y: number; // 0..1
  magnitude: StarMagnitude;
  accent?: string; // overrides the category colour
  image?: string; // hero shot shown in the detail modal / codex card
  title: string;
  subtitle?: string;
  body: string;
  bullets?: string[];
  meta?: { label: string; value: string }[];
  link?: { label: string; href: string };
}

export interface Constellation {
  id: string;
  name: string;
  tagline: string; // one-line descriptor shown in the chapter watermark
  edges: [string, string][];
  hiddenQuote?: string; // unlocked when every star is discovered
}

export const CATEGORY_ACCENT: Record<StarCategory, string> = {
  origin: '#FCD34D',
  education: '#22D3EE',
  studio: '#3B9EFF',
  project: '#A78BFA',
  future: '#C084FC',
};

export const CATEGORY_LABEL: Record<StarCategory, string> = {
  origin: 'Origin',
  education: 'Education',
  studio: 'Studio',
  project: 'Project',
  future: 'The Horizon',
};

// Contact channels — mirrors the old ContactBanner, surfaced inside the galaxy.
export type SocialKind = 'facebook' | 'email' | 'github' | 'itch';

export const SOCIALS: { kind: SocialKind; label: string; href: string }[] = [
  { kind: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/doangiabao27' },
  { kind: 'email', label: 'Email', href: 'mailto:doangiabao.dev@gmail.com' },
  { kind: 'github', label: 'GitHub', href: 'https://github.com/nobi-onway' },
  { kind: 'itch', label: 'Itch.io', href: 'https://nobi-onway.itch.io/' },
];

export const STAR_NODES: StarNode[] = [
  // ── Origin ────────────────────────────────────────────────────────────────
  {
    id: 'you',
    label: 'Đoàn Gia Bảo',
    category: 'origin',
    constellationId: 'origin',
    x: 0.17,
    y: 0.46,
    magnitude: 'sun',
    image: '/images/me/career.png',
    title: 'Đoàn Gia Bảo',
    subtitle: 'Game Developer · Technical Artist in the making',
    body: 'The north star of this galaxy. A game developer focused on bridging technical implementation and visual excellence — building experiences that are not only functional, but beautiful and smooth. Guided by a simple core philosophy:',
    bullets: [
      'Practical & Clear — technical solutions with real, practical value for the product.',
      'Minimalist & Responsible — clean code, transparent architecture, full ownership.',
      'Decisive & Optimistic — never giving up on hard bugs, always ready to improve.',
    ],
    meta: [
      { label: 'Experience', value: '2+ Years' },
      { label: 'Direction', value: 'Technical Artist' },
    ],
  },

  // ── The Forge (education) ──────────────────────────────────────────────────
  {
    id: 'fpt',
    label: 'FPT University',
    category: 'education',
    constellationId: 'forge',
    x: 0.12,
    y: 0.64,
    magnitude: 'major',
    image: '/images/me/academic.jpg',
    title: 'FPT University',
    subtitle: '2020 – 2024 · Software Engineering',
    body: 'Pursuing a degree in Software Engineering with a focus on core programming and logic.',
    bullets: [
      'Mastered Data Structures and Algorithms',
      'Developed foundational software engineering principles',
      'Actively participated in campus technology clubs',
    ],
  },
  {
    id: 'vtc',
    label: 'VTC Academy',
    category: 'education',
    constellationId: 'forge',
    x: 0.26,
    y: 0.73,
    magnitude: 'major',
    title: 'VTC Academy',
    subtitle: '2025 · Game Development',
    body: 'Completed an intensive Game Development training program.',
    bullets: [
      'Built complex projects such as FPT Zombie Shooter and a 3D RPG',
      'Mastered Computer Graphics and Game Engine fundamentals',
      'Developed independent technical problem-solving skills',
    ],
  },

  // ── The Studios (career) ───────────────────────────────────────────────────
  {
    id: 'rocket',
    label: 'Rocket Studio',
    category: 'studio',
    constellationId: 'studios',
    x: 0.41,
    y: 0.6,
    magnitude: 'major',
    title: 'Rocket Studio',
    subtitle: '2023 · Intern / Fresher Game Developer',
    body: 'Started a professional journey at one of the leading casual game studios in Vietnam.',
    bullets: [
      'Helped develop Knights vs Orcs (100k+ downloads on Play Store)',
      'Transformed programming mindset from zero to professional',
      'Adapted to the fast pace of Hyper Casual development',
    ],
  },
  {
    id: 'wolffun',
    label: 'Wolffun Studio',
    category: 'studio',
    constellationId: 'studios',
    x: 0.54,
    y: 0.44,
    magnitude: 'major',
    title: 'Wolffun Studio',
    subtitle: '2025 – Present · Game Developer',
    body: 'Working in a high-expertise environment on large-scale Action PvP projects.',
    bullets: [
      'Joined Thetan Immortal — Google Play Best 2025 winner',
      'Built advanced in-game UI, API interaction and global localization',
      'Sharpened skills by solving high-polish challenges',
    ],
  },

  // ── The Pantheon (projects) ────────────────────────────────────────────────
  {
    id: 'thetan',
    label: 'Thetan Immortal',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.75,
    y: 0.31,
    magnitude: 'major',
    accent: '#FBBF24',
    image:
      'https://play-lh.googleusercontent.com/BJO-__WUGVIksIVtJUdZaDIlMrgPxXKp344idlf2UD0NKb0sXDdqty22S3pgdYTHfw=w5120-h2880-rw',
    title: 'Thetan Immortal',
    subtitle: 'PvP Action · Android / iOS',
    body: 'Large-scale Action PvP project that won the Google Play Best 2025 award.',
    bullets: ['Advanced in-game UI system', 'Real-time API integration', 'Global localization system'],
    meta: [{ label: 'Award', value: 'Google Play Best 2025' }],
    link: {
      label: 'View on Google Play',
      href: 'https://play.google.com/store/apps/details?id=com.legendarylabs.tile.match.travel.explorer.puzzle.game.relax&hl=en',
    },
  },
  {
    id: 'tile-travel',
    label: 'Tile Travel',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.88,
    y: 0.44,
    magnitude: 'minor',
    image:
      'https://play-lh.googleusercontent.com/BGjppoJ_rYwMsMUdcQFDVqlTeIWLWlt6EkPS2aMjaVDnfiLKf6N3lP1hg413jylgTDzCQf6e3JvJhLPwnkUf=w5120-h2880',
    title: 'Tile Travel',
    subtitle: 'Tile Match · Puzzle',
    body: 'A Triple Tile Match puzzle game with increasing difficulty and eye-catching graphics.',
  },
  {
    id: 'knights',
    label: 'Knights vs Orcs',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.66,
    y: 0.48,
    magnitude: 'minor',
    image:
      'https://preview.redd.it/i-just-released-a-free-demo-of-tiny-swords-game-assets-link-v0-f22woqj3miz91.gif?format=png8&s=40d99b2e45aa2a89f6a5518b47c365178d512427',
    title: 'Knights vs Orcs',
    subtitle: 'Hyper Casual · 100k+ downloads',
    body: 'A hyper-casual hit reaching 100k+ downloads on the Play Store, built during the Rocket Studio era.',
  },
  {
    id: 'zombie',
    label: 'FPT Zombie Shooter',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.82,
    y: 0.58,
    magnitude: 'minor',
    image:
      'https://assetstorev1-prd-cdn.unity3d.com/key-image/02b8c50d-2dbf-43e5-a28d-2a9c9adcdc1d.jpg',
    title: 'FPT Zombie Shooter',
    subtitle: 'Action · Student Project',
    body: 'A wave-based zombie shooter built during the VTC Academy training program.',
  },
  {
    id: 'rpg',
    label: '3D RPG',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.71,
    y: 0.66,
    magnitude: 'minor',
    title: '3D RPG',
    subtitle: 'RPG · Student Project',
    body: 'A 3D role-playing game exploring computer graphics and game engine systems.',
  },

  // ── The Horizon (future) ───────────────────────────────────────────────────
  {
    id: 'tech-artist',
    label: 'Technical Artist',
    category: 'future',
    constellationId: 'horizon',
    x: 0.5,
    y: 0.76,
    magnitude: 'major',
    title: 'The Next Chapter — Technical Artist',
    subtitle: 'Uncharted',
    body: 'Aiming to master the graphics pipeline and custom shaders, focusing on performance optimization to deliver AAA-quality experiences on mobile.',
    bullets: ['Shader coding', 'VFX pipeline', 'Performance optimization'],
  },
];

export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'origin',
    name: 'Origin',
    tagline: 'Who I am',
    edges: [],
    hiddenQuote:
      '“Realism to solve problems, Minimalism to optimize performance, Decisiveness to achieve the best quality.”',
  },
  {
    id: 'forge',
    name: 'The Forge',
    tagline: 'Where I learned',
    edges: [['fpt', 'vtc']],
    hiddenQuote: 'Where raw curiosity was forged into engineering discipline.',
  },
  {
    id: 'studios',
    name: 'The Studios',
    tagline: 'Where I build',
    edges: [['rocket', 'wolffun']],
    hiddenQuote: 'From first commit to shipping award-winning titles.',
  },
  {
    id: 'pantheon',
    name: 'The Pantheon',
    tagline: 'What I shipped',
    edges: [
      ['thetan', 'knights'],
      ['knights', 'rpg'],
      ['rpg', 'zombie'],
      ['zombie', 'tile-travel'],
      ['tile-travel', 'thetan'],
    ],
    hiddenQuote: 'Every shipped game is a star that never stops burning.',
  },
  {
    id: 'horizon',
    name: 'The Horizon',
    tagline: "What's next",
    edges: [],
    hiddenQuote: 'The brightest star is the one not yet reached.',
  },
];
