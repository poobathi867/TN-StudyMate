import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({ position, color, speed, scale, geometry }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  if (geometry === 'torus') {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef} position={position} scale={scale}>
          <torusGeometry args={[1, 0.4, 16, 32]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.8} 
            wireframe 
          />
        </mesh>
      </Float>
    );
  }

  if (geometry === 'icosahedron') {
    return (
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={meshRef} position={position} scale={scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.8} 
            wireframe 
          />
        </mesh>
      </Float>
    );
  }

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef();
  const count = 80;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00d4ff" transparent opacity={1} sizeAttenuation />
    </points>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#7c3aed" />

      <FloatingShape position={[-4, 2, -3]} color="#00d4ff" speed={0.5} scale={0.8} geometry="torus" />
      <FloatingShape position={[4, -1, -4]} color="#7c3aed" speed={0.4} scale={0.6} geometry="icosahedron" />
      <FloatingShape position={[-2, -2, -2]} color="#10b981" speed={0.3} scale={0.5} geometry="sphere" />
      <FloatingShape position={[3, 3, -5]} color="#f59e0b" speed={0.6} scale={0.4} geometry="torus" />
      <FloatingShape position={[0, -3, -3]} color="#ec4899" speed={0.35} scale={0.7} geometry="icosahedron" />

      <Particles />
    </Canvas>
  );
}
