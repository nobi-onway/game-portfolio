'use client';

import { Suspense } from 'react';
import Experience from '@/components/Experience';
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

export default function Home() {
  const map: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  ];

  return (
    <main className="h-screen w-full bg-[#151517]">
      <KeyboardControls map={map}>
        <Suspense fallback={<div className="flex h-full items-center justify-center text-white">Loading Sea...</div>}>
          <Experience />
        </Suspense>
      </KeyboardControls>
    </main>
  );
}

