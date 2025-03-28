'use client';
import { SlugToBuildInfo } from '@/data/data';
import { GameMode } from '@/data/type-data';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

type GameViewPropsType = {
  slug: string;
};

const viewModeClassName: Record<GameMode, string> = {
  portrait: 'aspect-[9/16] h-full',
  landscape: 'aspect-[1920/1080] w-3/4',
};

function GameView(props: GameViewPropsType) {
  const { slug } = props;
  const [dips, setDips] = useState<number>(2);
  const { unityProvider, isLoaded } = useUnityContext(SlugToBuildInfo[slug]);

  const mode: GameMode = useSearchParams().get('mode') as
    | GameMode
    | 'landscape';

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
