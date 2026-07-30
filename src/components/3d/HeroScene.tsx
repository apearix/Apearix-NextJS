'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={1} castShadow />
        
        <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
          <Sphere args={[1.3, 64, 64]} position={[0, -0.2, 0]}>
            <MeshDistortMaterial
              color="#6D28F5"
              speed={2.2}
              distort={0.35}
              radius={1}
              metalness={0.75}
              roughness={0.25}
            />
          </Sphere>
        </Float>

        <Particles count={35} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

function Particles({ count }: { count: number }) {
  const mesh = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;
      temp.set([x, y, z], i * 3);
    }
    return temp;
  }, [count]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.04;
      mesh.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#8B5CF6"
        transparent
        opacity={0.18}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

