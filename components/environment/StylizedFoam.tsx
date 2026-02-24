'use client';

import { useRef } from 'react';

import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
//  STYLIZED FOAM SHADER
//  Graphic, shape-driven foam that expands and dissolves.
// ═══════════════════════════════════════════════════════════════════════════

const FoamMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 1,
    uColor: new THREE.Color('#ffffff'), // Brighter white for that graphic look
    uSeed: 0,
  },
  // Vertex
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment
  `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uColor;
  uniform float uSeed;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.1, 31.7))) * 43758.5453);
  }

  float voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float m = 8.0;
    for(int j=-1; j<=1; j++)
    for(int i=-1; i<=1; i++) {
      vec2 g = vec2(float(i),float(j));
      vec2 o = vec2(hash(n + g), hash(n + g + 1.23));
      vec2 r = g - f + (0.5 + 0.5 * sin(vec2(uTime * 0.5 + uSeed) + 6.2831 * o));
      float d = dot(r, r);
      if(d < m) m = d;
    }
    return sqrt(m);
  }

  // Crescent / half-moon shape with dynamic parameters
  float sdCrescent(vec2 p, float r0, float r1, float d) {
    float a = dot(p,p);
    float b = dot(p-vec2(d,0),p-vec2(d,0));
    if (a < r0*r0 && b > r1*r1) return 1.0;
    return 0.0;
  }

  void main() {
    // 1. Distort UVs slightly for asymmetry based on seed
    float skew = (hash(vec2(uSeed, 0.0)) - 0.5) * 0.4;
    vec2 p = vUv * 2.0 - 1.0;
    p.x += p.y * skew; // slight tilt
    p.y *= 0.9 + hash(vec2(0.0, uSeed)) * 0.2; // slight squash
    
    // 2. Randomized crescent parameters
    float rOuter = 0.7 + hash(vec2(uSeed, 1.2)) * 0.25;
    float rInner = rOuter * (0.6 + hash(vec2(uSeed, 3.4)) * 0.3);
    float offset = 0.1 + hash(vec2(uSeed, 5.6)) * 0.5;
    
    // Pick center or side variant
    float shapeMask = sdCrescent(p * 1.3, rOuter, rInner, offset);

    // 3. Shred with noise
    float noiseScale = 3.0 + mod(uSeed, 3.0);
    float detailScale = 5.0 + mod(uSeed * 0.7, 4.0);
    
    float v1 = 1.0 - voronoi(p * noiseScale + uSeed);
    float v2 = 1.0 - voronoi(p * detailScale - uTime * 0.25 + uSeed * 2.0);
    float noise = v1 * v2;
    
    float threshold = 0.12 + 0.12 * sin(uSeed * 1.5);
    float shredded = smoothstep(threshold, threshold + 0.25, noise);
    
    float shape = shapeMask * shredded;
    
    if (shape < 0.01) discard;
    
    gl_FragColor = vec4(uColor, shape * uOpacity);
  }
  `
);

extend({ FoamMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    foamMaterial: { ref?: React.Ref<InstanceType<typeof FoamMaterial>> } & Record<string, unknown>;
  }
}

const FOAM_COUNT = 150;      
const FOAM_LIFESPAN = 1.2;  
const SPAWN_INTERVAL = 0.03; 

interface FoamBurst {
  spawnTime: number;
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  rotation: number;
  spin: number;
  seed: number;
}

interface StylizedFoamProps {
  boatPos: React.MutableRefObject<THREE.Vector2>;
  boatSpeed: React.MutableRefObject<number>;
  boatYaw: React.MutableRefObject<number>;
}

