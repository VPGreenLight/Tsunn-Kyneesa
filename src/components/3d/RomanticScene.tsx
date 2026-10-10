import React from 'react';
import { Stars, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterCouple } from './CharacterCouple';

interface RomanticSceneProps {
  girlAnimation?: string;
}

// Đảo đá bồng bềnh dưới ánh trăng
const MoonlightIsland: React.FC = () => {
  return (
    <group position={[0, -1.8, 0]}>
      {/* Khối nền đảo đá mềm */}
      <mesh receiveShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[2.0, 1.3, 0.4, 32]} />
        <meshStandardMaterial
          color="#141120"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Vành sáng hào quang ánh trăng & nến */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.95, 2.15, 64]} />
        <meshBasicMaterial
          color="#ffd166"
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export const RomanticScene: React.FC<RomanticSceneProps> = ({
  girlAnimation = 'idle'
}) => {
  return (
    <>
      {/* Ánh sáng ấm áp chuẩn Cinematic Romance */}
      <ambientLight intensity={0.7} color="#ede9fe" />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#fff1f2" />
      
      {/* Đèn vàng ấm chiếu từ phía trước */}
      <pointLight position={[0, 0.5, 2.5]} intensity={2.5} color="#fde047" distance={8} decay={2} />
      
      {/* Đèn viền ánh trăng bạc & tím mơ từ phía sau */}
      <pointLight position={[-3, 3, -3]} intensity={2.0} color="#c084fc" distance={10} decay={2} />
      <pointLight position={[3, 2, -2]} intensity={1.8} color="#f472b6" distance={10} decay={2} />

      {/* Bầu trời đêm ngàn sao dịu nhẹ */}
      <Stars radius={100} depth={60} count={2800} factor={3.5} saturation={0} fade speed={0.8} />

      {/* Đom đóm & bụi vàng lơ lửng trong không gian */}
      <Sparkles count={55} scale={8} size={2.8} speed={0.35} color="#fde047" opacity={0.7} />
      <Sparkles count={40} scale={6} size={2.2} speed={0.25} color="#f472b6" opacity={0.6} />

      {/* Cặp đôi nhân vật 3D trên đảo nổi bồng bềnh */}
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.4}>
        <MoonlightIsland />
        <CharacterCouple girlAnimation={girlAnimation} />
      </Float>
    </>
  );
};
