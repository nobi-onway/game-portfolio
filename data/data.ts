import { ProjectGameType, CareerMilestone } from './type-data';
import {
  getCodeUrl,
  getDataUrl,
  getFrameworkUrl,
  getLoaderUrl,
} from '@/lib/game-build';
import { UnityConfig } from 'react-unity-webgl';

import WindowsIcon from '@/public/images/windows.png';
import WebIcon from '@/public/images/html5.png';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export const CAREER_PATH: CareerMilestone[] = [
  {
    year: '2023',
    company: 'Rocket Studio',
    role: 'Intern / Fresher Game Developer',
    description: 'Started professional journey at one of the leading casual game studios in Vietnam.',
    achievements: [
      'Participated in developing Knights vs Orcs (100k+ downloads on Play Store)',
      'Strongly transformed programming mindset from zero to professional',
      'Learned to adapt to the extremely fast development pace of Hyper Casual projects'
    ]
  },
  {
    year: '2020 - 2024',
    company: 'FPT University',
    role: 'Software Engineering Student',
    description: 'Pursuing a degree in Software Engineering with a focus on core programming and logic.',
    achievements: [
      'Mastered Data Structures and Algorithms',
      'Developed foundational software engineering principles',
      'Actively participated in campus technology clubs'
    ]
  },
  {
    year: '2025',
    company: 'VTC Academy',
    role: 'Graduated Student',
    description: 'Completed intensive Game Development training program.',
    achievements: [
      'Built complex projects such as FPT Zombie Shooting and 3D RPG',
      'Mastered foundational knowledge in Computer Graphics and Game Engines',
      'Developed independent technical problem-solving skills'
    ]
  },
  {
    year: '2025 - Present',
    company: 'Wolffun Studio',
    role: 'Game Developer',
    description: 'Working in a high-expertise environment with large-scale Action PvP projects.',
    achievements: [
      'Joined Thetan Immortal project - Google Play Best 2025 award winner',
      'Developed advanced in-game UI systems, API interaction, and global localization',
      'Enhanced professional skills by solving high-polish challenges'
    ]
  }
];

export const PROJECT_GAMES: ProjectGameType[] = [
  {
    name: 'Thetan Immortal',
    slug: 'thetan-immortal',
    genres: ['PvP Action', 'Action'],
    type: '3D',
    images: [
      'https://play-lh.googleusercontent.com/BJO-__WUGVIksIVtJUdZaDIlMrgPxXKp344idlf2UD0NKb0sXDdqty22S3pgdYTHfw=w5120-h2880-rw',
      'https://play-lh.googleusercontent.com/u3ms58vTR1rIkR35AFepou9VAYMPpCgMlzmGxwQXVA2w-ZXBPtvdjIo7OldVqGpoSQ=w1052-h592-rw'
    ],
    mode: 'landscape',
    platforms: ['android', 'ios'],
    brief: 'Large-scale Action PvP project, winning Google Play Best 2025 award.',
    role: 'Game Developer',
    achievements: ['Google Play Best 2025'],
    deepInsights: {
      challenge: 'Requires extremely high UI responsiveness in a PvP Action environment with a complex multi-language system.',
      solution: 'Built performance-optimized UI systems, real-time API integration, and flexible localization.',
      technicalDetails: [
        'Advanced Ingame UI system',
        'API Integration (Real-time data)',
        'Global Localization System'
      ]
    },
    links: {
      store: 'https://play.google.com/store/apps/details?id=com.legendarylabs.tile.match.travel.explorer.puzzle.game.relax&hl=en'
    }
  },
  {
    name: 'Tile Travel',
    slug: 'tile-travel',
    genres: ['Tile Match', 'Puzzle'],
    type: '2D',
    images: [
      'https://play-lh.googleusercontent.com/BGjppoJ_rYwMsMUdcQFDVqlTeIWLWlt6EkPS2aMjaVDnfiLKf6N3lP1hg413jylgTDzCQf6e3JvJhLPwnkUf=w5120-h2880',
      'https://play-lh.googleusercontent.com/JXSlh8BmY2s-H9yOhZLUxTsmCBu78GZLujDNSNS_H-iWABE0iK0doH9xUf5tWj1epTAusj3vmFb3D8OtfVO9=w5120-h2880'
    ],
    mode: 'portrait',
    platforms: ['android', 'ios'],
    brief: 'Triple Tile Match puzzle game with increasing difficulty and eye-catching graphics.',
    role: 'Solo Developer',
    deepInsights: {
      challenge: 'Architecture bloat, low performance with many tiles, and difficult-to-maintain legacy code.',
      solution: 'Applied Clean Code, SRP principles, and intensive memory optimization techniques.',
      technicalDetails: [
        'Clean Code & Separation Responsibility (SRP)',
        'Architecture Refactoring',
        'Performance Optimization (Object Pooling, Draw call reduction)',
        'Memory management'
      ]
    },
    links: {
      store: 'https://play.google.com/store/apps/details?id=com.legendarylabs.tile.match.travel.explorer.puzzle.game.relax&hl=en'
    }
  },
  {
    name: 'Knights vs Orcs',
    slug: 'knights-vs-orcs',
    genres: ['Strategy War', 'Tower Defend'],
    type: '2D',
    images: [
      'https://preview.redd.it/i-just-released-a-free-demo-of-tiny-swords-game-assets-link-v0-f22woqj3miz91.gif?format=png8&s=40d99b2e45aa2a89f6a5518b47c365178d512427',
      'https://preview.redd.it/i-just-released-a-free-demo-of-tiny-swords-game-assets-link-v0-f22woqj3miz91.gif?format=png8&s=40d99b2e45aa2a89f6a5518b47c365178d512427'
    ],
    mode: 'landscape',
    platforms: ['android'],
    brief: 'Strategic battle game featuring epic combat between knights and orcs.',
    role: 'Intern / Fresher Developer',
  },
  {
    name: 'FPT Zombie Shooting',
    slug: 'fpt-zombie-shooting',
    genres: ['Action'],
    type: '3D',
    images: [
      'https://assetstorev1-prd-cdn.unity3d.com/key-image/02b8c50d-2dbf-43e5-a28d-2a9c9adcdc1d.jpg',
      'https://assetstorev1-prd-cdn.unity3d.com/key-image/02b8c50d-2dbf-43e5-a28d-2a9c9adcdc1d.jpg'
    ],
    mode: 'landscape',
    platforms: ['window'],
    brief: 'Graduation project at VTC Academy, focusing on shooting mechanics and AI.',
    role: 'Main Developer'
  }
];

export const SlugToBuildInfo: Record<string, UnityConfig> = {
  'tiny-sword': {
    loaderUrl: getLoaderUrl('tiny-sword-web-build'),
    dataUrl: getDataUrl('tiny-sword-web-build'),
    frameworkUrl: getFrameworkUrl('tiny-sword-web-build'),
    codeUrl: getCodeUrl('tiny-sword-web-build'),
  },
  'rocket-escape': {
    loaderUrl: getLoaderUrl('rocket-escape-web-build'),
    dataUrl: getDataUrl('rocket-escape-web-build'),
    frameworkUrl: getFrameworkUrl('rocket-escape-web-build'),
    codeUrl: getCodeUrl('rocket-escape-web-build'),
  }
};

export const PlatformToIcon: Record<string, StaticImport> = {
  web: WebIcon,
  window: WindowsIcon,
};
