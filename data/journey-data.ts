// ─────────────────────────────────────────────────────────────────────────────
// The Constellation — data for the interactive "galaxy" section.
// Each StarNode is one abstracted fact from the portfolio (mirrors the facts in
// CAREER_PATH / PROJECT_GAMES / AboutMe).
//
// Positions are normalised 0..1 of the sky. Authoring stays "shape-first": each
// star is placed relative to its own constellation, and `applyConstellationLayout`
// (bottom of file) then drops every constellation into an evenly-spaced horizontal
// band so the chapters never crowd. The sky canvas is wider than the screen and
// scrolls on X — see SKY_WIDTH_REM / ConstellationSky.
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
  // Label placement — for dense clusters (e.g. Arsenal) so taglines don't collide.
  labelDir?: 'top' | 'bottom' | 'left' | 'right'; // side the label sits on (default 'bottom')
  labelOnHover?: boolean; // reveal the label only on hover/focus (keeps tight clusters clean)
  image?: string; // hero shot shown in the detail modal / codex card
  title: string;
  subtitle?: string;
  role?: string; // "what I personally did" — clarifies contribution on team/studio work
  body?: string;
  bullets?: string[];
  meta?: { label: string; value: string }[];
  links?: { label: string; href: string; icon?: string }[]; // store / trailer / repo — see the real thing (icon: optional logo URL)
  sections?: Array<{ number: string; title: string; hook: string; subtitle: string }>; // narrative sections with hook + supporting line
  personal?: {
    passion?: string;
    mindset?: string[];
    direction?: string[];
    inspirations?: { name: string; note: string; link?: string }[];
    hobbies?: string[];
    // Per-node overrides for the three block headers (defaults: Passion / Mindset / Direction).
    labels?: { passion?: string; mindset?: string; direction?: string };
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

const RAW_STAR_NODES: StarNode[] = [
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
    image: '/images/fpt-bachelor.JPG',
    personal: {
      labels: { passion: 'What I took away', mindset: 'Discipline', direction: 'Capstone' },
      passion:
        'I came to FPT to learn how to code — and discovered what it takes to be an engineer who thinks in systems before he builds.',
      mindset: [
        'I learned to see problems as algorithms — to make every solution efficient by design.',
        'I learned to architect systems — to build software that endures and scales.',
        'I learned to write deliberate code — to think clearly before touching the keyboard.',
      ],
      direction: [
        'Developed E-Furniture — an AR app for real-time 3D furniture visualization in home environments.',
      ],
    },
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
    image: '/images/vtc-bachelor.JPG',
    personal: {
      labels: { passion: 'What I took away', mindset: 'Discipline', direction: 'Capstone' },
      passion:
        'I came to VTC to turn a hobby into a craft — and found what it takes to be a developer who understands games from the pixel to the pipeline.',
      mindset: [
        'I learned how graphics are rendered — to understand what makes a game look alive.',
        'I learned an engine from the inside — to command the loop, the pipeline, the physics.',
        'I learned to build with raycasting & physics — to make mechanics feel precise and real.',
      ],
      direction: [
        'Developed a 3D FPS Zombie Shooter — immersive shooting mechanics with Raycasting for precise hit detection.',
      ],
    },
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
    personal: {
      labels: { passion: 'The work', mindset: 'Craft', direction: 'Impact' },
      passion:
        "I joined Rocket Studio as a fresher to put what I'd studied into production — and learned what it really takes to ship a game with a team.",
      mindset: [
        'I learned to write gameplay code that ships — not just code that runs.',
        'I adapted to the pace and constraints of hyper-casual production.',
        'I turned an academic mindset into a professional one.',
      ],
      direction: [
        'Helped ship Toilet Paper Rush — 100k+ downloads on Google Play.',
      ],
    },
    links: [{ label: 'Visit Rocket Studio', href: 'https://rocketgamestudio.com/vi' }],
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
    subtitle: '2025 – 2026 · Game Developer',
    role: 'Solo Game Developer',
    personal: {
      labels: { passion: 'The work', mindset: 'Craft', direction: 'Impact' },
      passion:
        'I joined Wolffun to grow inside a senior team — and learned to hold my own work to a global standard of polish.',
      mindset: [
        'I build in-game UI for a large-scale, live Action-PvP product.',
        'I integrate gameplay APIs and deliver global localization.',
        'I sharpen my craft by solving high-polish, production-grade challenges.',
      ],
      direction: [
        'Contributing to Thetan Immortal — Google Play Best of 2025.',
      ],
    },
    links: [
      {
        label: 'Visit Wolffun Studio',
        href: 'https://wolffungame.com',
        icon: 'https://vgda.vn/uploads/logo_wolffun_500x2_-_khanh_nguyen_dinh.png',
      },
    ],
  },
  {
    id: 'mint-rocket',
    label: 'Mint Rocket',
    category: 'studio',
    constellationId: 'studios',
    x: 0.63,
    y: 0.6,
    magnitude: 'major',
    title: 'Mint Rocket',
    subtitle: '2026 – Present · Game Developer',
    role: 'Gameplay Programmer',
    personal: {
      labels: { passion: 'The work', mindset: 'Craft', direction: 'Impact' },
      passion:
        'I joined Mint Rocket — the studio behind Dave the Diver — to build games where gameplay depth, art, and story come together as one.',
      mindset: [
        'I build and refine the core gameplay systems players feel moment to moment.',
        'I turn design intent into responsive, polished mechanics.',
        'I work closely with art and design to make every interaction feel right.',
      ],
      direction: [
        "Crafting the studio's next experience — more to come.",
      ],
    },
    links: [{ label: 'Visit Mint Rocket', href: 'https://www.mintrock.et/en/' }],
  },

  // ── The Pantheon (projects) — Cancer / Cự Giải shape ─────────────────────
  // ── The Pantheon (projects) ───────────────────────────────────────────────
  {
    id: 'zombie',
    label: 'FPS Zombie Shooter',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.88,
    y: 0.57,
    magnitude: 'minor',
    image:
      'https://assetstorev1-prd-cdn.unity3d.com/key-image/02b8c50d-2dbf-43e5-a28d-2a9c9adcdc1d.jpg',
    title: 'FPS Zombie Shooter',
    subtitle: 'Action · Student Project',
    role: 'Solo Developer · full ownership',
    body: 'A wave-based zombie shooter built during the VTC Academy training program.',
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
    id: 'dave-the-diver',
    label: 'Dave the Diver',
    category: 'project',
    constellationId: 'pantheon',
    x: 0.63,
    y: 0.55,
    magnitude: 'minor',
    accent: '#38BDF8',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1868140/header.jpg',
    title: 'Dave the Diver',
    subtitle: 'Adventure · Mint Rocket',
    body: 'The game that redefined what a small team could achieve — handcrafted depth in every mechanic, every pixel, every detail.',
    links: [{ label: 'View on Steam', href: 'https://store.steampowered.com/app/1868140/Dave_the_Diver/' }],
  },

  // ── The Arsenal (Unity logo) ────────────────────────────────────────────────
  // unity sits dead-centre; three long arms (csharp ↓, scripting ↖, rendering ↗)
  // radiate 120° apart, and each arm tips into a wide swept-back arrowhead — the
  // two barbs open into a 120° wedge facing the engine (240° on the outer side),
  // each barb sitting 60° off the inward (toward-engine) axis.
  // (The whole arsenal is flipped vertically about the engine.)
  //
  // Coords are built in true-angle space, then x-offsets are pre-compressed
  // (~÷1.75, the canvas width:height ratio) so the SVG's preserveAspectRatio
  // "none" stretch resolves them to a real 120° spread with 120°/240° arrowheads.
  //   center : unity
  //   arm ↓  : csharp     → oop, optimization   (barbs swept up toward engine)
  //   arm ↖  : scripting  → mono, data          (barbs swept toward engine)
  //   arm ↗  : rendering  → vfx, shaders         (barbs swept toward engine)
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
    // Arm tip ↓ (long seam down from the engine).
    x: 0.37,
    y: 0.357,
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
    // Barb of the ↓ arrow — swept up toward engine, right side (60° off inward).
    x: 0.425,
    y: 0.302,
    magnitude: 'minor',
    labelDir: 'right',
    labelOnHover: true,
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
    // Barb of the ↓ arrow — swept up toward engine, left side (60° off inward).
    x: 0.315,
    y: 0.302,
    magnitude: 'minor',
    labelDir: 'left',
    labelOnHover: true,
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
    // Arm tip ↖ (long seam up-left from the engine).
    x: 0.302,
    y: 0.151,
    magnitude: 'major',
    labelDir: 'left',
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
    // Barb of the ↖ arrow — swept toward engine (60° off inward axis).
    x: 0.302,
    y: 0.260,
    magnitude: 'minor',
    labelDir: 'left',
    labelOnHover: true,
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
    // Barb of the ↖ arrow — swept toward engine (60° off inward axis).
    x: 0.357,
    y: 0.097,
    magnitude: 'minor',
    labelDir: 'top',
    labelOnHover: true,
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
    // Arm tip ↗ (long seam up-right from the engine).
    x: 0.438,
    y: 0.151,
    magnitude: 'major',
    labelDir: 'right',
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
    // Barb of the ↗ arrow — swept toward engine (60° off inward axis).
    x: 0.438,
    y: 0.260,
    magnitude: 'minor',
    labelDir: 'right',
    labelOnHover: true,
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
    // Barb of the ↗ arrow — swept toward engine (60° off inward axis).
    x: 0.383,
    y: 0.097,
    magnitude: 'minor',
    labelDir: 'top',
    labelOnHover: true,
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

// ─────────────────────────────────────────────────────────────────────────────
// Constellation layout — spreads the chapters left→right with a fixed gap.
//
// Why: the raw stars above are authored "shape-first" (each cluster drawn around
// its own centre), which left the constellations overlapping in X. This pass
// keeps every cluster's internal shape, just (1) compacts it a touch and (2)
// re-homes it into its own horizontal band so there is always clear space
// between chapters. The bands fill the wide, horizontally-scrolling sky canvas.
// ─────────────────────────────────────────────────────────────────────────────

// Reading order of the chapters across the sky (matches the chapter numbers).
const CONSTELLATION_ORDER = ['origin', 'forge', 'studios', 'arsenal', 'pantheon', 'horizon'] as const;

// Sky canvas width, in rem (kept in sync with ConstellationSky's min-width). The
// galaxy is intentionally wider than the screen so the chapters breathe and the
// canvas scrolls on X.
export const SKY_WIDTH_REM = 120;
// Width the Arsenal "Unity logo" was authored against. Its x-offsets are squeezed
// by BASE/WIDTH so the logo keeps its aspect when the canvas is stretched wider.
const SKY_BASE_REM = 64;

// How tightly each cluster is packed (1 = as authored). Sub-1 buys gap between
// chapters while keeping stars within a chapter comfortably readable.
const INTERNAL_SCALE = 0.72;
// Per-constellation spacing multiplier (×INTERNAL_SCALE). Uniform, so it spreads
// the stars without distorting the constellation's shape or its angles. Arsenal
// packs 10 stars into a tight Unity-logo footprint, so it gets extra breathing room.
const CLUSTER_SPACING: Partial<Record<(typeof CONSTELLATION_ORDER)[number], number>> = {
  arsenal: 1.4,
};
// Usable horizontal range; the rest is breathing room at the sky's edges.
const LAYOUT_X: [number, number] = [0.05, 0.95];

function applyConstellationLayout(nodes: StarNode[]): StarNode[] {
  const byId = new Map<string, StarNode[]>();
  for (const id of CONSTELLATION_ORDER) byId.set(id, []);
  for (const node of nodes) byId.get(node.constellationId)?.push(node);

  // 1. Per constellation: centroid + each member's compacted offset from it.
  const groups = CONSTELLATION_ORDER.map(id => {
    const members = byId.get(id) ?? [];
    const cy = members.reduce((sum, n) => sum + n.y, 0) / members.length;
    const cx = members.reduce((sum, n) => sum + n.x, 0) / members.length;
    // Arsenal alone is squeezed horizontally to hold the Unity-logo aspect ratio
    // once the SVG/percentage layout stretches it across the wide canvas.
    const xSqueeze = id === 'arsenal' ? SKY_BASE_REM / SKY_WIDTH_REM : 1;
    const scale = INTERNAL_SCALE * (CLUSTER_SPACING[id] ?? 1);
    const offsets = members.map(node => ({
      node,
      dx: (node.x - cx) * scale * xSqueeze,
      dy: (node.y - cy) * scale,
    }));
    const halfWidth = Math.max(0, ...offsets.map(o => Math.abs(o.dx)));
    return { cy, halfWidth, offsets };
  });

  // 2. Distribute the bands edge-to-edge with one shared, fixed gap between them.
  const span = LAYOUT_X[1] - LAYOUT_X[0];
  const totalWidth = groups.reduce((sum, g) => sum + g.halfWidth * 2, 0);
  const gap = (span - totalWidth) / Math.max(1, groups.length - 1);

  let edge = LAYOUT_X[0];
  for (const group of groups) {
    const center = edge + group.halfWidth;
    for (const { node, dx, dy } of group.offsets) {
      node.x = center + dx;
      node.y = group.cy + dy; // keep each chapter's authored vertical position
    }
    edge = center + group.halfWidth + gap;
  }

  return nodes;
}

export const STAR_NODES: StarNode[] = applyConstellationLayout(RAW_STAR_NODES);

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
    edges: [['rocket', 'wolffun'], ['wolffun', 'mint-rocket']],
    hiddenQuote: 'From first commit to shipping award-winning titles.',
  },
  {
    id: 'arsenal',
    name: 'The Arsenal',
    tagline: 'What I wield',
    // A clean tree — the engine at the core, three cores at 120°, each forking
    // into its two leaves. No outer silhouette, so every edge reads as a branch.
    //   csharp    → oop, optimization
    //   scripting → mono, data
    //   rendering → vfx, shaders
    edges: [
      // Three inner seams — from the engine out to each core.
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
    ],
    hiddenQuote: 'Tools are only as sharp as the hands that wield them.',
  },
  {
    id: 'pantheon',
    name: 'The Pantheon',
    tagline: 'What I shipped',
    // Cancer / Cự Giải: dave-the-diver(β)─knights(γ)─thetan(δ) horizontal spine,
    // tile-travel(ι) forking upper-right, zombie(α) forking lower-right.
    edges: [
      ['dave-the-diver', 'knights'],
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
