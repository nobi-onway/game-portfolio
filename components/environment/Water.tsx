'use client';

import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
//  ULTIMATE WATER SHADER
//
//  1. Dual scrolling noise maps to break texture repetition
//  2. Depth gradient  (world-distance  +  wave height)
//  3. Fake underwater depth via large-scale dark noise patches
//  4. Calm sine-based vertex offsets  (tiny amplitude)
//  5. Fresnel stylized edge highlight
//  6. Boat wake ripple rings (concentric frac-pattern from boat XZ)
//  7. Large-scale surface uniformity breaker  (huge slow noise tint)
//  Plus: analytic normals, caustics, specular, foam, edge fog
// ═══════════════════════════════════════════════════════════════════════════

const WaterMaterial = shaderMaterial(
  {
    uTime:         0,
    uBoatPos:      new THREE.Vector2(0, 0),
    uBoatSpeed:    0,
    uBoatTurn:     0,

    uShallowColor: new THREE.Color('#34c3d8'),  // vibrant teal
    uDeepColor:    new THREE.Color('#0a3a56'),  // deep ocean
    uFoamColor:    new THREE.Color('#e4f7fb'),  // soft white foam
    uSunDir:       new THREE.Vector3(0.6, 1.0, 0.5).normalize(),
    uSunColor:     new THREE.Color('#fff9e0'),
    uHorizonColor: new THREE.Color('#a8d8e8'),  // sky-matching edge
    uIslands:      [new THREE.Vector4(0, 0, 0, 0), new THREE.Vector4(0, 0, 0, 0), new THREE.Vector4(0, 0, 0, 0)],
  },

  // ── VERTEX SHADER ────────────────────────────────────────────────────────
  `
  uniform float uTime;

  varying vec3  vWorldPos;
  varying vec3  vNormal3D;
  varying float vWaveH;

  // Hash-based smooth 2D noise
  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float snoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash2(i), b = hash2(i+vec2(1,0)),
          c = hash2(i+vec2(0,1)), d = hash2(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }

  // Gerstner wave — returns (dx, dy, dz, dNx, dNz)
  vec3 gerstner(vec3 p, vec2 dir, float freq, float amp, float speed, float steep) {
    float phi   = dot(p.xz, normalize(dir)) * freq + uTime * speed;
    float s     = sin(phi), co  = cos(phi);
    float dx    = -normalize(dir).x * amp * steep * co;
    float dz    = -normalize(dir).y * amp * steep * co;
    return vec3(dx, amp * s, dz);
  }

  void main() {
    vec3 pos = position;

    // ① 3-layer Gerstner for organic surface shape
    vec3 w1 = gerstner(pos, vec2( 1.0,  0.7), 0.16, 0.25, 0.45, 0.75);
    vec3 w2 = gerstner(pos, vec2(-0.8,  1.0), 0.11, 0.16, 0.30, 0.65);
    vec3 w3 = gerstner(pos, vec2( 0.5, -0.9), 0.23, 0.09, 0.65, 0.85);
    // ④ Extra tiny calm sine offset to keep the sea breathing
    float calm = sin(pos.x * 0.08 + uTime * 0.25) * 0.03
               + sin(pos.y * 0.12 - uTime * 0.18) * 0.02;

    float totalH = w1.y + w2.y + w3.y + calm;
    pos.x += w1.x + w2.x + w3.x;
    pos.z += w1.z + w2.z + w3.z;
    pos.y += totalH;

    vWaveH = totalH;

    // Analytic normal (accumulated from Gerstner partials)
    vec3 N = normalize(vec3(
      -(w1.x + w2.x + w3.x),
      2.5,
      -(w1.z + w2.z + w3.z)
    ));

    vWorldPos  = (modelMatrix * vec4(pos, 1.0)).xyz;
    vNormal3D  = normalize(normalMatrix * N);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,

  // ── FRAGMENT SHADER ──────────────────────────────────────────────────────
  `
  uniform float uTime;
  uniform vec2  uBoatPos;
  uniform float uBoatSpeed;
  uniform float uBoatTurn;

  uniform vec3  uShallowColor;
  uniform vec3  uDeepColor;
  uniform vec3  uFoamColor;
  uniform vec3  uSunDir;
  uniform vec3  uSunColor;
  uniform vec3  uHorizonColor;
  uniform vec4  uIslands[3]; // x,z, radius, foamStrength

  varying vec3  vWorldPos;
  varying vec3  vNormal3D;
  varying float vWaveH;

  // ── Utility noise ──────────────────────────────────────────────────────
  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float snoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash2(i), b = hash2(i+vec2(1,0)),
          c = hash2(i+vec2(0,1)), d = hash2(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  // FBM: multiple octaves of noise for richness
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p  = p * 2.1 + vec2(3.7, 1.5);
      a *= 0.5;
    }
    return v;
  }

  // Cellular noise for stylized "hand-painted" foam shapes
  float voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float m = 8.0;
    for(int j=-1; j<=1; j++)
    for(int i=-1; i<=1; i++) {
      vec2 g = vec2(float(i),float(j));
      vec2 o = vec2(hash2(n + g), hash2(n + g + 1.23));
      vec2 r = g - f + (0.5 + 0.5 * sin(vec2(uTime) + 6.2831 * o));
      float d = dot(r, r);
      if(d < m) m = d;
    }
    return sqrt(m);
  }


  void main() {
    vec3 N = normalize(vNormal3D);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(uSunDir);
    vec3 H = normalize(L + V);

    vec2 wp = vWorldPos.xz;

    // ══ 1. DUAL SCROLLING NOISE MAPS (break repetition) ══════════════════
    // Map A – fast, small-scale, scrolls diagonally
    vec2 uvA = wp * 0.055 + uTime * vec2( 0.018,  0.009);
    // Map B – slower, larger-scale, opposite direction
    vec2 uvB = wp * 0.030 - uTime * vec2( 0.010,  0.020);

    float nA = snoise(uvA);       // 0..1
    float nB = snoise(uvB);       // 0..1
    // Combined distortion vector
    vec2 distort = (vec2(nA, nB) - 0.5) * 0.12;

    // ══ 2. DEPTH GRADIENT ════════════════════════════════════════════════
    float distFromOrigin = length(wp) * 0.013;
    float depthFactor    = clamp(distFromOrigin - vWaveH * 0.6, 0.0, 1.0);
    vec3  baseColor      = mix(uShallowColor, uDeepColor, depthFactor * 0.82);

    // ══ 3. FAKE UNDERWATER DEPTH — dark noise patches ════════════════════
    // Very large, very slow noise gives the illusion of deeper/shallower zones
    float underNoise = fbm(wp * 0.018 + vec2(uTime * 0.003));
    baseColor *= (0.80 + underNoise * 0.22);          // subtle darkening

    // ══ 7. SURFACE UNIFORMITY BREAKER — huge slow tint ═══════════════════
    float macroNoise = snoise(wp * 0.008 + vec2(uTime * 0.002));
    baseColor = mix(baseColor, baseColor * vec3(0.85, 1.05, 1.12),
                    macroNoise * 0.18);                // slight hue shift

    // Distorted UV lookup for detail (simulates 2nd scrolling noise layer)
    float surfaceDetail = snoise(wp * 0.06 + distort + vec2(uTime * 0.015));
    baseColor += uShallowColor * surfaceDetail * 0.06;

    // ══ Diffuse (keep ambient high — colour stays vivid) ═════════════════
    float diff    = max(dot(N, L), 0.0);
    vec3  diffuse = baseColor * (0.60 + diff * 0.40);

    // ══ 5. FRESNEL STYLIZED EDGE HIGHLIGHT ═══════════════════════════════
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.8);
    vec3  fresnelTint = mix(uShallowColor * 1.4, uSunColor * 0.4, 0.5);
    diffuse = mix(diffuse, fresnelTint, fresnel * 0.50);

    // ══ Caustic shimmer ══════════════════════════════════════════════════
    float caus = abs(sin(fbm(wp * 0.15 + vec2(uTime * 0.4)) * 6.28)) * 0.10;
    diffuse += uShallowColor * caus;

    // ══ Specular sun glint ════════════════════════════════════════════════
    float spec    = pow(max(dot(N, H), 0.0), 256.0);
    vec3  specular = uSunColor * spec * 1.3;

    vec3 col = diffuse + specular;

    // ══ Wave crest foam ═══════════════════════════════════════════════════
    float crestFoam = smoothstep(0.30, 0.55, vWaveH);
    col = mix(col, uFoamColor, crestFoam * 0.55);

    // ══ Island foam rings ═════════════════════════════════════════════════
    for (int i = 0; i < 3; i++) {
        float iDist = length(wp - uIslands[i].xz);
        float islandFoam = smoothstep(uIslands[i].z + 2.5, uIslands[i].z, iDist);

        // Use multi-layered cellular shapes for smaller, more random island foam
        float shape1 = 1.0 - voronoi(wp * 1.5 + vec2(uTime * 0.3));
        float shape2 = 1.0 - voronoi(wp * 3.2 - vec2(uTime * 0.5));
        float shape = smoothstep(0.4, 0.6, shape1 * shape2);
        
        col = mix(col, uFoamColor, islandFoam * shape * uIslands[i].w * 0.85);
    }

    // ══ Edge fog fade (horizon blend) ═════════════════════════════════════
    float fogDist   = length(wp);
    float fogFactor = clamp((fogDist - 55.0) / 65.0, 0.0, 1.0);
    fogFactor = fogFactor * fogFactor;                 // ease-in curve
    col = mix(col, uHorizonColor, fogFactor);

    float alpha = mix(0.97, 0.78, fogFactor);

    gl_FragColor = vec4(col, alpha);
  }
  `
);

extend({ WaterMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    waterMaterial: { ref?: React.Ref<InstanceType<typeof WaterMaterial>> } & Record<string, unknown>;
  }
}

interface WaterProps {
  boatPos:   React.MutableRefObject<THREE.Vector2>;
  boatSpeed: React.MutableRefObject<number>;
  boatTurn:  React.MutableRefObject<number>;
  islands:   THREE.Vector4[];
}

export function WaterWithUniforms({ boatPos, boatSpeed, boatTurn, islands }: WaterProps) {
  const matRef = useRef<InstanceType<typeof WaterMaterial>>(null);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uTime      = state.clock.elapsedTime;
    matRef.current.uBoatPos   = boatPos.current;
    matRef.current.uBoatSpeed = boatSpeed.current;
    matRef.current.uBoatTurn  = boatTurn.current;
    matRef.current.uIslands   = islands;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
      <planeGeometry args={[200, 200, 96, 96]} />
      <waterMaterial
        ref={matRef}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
