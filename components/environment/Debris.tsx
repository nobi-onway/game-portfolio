'use client';

import { useMemo } from 'react';

import { RigidBody } from '@react-three/rapier';




interface DebrisItemProps {
  position: [number, number, number];
  type: 'barrel' | 'plank';
}

function DebrisItem({ position, type }: DebrisItemProps) {





  return (
    <RigidBody
      position={position}
      colliders="cuboid"
      linearDamping={2}
      angularDamping={2}
    >

      {type === 'barrel' ? (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
          <meshStandardMaterial color="#4a3a2a" />
        </mesh>
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.1, 0.4]} />
          <meshStandardMaterial color="#5a4a3a" />
        </mesh>
      )}
    </RigidBody>
  );
}

export default function Debris() {
  const items = useMemo(() => [
    { pos: [10, 0.5, -10] as [number, number, number], type: 'barrel' as const },
    { pos: [-12, 0.5, 5] as [number, number, number],  type: 'plank' as const },
    { pos: [5, 0.5, 15] as [number, number, number],   type: 'barrel' as const },
    { pos: [-20, 0.5, -5] as [number, number, number], type: 'plank' as const },
    { pos: [18, 0.5, 25] as [number, number, number],  type: 'barrel' as const },

  ], []);

  return (
    <>
      {items.map((item, i) => (
        <DebrisItem key={i} position={item.pos} type={item.type} />
      ))}
    </>
  );
}
