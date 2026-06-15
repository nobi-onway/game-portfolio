// ─────────────────────────────────────────────────────────────────────────────
// The Constellation — data for the interactive "galaxy" section.
// Each StarNode is one abstracted fact from the portfolio (mirrors the facts in
// CAREER_PATH / PROJECT_GAMES / AboutMe). Positions are normalised 0..1 of the
// sky so the layout scales with the viewport.
// ─────────────────────────────────────────────────────────────────────────────

export type StarCategory = 'origin' | 'education' | 'studio' | 'skill' | 'project' | 'future';
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
  role?: string; // "what I personally did" — clarifies contribution on team/studio work
  body?: string;
  bullets?: string[];
  meta?: { label: string; value: string }[];
  links?: { label: string; href: string }[]; // store / trailer / repo — see the real thing
  sections?: Array<{ number: string; title: string; hook: string; subtitle: string }>; // narrative sections with hook + supporting line
  personal?: {
    passion?: string;
    mindset?: string[];
    direction?: string[];
    inspirations?: { name: string; note: string; link?: string }[];
    hobbies?: string[];
  };
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
  skill: '#34D399',
  project: '#A78BFA',
  future: '#C084FC',
};

export const CATEGORY_LABEL: Record<StarCategory, string> = {
  origin: 'Origin',
  education: 'Education',
  studio: 'Studio',
  skill: 'Arsenal',
  project: 'Project',
  future: 'The Horizon',
};

