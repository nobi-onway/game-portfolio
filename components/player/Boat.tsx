'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const MOVE_SPEED = 8;
const REVERSE_SPEED = 4;
const TURN_SPEED = 2.0;
const CAMERA_HEIGHT = 9;
const CAMERA_DIST = 14;
const CAMERA_LERP = 0.06;

interface BoatProps {
  boatPos: React.MutableRefObject<THREE.Vector2>;
  boatSpeed: React.MutableRefObject<number>;
  boatTurn: React.MutableRefObject<number>;
  boatYaw: React.MutableRefObject<number>;
}


export default function Boat({ boatPos, boatSpeed, boatTurn, boatYaw }: BoatProps) {


  const rbRef = useRef<RapierRigidBody>(null);
  const [, getKeys] = useKeyboardControls();

  // Smoothed yaw tracked separately so camera doesn't jitter off physics frame
  const smoothYaw = useRef(0);

  useFrame((state, delta) => {
    if (!rbRef.current) return;

    const { forward, back, left, right } = getKeys();

    // ---- Rotation ----
    const rot = rbRef.current.rotation();
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const currentYaw = new THREE.Euler().setFromQuaternion(quat, 'YXZ').y;

    let newYaw = currentYaw;
    if (left)  newYaw += TURN_SPEED * delta;
    if (right) newYaw -= TURN_SPEED * delta;

    if (left || right) {
      const targetQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, newYaw, 0, 'YXZ')
      );
      rbRef.current.setRotation(
        { x: targetQuat.x, y: targetQuat.y, z: targetQuat.z, w: targetQuat.w },
        true
      );
    }

    // ---- Translation (velocity-based — immediate and controllable) ----
    const forwardDir = new THREE.Vector3(-Math.sin(newYaw), 0, -Math.cos(newYaw));
    const currentVel = rbRef.current.linvel();

    let vx = 0;
    let vz = 0;

    if (forward) {
      vx = forwardDir.x * MOVE_SPEED;
      vz = forwardDir.z * MOVE_SPEED;
    } else if (back) {
      vx = -forwardDir.x * REVERSE_SPEED;
      vz = -forwardDir.z * REVERSE_SPEED;
    } else {
      // Natural drag when no input — lerp velocity to zero
      vx = currentVel.x * 0.85;
      vz = currentVel.z * 0.85;
    }

    // Keep Y velocity intact so physics gravity and bobbing still work
    rbRef.current.setLinvel({ x: vx, y: currentVel.y, z: vz }, true);

    // ── Boat position in world space (needed for camera AND water shader) ──
    const pos = rbRef.current.translation();

    // ── Write shared refs for water shader ──
    const speed = Math.sqrt(vx * vx + vz * vz);
    boatPos.current.set(pos.x, pos.z);
    boatSpeed.current = THREE.MathUtils.lerp(boatSpeed.current, speed / MOVE_SPEED, 0.1);
    boatYaw.current = newYaw;
    
    // Track turn rate
    const turnRate = left ? 1 : (right ? -1 : 0);
    boatTurn.current = THREE.MathUtils.lerp(boatTurn.current, turnRate, 0.1);


    // ---- Smooth yaw for camera (avoids physics jitter) ----
    smoothYaw.current = THREE.MathUtils.lerp(smoothYaw.current, newYaw, 0.12);

    // ---- Camera follow ----

    const camOffset = new THREE.Vector3(
      Math.sin(smoothYaw.current) * CAMERA_DIST,
      CAMERA_HEIGHT,
      Math.cos(smoothYaw.current) * CAMERA_DIST
    );
    const targetPos = new THREE.Vector3(
      pos.x + camOffset.x,
      pos.y + camOffset.y,
      pos.z + camOffset.z
    );

    state.camera.position.lerp(targetPos, CAMERA_LERP);
    state.camera.lookAt(pos.x, pos.y + 0.5, pos.z);
  });

  return (
    <RigidBody
      ref={rbRef}
      colliders="cuboid"
      linearDamping={0.5}
      angularDamping={5}
      lockRotations        // prevent physics from tipping the boat
      position={[0, 0.8, 0]}
    >
      {/* Hull */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.6, 3]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      {/* Cabin */}
      <mesh castShadow position={[0, 0.65, -0.3]}>
        <boxGeometry args={[0.9, 0.7, 1.2]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      {/* Mast */}
      <mesh castShadow position={[0, 1.2, 0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Direction indicator (front) */}
      <mesh position={[0, 0.1, -1.4]}>
        <coneGeometry args={[0.2, 0.5, 6]} />
        <meshStandardMaterial color="#cc4422" emissive="#cc2200" emissiveIntensity={0.4} />
      </mesh>
    </RigidBody>
  );
}
