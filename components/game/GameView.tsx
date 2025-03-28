'use client';
import {
  getCodeUrl,
  getDataUrl,
  getFrameworkUrl,
  getLoaderUrl,
} from '@/lib/game-build';
import { useEffect, useState } from 'react';
import { Unity, UnityConfig, useUnityContext } from 'react-unity-webgl';

type GameViewPropsType = {
  slug: string;
  mode: 'portrait' | 'landscape';
};

const SlugToBuildInfo: Record<string, UnityConfig> = {
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
};

const viewModeClassName: Record<string, string> = {
  portrait: 'aspect-[9/16] h-full',
  landscape: 'aspect-[1920/1080] w-3/4',
};

function GameView(props: GameViewPropsType) {
  const { slug, mode } = props;
  const [dips, setDips] = useState<number>(2);
  const { unityProvider, isLoaded } = useUnityContext(SlugToBuildInfo[slug]);

  useEffect(() => {
    setDips(window.devicePixelRatio);
  }, [isLoaded]);

  return (
    <Unity
      devicePixelRatio={dips}
      className={viewModeClassName[mode]}
      unityProvider={unityProvider}
    ></Unity>
  );
}

export default GameView;