// Résumé / CV — drop the PDF at this path under /public.
export const CV_HREF = '/cv/Doan-Gia-Bao-CV.pdf';

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
    title: 'Đoàn Gia Bảo',
    subtitle: 'Game Developer · Technical Artist in progress · Vietnam',
    personal: {
      passion:
        "I don't just want to make games. I want to make games that feel like they couldn't have been made by anyone else.",
      mindset: [
        'Realism to solve problems.',
        'Minimalism to optimize performance.',
        'Decisiveness to achieve the best quality.',
      ],
      direction: [
        'Master the rendering pipeline end-to-end.',
        'Write shaders that make games feel alive.',
        'Bridge the gap between programmer and artist.',
      ],
      inspirations: [
        {
          name: 'Night Shippers',
          note: 'Proved Vietnamese indie can have heart and polish.',
          link: 'https://store.steampowered.com/app/3761880/Night_Shippers/',
        },
        {
          name: 'The Scourge: Tai Ương',
          note: 'A bold soullike vision from the same soil I stand on.',
          link: 'https://store.steampowered.com/app/2456350/The_Scourge__Tai_ng/',
        },
        {
          name: 'Black Myth: Wukong',
          note: 'Showed Asia what AAA craftsmanship looks like in our hands.',
          link: 'https://store.steampowered.com/app/2358720/Black_Myth_Wukong/',
        },
        {
          name: 'Hollow Knight',
          note: 'Every pixel earns its place. The standard for atmosphere.',
          link: 'https://store.steampowered.com/app/367520/Hollow_Knight/',
        },
      ],
      hobbies: ['Anime', 'Lo-fi music while coding', 'Reverse-engineering shaders I love'],
    },
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
    role: 'Gameplay Programmer',
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
    role: 'Game Developer — In-game UI, API & Localization',
    body: 'Working in a high-expertise environment on large-scale Action PvP projects.',
    bullets: [
      'Joined Thetan Immortal — Google Play Best 2025 winner',
      'Built advanced in-game UI, API interaction and global localization',
      'Sharpened skills by solving high-polish challenges',
    ],
  },

  // ── The Pantheon (projects) — Cancer / Cự Giải shape ─────────────────────
  // δ Asellus Australis — central-right hub; the two Aselli (γ δ) are the
  // close pair, matching how Cancer's body sits at the heart of the crab.
  {
    id: 'thetan',
    label: 'Thetan Immortal',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.80,
    y: 0.43,
    magnitude: 'major',
    accent: '#FBBF24',
    image:
      'https://play-lh.googleusercontent.com/BJO-__WUGVIksIVtJUdZaDIlMrgPxXKp344idlf2UD0NKb0sXDdqty22S3pgdYTHfw=w5120-h2880-rw',
    title: 'Thetan Immortal',
    subtitle: 'PvP Action · Android / iOS',
    role: 'Game Developer @ Wolffun',
    body: 'Large-scale Action PvP project that won the Google Play Best 2025 award.',
    bullets: ['Advanced in-game UI system', 'Real-time API integration', 'Global localization system'],
    meta: [{ label: 'Award', value: 'Google Play Best 2025' }],
    links: [
      {
        label: 'View on Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.legendarylabs.tile.match.travel.explorer.puzzle.game.relax&hl=en',
      },
    ],
  },
  {
    id: 'tile-travel',
    label: 'Tile Travel',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.90,
    y: 0.30,
    magnitude: 'minor',
    image:
      'https://play-lh.googleusercontent.com/BGjppoJ_rYwMsMUdcQFDVqlTeIWLWlt6EkPS2aMjaVDnfiLKf6N3lP1hg413jylgTDzCQf6e3JvJhLPwnkUf=w5120-h2880',
    title: 'Tile Travel',
    subtitle: 'Tile Match · Puzzle',
    role: 'Game Developer @ Wolffun',
    body: 'A Triple Tile Match puzzle game with increasing difficulty and eye-catching graphics.',
  },
  {
    id: 'knights',
    label: 'Knights vs Orcs',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.71,
    y: 0.43,
    magnitude: 'minor',
    image:
      'https://preview.redd.it/i-just-released-a-free-demo-of-tiny-swords-game-assets-link-v0-f22woqj3miz91.gif?format=png8&s=40d99b2e45aa2a89f6a5518b47c365178d512427',
    title: 'Knights vs Orcs',
    subtitle: 'Hyper Casual · 100k+ downloads',
    role: 'Gameplay Programmer @ Rocket Studio',
    body: 'A hyper-casual hit reaching 100k+ downloads on the Play Store, built during the Rocket Studio era.',
  },
  {
    id: 'zombie',
    label: 'FPT Zombie Shooter',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.88,
    y: 0.57,
    magnitude: 'minor',
    image:
      'https://assetstorev1-prd-cdn.unity3d.com/key-image/02b8c50d-2dbf-43e5-a28d-2a9c9adcdc1d.jpg',
    title: 'FPT Zombie Shooter',
    subtitle: 'Action · Student Project',
    role: 'Solo Developer · full ownership',
    body: 'A wave-based zombie shooter built during the VTC Academy training program.',
  },
  {
    id: 'rpg',
    label: '3D RPG',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.63,
    y: 0.55,
    magnitude: 'minor',
    title: '3D RPG',
    subtitle: 'RPG · Student Project',
    role: 'Solo Developer · full ownership',
    body: 'A 3D role-playing game exploring computer graphics and game engine systems.',
  },

  // ── The Arsenal (Unity logo) ────────────────────────────────────────────────
  // unity sits dead-centre; three long arms (csharp ↑, scripting ↙, rendering ↘)
  // radiate 120° apart, and each arm tips into a sharp 45° arrowhead aiming back
  // at the engine — the two leaves are the barbs.
  //
  // Coords are built in true-angle space, then x-offsets are pre-compressed
  // (~÷1.75, the canvas width:height ratio) so the SVG's preserveAspectRatio
  // "none" stretch resolves them to a real 120° spread with 45° arrow apexes.
  //   center : unity
  //   arm ↑  : csharp     → oop, optimization   (arrowhead pointing down)
  //   arm ↙  : scripting  → mono, data          (arrowhead pointing up-right)
  //   arm ↘  : rendering  → vfx, shaders         (arrowhead pointing up-left)
  {
    id: 'unity',
    label: 'Unity Engine',
    category: 'skill',
    constellationId: 'arsenal',
    // Center hub — every arm radiates from the engine.
    x: 0.37,
    y: 0.22,
    magnitude: 'sun',
    title: 'Unity Engine',
    subtitle: 'Primary Engine — the core everything orbits',
    body: 'Shipped multiple titles on Unity across hyper-casual, puzzle and action PvP — from prototype to store release. Every other skill in this arsenal is a discipline I bring to bear inside the engine.',
    bullets: [
      'UGUI & responsive in-game UI',
      'DOTween, Animation & timeline',
      'Mobile build & release pipeline',
    ],
  },

  // ── Core ↑ : C# language ─────────────────────────────────────────────────
  {
    id: 'csharp',
    label: 'C#',
    category: 'skill',
    constellationId: 'arsenal',
    // Arm tip ↑ (long seam up from the engine).
    x: 0.37,
    y: 0.115,
    magnitude: 'major',
    title: 'C# & Gameplay Programming',
    subtitle: 'Core Language',
    body: 'My primary language — clean, allocation-aware C# for gameplay systems, tooling and editor scripting in Unity.',
    bullets: [
      'Gameplay & systems architecture',
      'Modern C# (LINQ, async, generics)',
      'Custom Editor tooling',
    ],
  },
  {
    id: 'oop',
    label: 'OOP & Patterns',
    category: 'skill',
    constellationId: 'arsenal',
    // Barb of the ↑ arrow — upper-right.
    x: 0.388,
    y: 0.037,
    magnitude: 'minor',
    title: 'OOP & Design Patterns',
    subtitle: 'Clean Architecture',
    body: 'Designing maintainable gameplay systems on solid object-oriented foundations, reaching for the right pattern for the job.',
    bullets: ['SOLID principles', 'State, Observer & Factory patterns', 'Decoupled, testable systems'],
  },
  {
    id: 'optimization',
    label: 'Optimization',
    category: 'skill',
    constellationId: 'arsenal',
    // Barb of the ↑ arrow — upper-left.
    x: 0.352,
    y: 0.037,
    magnitude: 'minor',
    title: 'Performance Optimization',
    subtitle: 'Mobile-first',
    body: 'Profiling and optimising for low-end mobile — zero-alloc patterns, GC pressure, memory and frame budget.',
    bullets: ['Unity Profiler & Frame Debugger', 'Zero-alloc & GC management', 'Draw-call & batching control'],
  },

  // ── Core ↙ : Engine scripting & architecture ─────────────────────────────
  {
    id: 'scripting',
    label: 'Engine Scripting',
    category: 'skill',
    constellationId: 'arsenal',
    // Arm tip ↙ (long seam down-left from the engine).
    x: 0.318,
    y: 0.273,
    magnitude: 'major',
    title: 'Scripting & Architecture',
    subtitle: 'Unity Runtime Model',
    body: "Structuring a game's runtime around Unity's component model and data-driven content for flexible, scalable systems.",
    bullets: ['Component-driven design', 'Data-driven content', 'Event & messaging systems'],
  },
  {
    id: 'mono',
    label: 'MonoBehaviour',
    category: 'skill',
    constellationId: 'arsenal',
    // Barb of the ↙ arrow — outer-left.
    x: 0.27,
    y: 0.284,
    magnitude: 'minor',
    title: 'MonoBehaviour & Lifecycle',
    subtitle: 'Component Model',
    body: 'Mastering the Unity execution order and component lifecycle to build predictable, frame-efficient gameplay logic.',
    bullets: ['Update / FixedUpdate budgeting', 'Coroutines & lifecycle hooks', 'Custom component design'],
  },
  {
    id: 'data',
    label: 'ScriptableObject',
    category: 'skill',
    constellationId: 'arsenal',
    // Barb of the ↙ arrow — lower.
    x: 0.289,
    y: 0.339,
    magnitude: 'minor',
    title: 'ScriptableObject & Addressables',
    subtitle: 'Data-Driven Content',
    body: 'Decoupling configuration and content from code with ScriptableObjects, and streaming assets on demand via Addressables.',
    bullets: ['ScriptableObject architecture', 'Addressables & asset streaming', 'Designer-friendly tooling'],
  },

  // ── Core ↘ : Rendering & graphics ────────────────────────────────────────
  {
    id: 'rendering',
    label: 'Rendering',
    category: 'skill',
    constellationId: 'arsenal',
    // Arm tip ↘ (long seam down-right from the engine).
    x: 0.422,
    y: 0.273,
    magnitude: 'major',
    title: 'Rendering & Graphics',
    subtitle: 'Visual Pipeline',
    body: 'Driving the look of the game through the URP pipeline — from material authoring to lighting and post-processing on mobile.',
    bullets: ['URP rendering pipeline', 'Lighting & materials', 'Mobile-friendly rendering'],
  },
  {
    id: 'vfx',
    label: 'Real-time VFX',
    category: 'skill',
    constellationId: 'arsenal',
    // Barb of the ↘ arrow — outer-right.
    x: 0.47,
    y: 0.284,
    magnitude: 'minor',
    title: 'VFX & Real-time Effects',
    subtitle: 'Game Feel',
    body: 'Particle systems and shader-driven effects that make combat and UI feel responsive and juicy.',
    bullets: ['Shuriken & VFX Graph', 'Shader-driven effects', 'Juice & game-feel polish'],
  },
  {
    id: 'shaders',
    label: 'Shaders / HLSL',
    category: 'skill',
    constellationId: 'arsenal',
    // Barb of the ↘ arrow — lower.
    x: 0.451,
    y: 0.339,
    magnitude: 'minor',
    title: 'Shaders & Graphics',
    subtitle: 'Technical Art focus',
    body: 'Where I am heading: authoring HLSL and Shader Graph for stylised, performant looks on mobile URP.',
    bullets: ['HLSL & Shader Graph', 'Stylised lighting', 'Post-processing & screen FX'],
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
    id: 'arsenal',
    name: 'The Arsenal',
    tagline: 'What I wield',
    // Traced as the Unity logo — a hexagonal cube with the engine at its core.
    // 1 center (unity) → 3 cores at 120° → each core forks to 2 leaves (10 stars):
    //   ↑  csharp    → oop, optimization   (top face)
    //   ↙  scripting → mono, data          (lower-left face)
    //   ↘  rendering → vfx, shaders        (lower-right face)
    edges: [
      // Three inner seams — from the engine out to each core (the cube's "Y").
      ['unity', 'csharp'],
      ['unity', 'scripting'],
      ['unity', 'rendering'],
      // Each core forks into its two leaves.
      ['csharp', 'oop'],
      ['csharp', 'optimization'],
      ['scripting', 'mono'],
      ['scripting', 'data'],
      ['rendering', 'vfx'],
      ['rendering', 'shaders'],
      // Outer hexagon silhouette — leaves linked into the cube outline.
      ['oop', 'optimization'],
      ['optimization', 'vfx'],
      ['vfx', 'shaders'],
      ['shaders', 'data'],
      ['data', 'mono'],
      ['mono', 'oop'],
    ],
    hiddenQuote: 'Tools are only as sharp as the hands that wield them.',
  },
  {
    id: 'pantheon',
    name: 'The Pantheon',
    tagline: 'What I shipped',
    // Cancer / Cự Giải: rpg(β)─knights(γ)─thetan(δ) horizontal spine,
    // tile-travel(ι) forking upper-right, zombie(α) forking lower-right.
    edges: [
      ['rpg', 'knights'],
      ['knights', 'thetan'],
      ['thetan', 'tile-travel'],
      ['thetan', 'zombie'],
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
