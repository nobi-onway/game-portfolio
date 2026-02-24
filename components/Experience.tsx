'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

import { WaterWithUniforms } from './environment/Water';
import FishSchool from './environment/Fish';
import StylizedFoam from './environment/StylizedFoam';
import Debris from './environment/Debris';

import Boat from './player/Boat';

import Milestone from './environment/Milestone';


export default function Experience() {
  // Shared refs for boat → water shader communication
  const boatPos   = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const boatSpeed = useRef<number>(0);
  const boatTurn  = useRef<number>(0);
  const boatYaw   = useRef<number>(0);

  // Island definitions [x, z, radius, foamStrength]
  const islands = [
    new THREE.Vector4(-15, -15, 3.0, 1.0),
    new THREE.Vector4(20,  10, 3.0, 1.0),
    new THREE.Vector4(-10, 20, 3.0, 1.0)
  ];

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      camera={{ position: [20, 20, 20], fov: 45 }}
      style={{ background: '#8fc8d8' }}
    >
      {/* Sky background colour that matches a bright daytime sea */}
      <color attach="background" args={['#8fc8d8']} />
      <fog attach="fog" args={['#b8d8e8', 60, 130]} />

      {/* ── Lighting — bright, warm daylight to make the teal pop ── */}
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#fff8e0"
      />
      {/* Fill light from the opposite side to soften shadows */}
      <directionalLight position={[-20, 10, -20]} intensity={0.6} color="#c8e8ff" />

      <Sky sunPosition={[100, 30, 60]} turbidity={4} rayleigh={0.3} mieCoefficient={0.003} />

      <Physics debug={false}>
        {/* Invisible sea-surface collider so the boat floats */}
        <RigidBody type="fixed">
          <CuboidCollider args={[150, 0.05, 150]} position={[0, -0.05, 0]} />
        </RigidBody>

        {/* Sea surface */}
        <WaterWithUniforms boatPos={boatPos} boatSpeed={boatSpeed} boatTurn={boatTurn} islands={islands} />

        {/* Fish silhouettes below the water */}
        <FishSchool />

        {/* Boat wake ripple rings */}
        <StylizedFoam boatPos={boatPos} boatSpeed={boatSpeed} boatYaw={boatYaw} />


        {/* Floating debris */}
        <Debris />




        {/* Player */}
        <Boat boatPos={boatPos} boatSpeed={boatSpeed} boatTurn={boatTurn} boatYaw={boatYaw} />

        {/* Career Milestones */}
        <Milestone
          position={[-15, 0, -15]}
          year="2022"
          description="Top 5 Game Jam Rocket Studio. Intern & Fresher at Leo Studio (OneSoft)."
          color="#3b82f6"
        />
        <Milestone
          position={[20, 0, 10]}
          year="2024"
          description="Graduated FPT University (SE). Completed Unity 2D/3D at VTC Academy."
          color="#10b981"
        />
        <Milestone
          position={[-10, 0, 20]}
          year="2025"
          description="Wolfun Studio. 2 Projects: PvP Ancher & Solo Puzzle Game."
          color="#f59e0b"
        />

        {/* Map boundaries */}
        <RigidBody type="fixed">
          <CuboidCollider args={[100, 10, 2]} position={[0, 5,  100]} />
          <CuboidCollider args={[100, 10, 2]} position={[0, 5, -100]} />
          <CuboidCollider args={[2, 10, 100]} position={[ 100, 5, 0]} />
          <CuboidCollider args={[2, 10, 100]} position={[-100, 5, 0]} />
        </RigidBody>
      </Physics>

      <Environment preset="dawn" />
    </Canvas>
  );
}
