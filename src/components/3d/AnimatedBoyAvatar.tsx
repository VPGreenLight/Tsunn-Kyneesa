import React, { useEffect, useRef } from 'react';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedBoyAvatarProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const AnimatedBoyAvatar: React.FC<AnimatedBoyAvatarProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.95, 0.95, 0.95]
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/avatar_sample.glb');
  const { animations: standingFbAnimations } = useFBX('/animations/Standing_Idle.fbx');

  const animClip = React.useMemo(() => {
    if (standingFbAnimations && standingFbAnimations.length > 0) {
      const clip = standingFbAnimations[0].clone();
      clip.name = 'Standing';
      return [clip];
    }
    return [];
  }, [standingFbAnimations]);

  const { actions } = useAnimations(animClip, group);

  useEffect(() => {
    if (actions && actions['Standing']) {
      actions['Standing'].reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={scene} />
    </group>
  );
};
