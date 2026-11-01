"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";

interface ConfiguratorSceneProps {
  material: string;
  color: string;
  geometry: string;
}

export function ConfiguratorScene({ material, color, geometry }: ConfiguratorSceneProps) {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Create geometry based on selection
  const geo = useMemo(() => {
    switch (geometry) {
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1.2, 1);
      case "octahedron":
        return new THREE.OctahedronGeometry(1.2, 1);
      case "torus":
        return new THREE.TorusGeometry(0.9, 0.35, 16, 64);
      case "torusKnot":
        return new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16);
      default:
        return new THREE.IcosahedronGeometry(1.2, 2);
    }
  }, [geometry]);

  // Create material based on selection
  const mat = useMemo(() => {
    const baseColor = new THREE.Color(color);
    
    switch (material) {
      case "gloss":
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0.1,
          roughness: 0.05,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          transmission: 0.1,
          thickness: 0.3,
        });
      case "metallic":
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0.9,
          roughness: 0.15,
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
        });
      case "glass":
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0,
          roughness: 0,
          transmission: 0.95,
          thickness: 0.5,
          clearcoat: 1,
          clearcoatRoughness: 0,
          ior: 1.5,
          transparent: true,
          opacity: 0.9,
        });
      case "ceramic":
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0,
          roughness: 0.35,
          clearcoat: 0.8,
          clearcoatRoughness: 0.15,
          sheen: 0.5,
          sheenRoughness: 0.3,
        });
      default: // matte
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0,
          roughness: 0.8,
          clearcoat: 0,
        });
    }
  }, [material, color]);

  // Wireframe material
  const wireMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    }), []
  );

  // Environment map for reflections
  const envMap = useMemo(() => {
    const pmremGenerator = new THREE.PMREMGenerator(useThree().gl);
    const scene = new THREE.Scene();
    
    // Simple gradient environment
    const shader = {
      uniforms: {
        uTopColor: { value: new THREE.Color(0x0a0a1a) },
        uBottomColor: { value: new THREE.Color(0x1a1a3a) },
      },
      vertexShader: `
        varying vec3 vWorldDirection;
        void main() {
          vWorldDirection = normalize((modelMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        varying vec3 vWorldDirection;
        void main() {
          float gradient = vWorldDirection.y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(uBottomColor, uTopColor, gradient), 1.0);
        }
      `,
    };
    
    const envGeometry = new THREE.BoxGeometry(10, 10, 10);
    const envMaterial = new THREE.ShaderMaterial({
      ...shader,
      side: THREE.BackSide,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(envGeometry, envMaterial));
    
    const renderTarget = pmremGenerator.fromScene(scene);
    pmremGenerator.dispose();
    return renderTarget.texture;
  }, []);

  // Apply env map to material
  useEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current.children[0] as THREE.Mesh;
      if (mesh?.material) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.envMap = envMap;
        mat.envMapIntensity = material === "glass" ? 1.5 : 1;
        mat.needsUpdate = true;
      }
    }
  }, [envMap, material]);

  // Mouse interaction handlers
  useEffect(() => {
    const canvas = useThree().gl.domElement;
    
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };
    
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;
      targetRotation.current.y -= deltaX * 0.01;
      targetRotation.current.x -= deltaY * 0.01;
      targetRotation.current.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotation.current.x));
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const onPointerUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.5, Math.min(8, camera.position.z + e.deltaY * 0.002));
    };
    
    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.style.cursor = "grab";

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, [camera]);

  // Animation loop
  useFrame((_, delta) => {
    timeRef.current += delta;
    
    // Smooth rotation interpolation
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;
    
    // Auto-rotate when not dragging
    if (!isDraggingRef.current) {
      targetRotation.current.y += delta * 0.15;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.x = currentRotation.current.x;
      meshRef.current.rotation.y = currentRotation.current.y;
      
      // Subtle floating
      meshRef.current.position.y = Math.sin(timeRef.current * 0.7) * 0.08;
      
      // Wireframe sync
      meshRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material?.wireframe) {
          child.rotation.x = meshRef.current!.rotation.x;
          child.rotation.y = meshRef.current!.rotation.y;
          child.position.y = meshRef.current!.position.y;
        }
      });
    }

    // Camera subtle orbit
    camera.position.x = Math.sin(timeRef.current * 0.05) * 0.15;
    camera.position.y = Math.cos(timeRef.current * 0.03) * 0.1;
    camera.lookAt(0, 0, 0);
  });

  // Lights
  const lights = useMemo(() => [
    <ambientLight key="ambient" intensity={0.5} />,
    <directionalLight key="key" position={[3, 5, 3]} intensity={1.5} color="#ffffff" />,
    <directionalLight key="fill" position={[-3, 2, -3]} intensity={0.8} color="#8b5cf6" />,
    <pointLight key="rim" position={[0, 0, 4]} intensity={0.6} color="#00d4aa" decay={2} />,
    <pointLight key="bottom" position={[0, -3, 0]} intensity={0.3} color="#00d4aa" decay={2} />,
  ], []);

  return (
    <>
      {lights}
      <group ref={meshRef}>
        <mesh geometry={geo} material={mat} castShadow receiveShadow />
        <mesh geometry={geo} material={wireMaterial} />
      </group>
      
      {/* Ground reflection plane */}
      <mesh
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.08}
          color="#00d4aa"
          metalness={0}
          roughness={0.9}
        />
      </mesh>
    </>
  );
}