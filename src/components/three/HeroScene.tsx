"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroScene() {
  const { camera } = useThree();
  const scrollProgressRef = useRef(0);
  const timeRef = useRef(0);
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const shardsRef = useRef<THREE.InstancedMesh>(null);
  const shardCount = 60;

  // Geometry & materials created once
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.2, 8), []);
  const wireGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.22, 8), []);
  
  const material = useMemo(() => 
    new THREE.MeshPhysicalMaterial({
      color: 0x00d4aa,
      metalness: 0.3,
      roughness: 0.4,
      transmission: 0.3,
      thickness: 0.5,
      transparent: true,
      opacity: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    }), []
  );

  const wireMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    }), []
  );

  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1.8, 0.02, 16, 100), []);
  const ringMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    }), []
  );

  // Particles
  const particleCount = 800;
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 2 + 0.5;
      alphas[i] = Math.random() * 0.6 + 0.2;
      offsets[i] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, []);

  const particleMaterial = useMemo(() =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        attribute float aOffset;
        attribute float aSpeed;
        varying float vAlpha;
        varying float vOffset;
        varying float vSpeed;
        void main() {
          vAlpha = aAlpha;
          vOffset = aOffset;
          vSpeed = aSpeed;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vOffset;
        varying float vSpeed;
        uniform float uTime;
        void main() {
          float dist = length(gl_PointCoord - 0.5);
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vAlpha;
          alpha *= 0.5 + 0.5 * sin(uTime * vSpeed + vOffset);
          gl_FragColor = vec4(0.0, 0.83, 0.67, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
    }), []
  );

  // Shards - instanced geometry for "living" fragments
  const shardGeometry = useMemo(() => new THREE.TetrahedronGeometry(0.15, 0), []);
  const shardMaterial = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      metalness: 0.6,
      roughness: 0.2,
      transmission: 0.5,
      thickness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0,
    }), []
  );

  // Initialize shards
  useEffect(() => {
    if (!shardsRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < shardCount; i++) {
      const radius = 2.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.setScalar(0.5 + Math.random() * 0.5);
      dummy.updateMatrix();
      shardsRef.current!.setMatrixAt(i, dummy.matrix);
      shardsRef.current!.setColorAt(i, new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.8, 0.6));
    }
    shardsRef.current.instanceMatrix.needsUpdate = true;
    if (shardsRef.current.instanceColor) {
      shardsRef.current.instanceColor.needsUpdate = true;
    }
  }, [shardCount]);

  // Scroll progress from parent
  useEffect(() => {
    const scrollContainer = document.getElementById("main-content");
    if (!scrollContainer) return;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Animation loop - proper useFrame signature
  useFrame((_state: unknown, delta: number) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const scroll = scrollProgressRef.current;

    // Main icosahedron
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15 + scroll * Math.PI * 2;
      meshRef.current.rotation.y = t * 0.1 + scroll * Math.PI;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05 + scroll * 0.3);
    }

    // Wireframe counter-rotation
    if (meshRef.current) {
      meshRef.current.children.forEach((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial && child.material.wireframe) {
          child.rotation.x = -t * 0.08;
          child.rotation.y = -t * 0.12;
        }
      });
    }

    // Ring
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + t * 0.05;
      ringRef.current.rotation.y = t * 0.03;
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = 0.4 * (1 - scroll * 0.5);
    }

    // Particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02;
      particlesRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      const uniforms = (particlesRef.current.material as THREE.ShaderMaterial).uniforms;
      uniforms.uTime.value = t;
      // Disperse on scroll
      const scale = 1 + scroll * 1.5;
      particlesRef.current.scale.setScalar(scale);
      const particleMat = particlesRef.current.material as THREE.ShaderMaterial;
      particleMat.uniforms.uTime.value = t;
      particleMat.opacity = 1 - scroll * 0.7;
    }

    // Shards - orbit and disperse
    if (shardsRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < shardCount; i++) {
        shardsRef.current.getMatrixAt(i, dummy.matrix);
        dummy.rotation.x += delta * (0.5 + (i % 3) * 0.3);
        dummy.rotation.y += delta * (0.3 + (i % 5) * 0.2);
        
        // Orbital motion
        const radius = 2.5 + Math.sin(t * 0.5 + i) * 0.5 + scroll * 1.5;
        const theta = t * 0.2 + i * 0.5;
        const phi = Math.PI / 2 + Math.sin(t * 0.3 + i) * 0.3;
        
        dummy.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta) + Math.sin(t + i) * 0.3,
          radius * Math.cos(phi)
        );
        dummy.updateMatrix();
        shardsRef.current.setMatrixAt(i, dummy.matrix);
      }
      shardsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Camera subtle movement
    camera.position.x = Math.sin(t * 0.1) * 0.3;
    camera.position.y = Math.cos(t * 0.08) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Key light */}
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#00d4aa" />
      <directionalLight position={[-3, 2, -3]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#00d4aa" decay={2} />
      
      {/* Main living geometry */}
      <group ref={meshRef}>
        <mesh geometry={geometry} material={material} castShadow receiveShadow />
        <mesh geometry={wireGeometry} material={wireMaterial} />
      </group>

      {/* Orbital ring */}
      <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} />

      {/* Particle field */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />

      {/* Living shards */}
      <instancedMesh
        ref={shardsRef}
        args={[shardGeometry, shardMaterial, shardCount]}
      />
    </>
  );
}