export default function StylizedFoam({ boatPos, boatSpeed, boatYaw }: StylizedFoamProps) {
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const bursts = useRef<FoamBurst[]>(
    Array.from({ length: FOAM_COUNT }, () => ({
      spawnTime: -99,
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      scale: 1,
      rotation: 0,
      spin: 0,
      seed: 0,
    }))
  );
  const lastSpawn = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = boatSpeed.current;
    const yaw = boatYaw.current;
    
    // Frequency increases with speed
    const spawnThreshold = SPAWN_INTERVAL / (0.4 + speed * 2.5);
    
    if (speed > 0.05 && t - lastSpawn.current > spawnThreshold) {
      const idx = bursts.current.findIndex((b) => !b.active);
      if (idx !== -1) {
        bursts.current[idx].spawnTime = t;
        bursts.current[idx].active = true;
        
        // --- Spawning Logic focused around the boat hull ---
        // Pick a point along the hull: Bow (front), Sides, or Stern (back)
        const rand = Math.random();
        let hullX = 0;
        let hullZ = 0;
        
        if (rand > 0.7) {
            // Stern / Back wake - spread out
            hullX = (Math.random() - 0.5) * 1.5;
            hullZ = 1.4;
        } else if (rand > 0.3) {
            // Bow / Front spray
            hullX = (Math.random() - 0.5) * 0.8;
            hullZ = -1.4;
        } else {
            // Sides
            hullX = (Math.random() > 0.5 ? 0.75 : -0.75) * (0.8 + Math.random() * 0.4);
            hullZ = (Math.random() - 0.5) * 2.0;
        }

        // Rotate hull position to world space based on boat yaw
        const sinY = Math.sin(yaw);
        const cosY = Math.cos(yaw);
        const worldX = hullX * cosY - hullZ * sinY;
        const worldZ = hullX * sinY + hullZ * cosY;

        bursts.current[idx].position.set(
          boatPos.current.x + worldX,
          0.1, // Slightly higher to avoid flat z-fighting
          boatPos.current.y + worldZ
        );
        
        // Outward velocity from the boat's center
        const dirX = worldX * (1.5 + Math.random() * 2.0);
        const dirZ = worldZ * (1.5 + Math.random() * 2.0);
        bursts.current[idx].velocity.set(dirX, 0, dirZ);
        
        // Scale: 1/3 of boat width (1.5 / 3 = 0.5)
        bursts.current[idx].scale = 0.45 + Math.random() * 0.15;
        bursts.current[idx].rotation = Math.random() * Math.PI * 2;
        bursts.current[idx].spin = (Math.random() - 0.5) * 3.0;
        bursts.current[idx].seed = Math.random() * 100.0;
        
        lastSpawn.current = t;
      }
    }

    // Animate particles
    for (let i = 0; i < FOAM_COUNT; i++) {
        const b = bursts.current[i];
        const mesh = meshesRef.current[i];
        if (!mesh || !b.active) continue;

        const age = t - b.spawnTime;
        const p = age / FOAM_LIFESPAN;

        if (p >= 1.0) {
            b.active = false;
            mesh.visible = false;
            continue;
        }

        // Apply drift and spin
        b.position.addScaledVector(b.velocity, delta);
        // Slowly friction out the velocity
        b.velocity.multiplyScalar(0.95);
        b.rotation += b.spin * delta;

        // Graphic Pop scaling
        const s = b.scale * (1.0 + Math.sin(p * Math.PI) * 0.3);
        mesh.scale.set(s, s, s);
        mesh.position.copy(b.position);
        mesh.rotation.z = b.rotation;
        
        const mat = mesh.material as InstanceType<typeof FoamMaterial>;
        // Sharp fade-out at the end
        mat.uOpacity = p < 0.7 ? 0.9 : (1.0 - p) * 3.0;
        mat.uTime = t;
        mat.uSeed = b.seed;
        mesh.visible = true;
    }
  });

  return (
    <>
      {Array.from({ length: FOAM_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (meshesRef.current[i] = el)}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
          renderOrder={1}
        >
          <planeGeometry args={[1, 1]} />
          <foamMaterial transparent depthWrite={false} depthTest={true} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}




