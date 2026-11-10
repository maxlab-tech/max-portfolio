"use client";

import { useFrame, useThree, extend } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { DisplacementShaderMaterial } from "./DisplacementShaderMaterial";

// Register shaderMaterial with R3F
extend({ DisplacementShaderMaterial });

// Add custom JSX element type
declare module "@react-three/fiber" {
  interface ThreeElements {
    displacementShaderMaterial: any;
  }
}

interface DisplacementSceneProps {
  renderMode: number; // 0 = Metallic, 1 = Normal Inspection, 2 = Iridescent Rim
  wireframe: boolean;
  noiseFreq: number;
  noiseAmp: number;
  isHovered: boolean;
}

export function DisplacementScene({
  renderMode,
  wireframe,
  noiseFreq,
  noiseAmp,
  isHovered,
}: DisplacementSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const { pointer } = useThree();

  // Smooth lerped pointer position
  const targetPointer = useRef(new THREE.Vector2(0, 0));
  const currentPointer = useRef(new THREE.Vector2(0, 0));

  // High subdivision geometry for smooth vertex displacement (128x128 sphere)
  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(1.35, 128, 128),
    []
  );

  // Outer orbital accent ring
  const ringGeometry = useMemo(
    () => new THREE.TorusGeometry(2.1, 0.015, 16, 120),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x00d4aa,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Synchronize dynamic uniforms from props
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uRenderMode = renderMode;
      materialRef.current.uNoiseFreq = noiseFreq;
      materialRef.current.uNoiseAmp = noiseAmp;
      materialRef.current.wireframe = wireframe;
    }
  }, [renderMode, noiseFreq, noiseAmp, wireframe]);

  useFrame((state, delta) => {
    // 1. Uniform time update
    if (materialRef.current) {
      materialRef.current.uTime += delta;

      // 2. Smooth pointer damping (lerp)
      if (isHovered) {
        targetPointer.current.set(pointer.x * 1.5, pointer.y * 1.5);
      } else {
        // Return to resting center position when unhovered
        targetPointer.current.set(0, 0);
      }

      currentPointer.current.lerp(targetPointer.current, delta * 4.5);
      materialRef.current.uPointer.copy(currentPointer.current);
    }

    // 3. Gentle baseline rotational drift
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Primary Displaced Mesh with Analytical Normals */}
      <mesh ref={meshRef} geometry={sphereGeometry}>
        <displacementShaderMaterial
          ref={materialRef}
          uNoiseFreq={noiseFreq}
          uNoiseAmp={noiseAmp}
          uRenderMode={renderMode}
          wireframe={wireframe}
          transparent={renderMode === 2}
        />
      </mesh>

      {/* Outer Gyro Ring */}
      <mesh
        geometry={ringGeometry}
        material={ringMaterial}
        rotation={[Math.PI / 3, Math.PI / 6, 0]}
      />
    </group>
  );
}
