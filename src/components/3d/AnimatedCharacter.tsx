import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedCharacterProps {
  modelPath: string;
  currentAnimation?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  modelPath,
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions || names.length === 0) return;

    // Pick requested animation or fallback to first available
    const animToPlay = actions[currentAnimation] ? currentAnimation : names[0];
    const action = actions[animToPlay];

    if (action) {
      action.reset().fadeIn(0.4).play();
    }

    return () => {
      if (action) {
        action.fadeOut(0.4);
      }
    };
  }, [actions, currentAnimation, names]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={scene} />
    </group>
  );
};
