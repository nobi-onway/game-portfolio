'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

interface MilestoneProps {
  position: [number, number, number];
  year: string;
  description: string;
  color?: string;
}

export default function Milestone({ position, year, description, color = '#2a3a1a' }: MilestoneProps) {
  const [active, setActive] = useState(false);

  return (
    <group position={position}>
      {/* Island static collider */}
      <RigidBody type="fixed" colliders="trimesh">
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2, 3, 2, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>

      {/* Sensor trigger zone — must be inside its own RigidBody */}
      <RigidBody type="fixed" sensor position={[0, 1, 0]}
        onIntersectionEnter={() => setActive(true)}
        onIntersectionExit={() => setActive(false)}
      >
        <CuboidCollider args={[4, 4, 4]} />
      </RigidBody>

      {/* Glowing buoy on top */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} />
      </mesh>

      {/* Career info card — only shown when boat is inside sensor */}
      {active && (
        <Html distanceFactor={15} position={[0, 5, 0]} center>
          <div
            style={{ width: '16rem', padding: '1rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color }}>{year}</h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.6 }}>{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
