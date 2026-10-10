import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RomanticScene } from './RomanticScene';
import { useApp } from '../../context/AppContext';

interface Scene3DProps {
  interactive?: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({ interactive = true }) => {
  const { activeMoveset } = useApp();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: interactive ? 'auto' : 'none',
        background: 'radial-gradient(circle at 50% 75%, #23162f 0%, #140d1e 40%, #08060d 95%)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle organic light haze behind the characters */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(226, 115, 138, 0.12) 0%, rgba(253, 224, 71, 0.04) 40%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Canvas
        camera={{ position: [0, 0.3, 5.0], fov: 42 }}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.1 }}
      >
        <Suspense fallback={null}>
          <RomanticScene girlAnimation={activeMoveset} />
          {interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2 + 0.05}
              minPolarAngle={Math.PI / 2.8}
              rotateSpeed={0.4}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
