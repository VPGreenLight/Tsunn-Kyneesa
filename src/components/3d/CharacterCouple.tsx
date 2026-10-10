import React, { Suspense } from 'react';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { AnimatedBoyAvatar } from './AnimatedBoyAvatar';
import { AnimatedCharacter } from './AnimatedCharacter';

// 3D Glowing Heart between the couple
const SweetHeart: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 0.22
}) => {
  const heartShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06
  };

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={position} scale={scale} rotation={[Math.PI, 0, 0]}>
        <mesh position={[-0.5, -1, 0]}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#ff5e8e"
            emissive="#ff2a6d"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

interface CharacterCoupleProps {
  girlAnimation?: string;
}

export const CharacterCouple: React.FC<CharacterCoupleProps> = ({
  girlAnimation = 'idle'
}) => {
  return (
    <group position={[0, -0.15, 0]}>
      <Suspense fallback={null}>
        {/* Nhân vật nam: Avatar hiện đại, chuyển động thở & cử động tự nhiên (không còn mũ thám tử & T-pose) */}
        <AnimatedBoyAvatar
          position={[-0.38, -1.6, 0.05]}
          rotation={[0, 0.32, 0]}
          scale={[0.88, 0.88, 0.88]}
        />

        {/* Nhân vật nữ: Animated Cute Girl với moveset hoạt họa sống động (idle, happy, walk) */}
        <AnimatedCharacter
          modelPath="/models/cute_girl.glb"
          currentAnimation={girlAnimation}
          position={[0.38, -1.6, 0]}
          rotation={[0, -0.32, 0]}
          scale={[0.9, 0.9, 0.9]}
        />

        {/* Trái tim hồng tinh tế lơ lửng phía trên cao */}
        <SweetHeart position={[0, 0.7, 0.1]} scale={0.22} />
      </Suspense>
    </group>
  );
};
