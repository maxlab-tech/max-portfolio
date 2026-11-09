"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { attachCrystalHook, createCrystalUniforms } from "./dispersionHook";
import { getCrystalTextures } from "./crystalTextures";
import {
  FpsGuard,
  getCrystalEnvironment,
  probeCapabilities,
} from "./perfGuard";
import { TiltController } from "./tiltController";

export interface CrystalFacetSceneProps {
  onDegrade?: (tier: "matcap" | "css") => void;
  /** Force a degradation tier (useful for testing or external overrides). */
  forceTier?: "crystal" | "matcap" | "css";
}

export function CrystalFacetScene({ onDegrade, forceTier }: CrystalFacetSceneProps) {
  const { gl, scene, camera } = useThree();
  const [tier, setTier] = useState<"crystal" | "matcap" | "css">(forceTier ?? "crystal");

  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shardsRef = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightsGroupRef = useRef<THREE.Group>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  const tiltRef = useRef<TiltController | null>(null);
  const uniforms = useMemo(() => createCrystalUniforms(), []);
  const shardCount = 28;

  // Sync forced tier
  useEffect(() => {
    if (forceTier && forceTier !== tier) {
      setTier(forceTier);
    }
  }, [forceTier, tier]);

  // Apply downsampling and floating-target settings on mount
  useEffect(() => {
    // 0.5x render-target scale cuts the costly transmission pass fill-rate by 4x.
    (gl as unknown as { transmissionResolutionScale?: number }).transmissionResolutionScale = 0.5;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;

    // Prefiltered PMREM mipmapped roughness environment
    const envHandle = getCrystalEnvironment(gl);
    scene.environment = envHandle.texture;

    // Adaptive capability probe: if half-float render targets fail, hop to matcap.
    const caps = probeCapabilities();
    if (!caps || !caps.floatTargets) {
      setTier((current) => {
        if (current === "crystal") {
          onDegrade?.("matcap");
          return "matcap";
        }
        return current;
      });
    }

    const controller = new TiltController(6.5);
    controller.attachGyro();
    tiltRef.current = controller;

    return () => {
      controller.dispose();
      tiltRef.current = null;
      envHandle.dispose();
      scene.environment = null;
    };
  }, [gl, scene, onDegrade]);

  // FPS guard: if we sustain < 45 fps over two windows, degrade transparently.
  const fpsGuardRef = useRef<FpsGuard | null>(null);
  useEffect(() => {
    fpsGuardRef.current = new FpsGuard({
      minFps: 45,
      windowMs: 1800,
      minFrames: 24,
      warmupMs: 2000,
      onSlow: (measuredFps) => {
        setTier((current) => {
          if (current === "crystal") {
            FpsGuard.report(measuredFps, "matcap");
            onDegrade?.("matcap");
            return "matcap";
          }
          if (current === "matcap") {
            FpsGuard.report(measuredFps, "css");
            onDegrade?.("css");
            return "css";
          }
          return current;
        });
      },
    });
  }, [onDegrade]);

  // Geometries - cleanly faceted prism / diamond form
  const crystalGeo = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1.35, 1);
    // Scale vertically to give a standing prism aspect
    geo.scale(1.0, 1.35, 1.0);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const coreGeo = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(0.55, 0);
    geo.scale(0.8, 1.2, 0.8);
    return geo;
  }, []);

  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.9, 0.015, 16, 96), []);
  const shardGeo = useMemo(() => new THREE.TetrahedronGeometry(0.12, 0), []);

  // Physical glass material with IOR, transmission, dispersion, and GLSL hook
  const crystalMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dffffb"),
      roughness: 0.08,
      metalness: 0.0,
      transmission: 0.96,
      ior: 1.45,
      thickness: 1.8,
      dispersion: 0.075, // three.js built-in per-wavelength transmission ray spread
      attenuationColor: new THREE.Color("#00d4aa"),
      attenuationDistance: 2.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false, // critical for clean two-sided transmission
    });
    attachCrystalHook(mat, uniforms);
    return mat;
  }, [uniforms]);

  // Fallback matcap material (tier === "matcap")
  const matcapMaterial = useMemo(() => {
    const { matcap } = getCrystalTextures();
    return new THREE.MeshMatcapMaterial({
      matcap,
      color: new THREE.Color("#00d4aa"),
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
  }, []);

  // Inner floating core - emits an accent pulse that lights the prism from within
  const coreMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00d4aa"),
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#8b5cf6"),
        transparent: true,
        opacity: 0.45,
      }),
    []
  );

  const shardMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#8b5cf6"),
        roughness: 0.2,
        metalness: 0.4,
        transmission: 0.6,
        thickness: 0.3,
        ior: 1.33,
        transparent: true,
        opacity: 0.75,
      }),
    []
  );

  // Initialize orbiting shards
  useEffect(() => {
    if (!shardsRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < shardCount; i++) {
      const radius = 2.0 + (i % 5) * 0.25;
      const theta = (i / shardCount) * Math.PI * 2;
      const phi = 0.5 + ((i * 1.618) % 1.0) * (Math.PI - 1.0);
      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.7,
        radius * Math.sin(phi) * Math.sin(theta)
      );
      dummy.scale.setScalar(0.6 + (i % 4) * 0.2);
      dummy.updateMatrix();
      shardsRef.current.setMatrixAt(i, dummy.matrix);
      shardsRef.current.setColorAt(
        i,
        new THREE.Color().setHSL(0.5 + ((i % 6) / 6) * 0.35, 0.85, 0.65)
      );
    }
    shardsRef.current.instanceMatrix.needsUpdate = true;
    if (shardsRef.current.instanceColor) {
      shardsRef.current.instanceColor.needsUpdate = true;
    }
  }, [shardCount]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      crystalGeo.dispose();
      coreGeo.dispose();
      ringGeo.dispose();
      shardGeo.dispose();
      crystalMaterial.dispose();
      matcapMaterial.dispose();
      coreMaterial.dispose();
      ringMaterial.dispose();
      shardMaterial.dispose();
    };
  }, [
    crystalGeo,
    coreGeo,
    ringGeo,
    shardGeo,
    crystalMaterial,
    matcapMaterial,
    coreMaterial,
    ringMaterial,
    shardMaterial,
  ]);

  // Main frame loop
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const nowMs = state.clock.getElapsedTime() * 1000;
    fpsGuardRef.current?.sample(dt * 1000, nowMs);

    const controller = tiltRef.current;
    if (controller) {
      controller.update(dt);
      const { valueX, valueY } = controller.get();

      // Forward to shader uniforms for the GLSL rim dispersion
      uniforms.uTiltX.value = valueX;
      uniforms.uTiltY.value = valueY;

      // Pointer-driven inertial tilt applied to the crystal
      if (meshRef.current) {
        // Base spin + inertial tilt offset
        meshRef.current.rotation.y += dt * 0.45;
        // Target tilt pitch & roll smoothly blended
        const targetPitch = valueY * 0.45;
        const targetRoll = -valueX * 0.45;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetPitch, dt * 5.0);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRoll, dt * 5.0);
      }

      // Counter-rotate the inner wire core for parallax depth
      if (coreRef.current && meshRef.current) {
        coreRef.current.rotation.y -= dt * 0.7;
        coreRef.current.rotation.x = -meshRef.current.rotation.x * 0.6;
        coreRef.current.rotation.z = -meshRef.current.rotation.z * 0.6;
      }

      // Specular highlight responds to tilt: shift key light position
      if (keyLightRef.current) {
        keyLightRef.current.position.x = 3.5 + valueX * 2.2;
        keyLightRef.current.position.y = 4.0 - valueY * 2.0;
        keyLightRef.current.position.z = 3.0 + (valueX + valueY) * 0.8;
      }

      // Camera subtle perspective breath
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, valueX * 0.35, dt * 3.0);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -valueY * 0.25, dt * 3.0);
      camera.lookAt(0, 0, 0);
    }

    // Ring slow wobble
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.3 + Math.sin(nowMs * 0.001) * 0.08;
      ringRef.current.rotation.y += dt * 0.15;
    }

    // Orbiting shards animation
    if (shardsRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < shardCount; i++) {
        shardsRef.current.getMatrixAt(i, dummy.matrix);
        dummy.rotation.x += dt * (0.4 + (i % 3) * 0.2);
        dummy.rotation.y += dt * (0.3 + (i % 4) * 0.15);
        shardsRef.current.setMatrixAt(i, dummy.matrix);
      }
      shardsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const activeMaterial = tier === "matcap" ? matcapMaterial : crystalMaterial;

  return (
    <>
      <ambientLight intensity={0.5} />
      <group ref={lightsGroupRef}>
        <directionalLight
          ref={keyLightRef}
          position={[3.5, 4.0, 3.0]}
          intensity={1.6}
          color="#dffffb"
        />
        <directionalLight position={[-3.0, -1.0, -2.5]} intensity={0.9} color="#8b5cf6" />
        <pointLight position={[0, 0, 1.2]} intensity={0.6} color="#00d4aa" decay={2} />
      </group>

      {/* Main refractive crystal prism */}
      <mesh
        ref={meshRef}
        geometry={crystalGeo}
        material={activeMaterial}
        castShadow
        receiveShadow
      />

      {/* Inner glowing facets */}
      <mesh ref={coreRef} geometry={coreGeo} material={coreMaterial} />

      {/* Precision orbital ring */}
      <mesh ref={ringRef} geometry={ringGeo} material={ringMaterial} />

      {/* Dispersion shards that orbit the crystal */}
      <instancedMesh
        ref={shardsRef}
        args={[shardGeo, shardMaterial, shardCount]}
      />
    </>
  );
}
