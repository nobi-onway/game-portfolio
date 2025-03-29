import { ProjectGameType } from './type-data';
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

export const PROJECT_GAMES: ProjectGameType[] = [
  {
    name: 'Knights vs Orcs',
    slug: 'tiny-sword',
    genres: ['Strategy War', 'Tower Defend'],
    type: '2D',
    images: [
      'https://img.itch.zone/aW1nLzEwODI3OTgwLnBuZw==/original/W7Avuv.png',
      'https://preview.redd.it/i-just-released-a-free-demo-of-tiny-swords-game-assets-link-v0-f22woqj3miz91.gif?format=png8&s=40d99b2e45aa2a89f6a5518b47c365178d512427',
    ],
    mode: 'landscape',
    platforms: ['web'],
    brief:
      'Defend the kingdom! Control Knights to fight, Builders to construct and gather resources, and defeat Orcs in an intense tower defense game!',
  },
  {
    name: 'Rocket Escape',
    slug: 'rocket-escape',
    genres: ['Hyper Casual'],
    type: '2D',
    images: [
      'images/rocket-escape/foreground.png',
      'images/rocket-escape/logo.png',
    ],
    mode: 'portrait',
    platforms: ['web'],
    brief:
      'Control a rocket to escape the planet, avoid obstacles, collect fuel, and fly as far as possible!',
  },
  {
    name: 'Flappy Bird',
    slug: 'flappy-bird',
    genres: ['Hyper Casual'],
    type: '2D',
    images: [
      'images/flappy-bird/foreground.png',
      'images/flappy-bird/logo.png',
    ],
    mode: 'portrait',
    platforms: ['web'],
    brief:
      'Control a bird to fly through pipes by tapping the screen, avoid obstacles, and achieve the highest score!',
  },
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
  },
  'flappy-bird': {
    loaderUrl: getLoaderUrl('flappy-bird-web-build'),
    dataUrl: getDataUrl('flappy-bird-web-build'),
    frameworkUrl: getFrameworkUrl('flappy-bird-web-build'),
    codeUrl: getCodeUrl('flappy-bird-web-build'),
  },
};

export const PlatformToIcon: Record<string, StaticImport> = {
  web: WebIcon,
  window: WindowsIcon,
};
