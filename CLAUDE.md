# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Rules

- **Only modify code** — never run `npm run build`, `npm run start`, deploy, or any build/publish commands unless explicitly asked.
- Do not auto-verify changes by launching the dev server or running the app. Code edits are sufficient.

## Quick Start

**Development:**
```bash
npm run dev
# Visit http://localhost:3000
```

**Building & Deployment:**
```bash
npm run build      # Static export to ./out
npm run start      # Production server (locally)
```

**Code Quality:**
```bash
npm run lint       # Check linting
npm run lint:fix   # Fix linting issues
npm run format     # Format code with Prettier
npm run type-check # TypeScript type checking
```

## Project Architecture

This is a **Next.js 15 (App Router) game portfolio website** showcasing games built with Unity and custom mechanics, plus career/profile information.

### Key Folders

- **`/app`** — Next.js App Router pages
  - `page.tsx` — Home page (portfolio landing)
  - `details/[slug]/page.tsx` — Game detail pages (dynamic routes)
  - `play-zone/[slug]/page.tsx` — Game play/embed pages
  - `layout.tsx` — Root HTML layout with metadata
  
- **`/components`** — React components organized by feature
  - `game/` — GameCatalog (filterable grid), GameCard, GameView (embeds/plays), GameInfo
  - `profile/` — AboutMe, CareerPath (timeline), AcademicPath sections
  - `mechanics/` — Feature-specific game mechanic components (e.g., ZombieShooterMechanic, TileTripleMatch)
  - `common/` — Reusable UI: Button, IconButton, Banner, Footer, FilterBar, AnimatedSection, Tag, Navigation, ContactBanner
  - `action/` — Navigation/layout components
  
- **`/data`** — Centralized data
  - `type-data.ts` — TypeScript types: `ProjectGameType`, `CareerMilestone`, `DeepInsight`
  - `data.ts` — `PROJECT_GAMES` array (game metadata) and `CAREER_PATH` array (career milestones)
  
- **`/lib`** — Utilities
  - `game-build.ts` — Helpers for Unity WebGL build asset URLs (loaders, frameworks, WASM, data files)
  
- **`/public/build/`** — Unity WebGL builds (pre-compiled binaries from Unity Editor)
- **`/public/images/`** — Static game images, profile photos, social icons

### How It Works

1. **Data-Driven Design**: Game metadata (name, genres, images, links, type, mode) lives in `/data/data.ts`
2. **Dynamic Pages**: Games use dynamic routes `[slug]` to generate pages from data
3. **Unity Integration**: Games embed via `react-unity-webgl` using build artifacts from `/public/build/`
4. **Responsive UI**: Tailwind CSS + Framer Motion for animations; components handle mobile/desktop
5. **Static Export**: `next.config.ts` sets `output: 'export'` → builds to `/out` for static hosting

## Component Patterns

- **Server Components by Default**: Pages are server components; client-side interactivity uses `'use client'`
- **Animated Sections**: Use `AnimatedSection` (preset: fadeIn, slideUp, etc.) for entrance animations
- **Game Cards**: Filterable by type (2D/3D/All) using `FilterBar` component
- **Reusable Icons**: `lucide-react` for icons; `IconButton` and `Button` for interactions

## Styling

- **Tailwind CSS 4.0**: All utilities in `.{ts,tsx,js,jsx}` files
- **Prettier Plugin**: Auto-formats Tailwind classes on save
- **CSS Variables**: Root-level vars (e.g., `--primary`, `--text-muted`, `--background`) referenced via `var(--name)`
- **Responsive Breakpoints**: Mobile-first (no prefix = mobile, `md:` = 768px+, `lg:` = 1024px+)

## Adding a New Game

1. Add entry to `PROJECT_GAMES` in `/data/data.ts` with slug, name, genres, type, images, platforms, brief, etc.
2. (Optional) Create a game mechanic component in `/components/mechanics/` if it's featured prominently
3. Dynamic routes automatically generate:
   - `/details/[slug]` page (detail view)
   - `/play-zone/[slug]` page (game view/embed)
4. Upload Unity WebGL build to `/public/build/[slug]-web-build/` if embedding a playable version

## Key Dependencies

- **next@15.1.7** — Framework
- **react@19** — UI library
- **typescript@5.7** — Type safety
- **tailwindcss@4.0.8** — Styling
- **framer-motion@12.35.2** — Animations
- **react-unity-webgl@9.8.0** — Unity WebGL integration
- **firebase@11.5.0** — Backend services (if used)
- **lucide-react** — Icon library

## Development Notes

- **Commit Hooks**: Husky + Commitlint enforce conventional commit messages
- **Type Safety**: `strict: true` in `tsconfig.json` — all types must be explicit
- **Import Sorting**: ESLint plugin `simple-import-sort` auto-organizes imports by `lint --fix`
- **Router**: Next.js App Router; avoid Pages Router patterns
- **Images**: Remote images need explicit `remotePatterns` in `next.config.ts` (currently allows all `https://` domains)
- **Static Export**: No API routes or server-only functions; all data must be static or fetched client-side at build time
