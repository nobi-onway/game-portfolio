'use client';

import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// FISH SILHOUETTE
// Procedural SDF fish shape drawn per-sprite — no textures needed.
// Several instances drift lazily under the water surface.
// ─────────────────────────────────────────────────────────────────────────────

const FishMaterial = shaderMaterial(
  { uTime: 0, uOffset: 0, uColor: new THREE.Color('#0a3a55') },
  // Vertex
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment — SDF fish silhouette
  `
  uniform float uTime;
  uniform float uOffset;
  uniform vec3  uColor;
  varying vec2  vUv;

  float sdEllipse(vec2 p, vec2 ab) {
    p = abs(p);
    if (p.x > p.y) { p = p.yx; ab = ab.yx; }
    float l = ab.y * ab.y - ab.x * ab.x;
    float m = ab.x * p.x / l;
    float m2 = m * m;
    float n = ab.y * p.y / l;
    float n2 = n * n;
    float c = (m2 + n2 - 1.0) / 3.0;
    float c3 = c * c * c;
    float q = c3 + m2 * n2 * 2.0;
    float d = c3 + m2 * n2;
    float g = m + m * n2;
    float co;
    if (d < 0.0) {
      float h = acos(q / c3) / 3.0;
      float s = cos(h);
      float t = sin(h) * sqrt(3.0);
      float rx = sqrt(-c * (s + t + 2.0) + m2);
      float ry = sqrt(-c * (s - t + 2.0) + m2);
      co = (ry + sign(l) * rx + abs(g) / (rx * ry) - m) / 2.0;
    } else {
      float h = 2.0 * m * n * sqrt(d);
      float s = sign(q + h) * pow(abs(q + h), 1.0/3.0);
      float tt = sign(q - h) * pow(abs(q - h), 1.0/3.0);
      float rx = -(s + tt) - c * 4.0 + 2.0 * m2;
      float ry = (s - tt) * sqrt(3.0);
      float rm = sqrt(rx * rx + ry * ry);
      co = (ry / sqrt(rm - rx) + 2.0 * g / rm - m) / 2.0;
    }
    vec2 r = ab * vec2(co, sqrt(1.0 - co * co));
    return length(r - p) * sign(p.y - r.y);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0; // -1..1

    // Animate a gentle swimming wiggle per fish
    float wiggle = sin(uTime * 1.8 + uOffset) * 0.06;
    uv.y += wiggle * abs(uv.x);

    // Body — squashed ellipse
    float body = sdEllipse(uv, vec2(0.5, 0.28));

    // Tail — triangle on the right
    vec2 tp = vec2(uv.x - 0.55, uv.y);
    float tail = length(tp) - 0.25 + abs(tp.x) * 0.6;

    float d = min(body, tail);

    float alpha = 1.0 - smoothstep(-0.02, 0.02, d);
    if (alpha < 0.05) discard;

    // Fade toward tail
    float depthFade = 0.3 + 0.7 * (1.0 - smoothstep(-0.5, 0.5, uv.x));
    gl_FragColor = vec4(uColor, alpha * depthFade * 0.55);
  }
  `
);

extend({ FishMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    fishMaterial: { ref?: React.Ref<InstanceType<typeof FishMaterial>> } & Record<string, unknown>;
  }
}


interface FishProps {
  position: [number, number, number];
  offset: number;
  scale?: number;
}

function FishSprite({ position, offset, scale = 1 }: FishProps) {
  const matRef = useRef<InstanceType<typeof FishMaterial>>(null);
  const groupRef = useRef<THREE.Group>(null);
  const basePos = new THREE.Vector3(...position);

  useFrame((state) => {
    if (!matRef.current || !groupRef.current) return;
    matRef.current.uTime = state.clock.elapsedTime;
    const t = state.clock.elapsedTime * 0.3 + offset;
    // Lazy oval drift path
    groupRef.current.position.set(
      basePos.x + Math.sin(t) * 4,
      basePos.y,
      basePos.z + Math.cos(t * 0.7) * 3
    );
    // Face direction of travel
    groupRef.current.rotation.y = -Math.atan2(
      Math.cos(t) * 4,
      Math.sin(t * 0.7) * 3
    );
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[scale * 2, scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <fishMaterial
          ref={matRef}
          uOffset={offset}
          uColor={new THREE.Color('#0a3a55')}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function FishSchool() {
  const schoolData: Array<{ pos: [number, number, number]; offset: number; scale: number }> = [
    { pos: [-5, -1.2, -8],  offset: 0.0,  scale: 0.7 },
    { pos: [-6, -1.4, -9],  offset: 1.1,  scale: 0.5 },
    { pos: [-4, -1.3, -7],  offset: 2.3,  scale: 0.6 },
    { pos: [12, -1.2, 6],   offset: 3.5,  scale: 0.8 },
    { pos: [13, -1.5, 5],   offset: 4.7,  scale: 0.55 },
    { pos: [-2, -1.1, 14],  offset: 5.9,  scale: 0.65 },
    { pos: [-3, -1.3, 13],  offset: 7.2,  scale: 0.5 },
  ];

  return (
    <>
      {schoolData.map((f, i) => (
        <FishSprite key={i} position={f.pos} offset={f.offset} scale={f.scale} />
      ))}
    </>
  );
}
