"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";
import { CanvasErrorBoundary } from "../CanvasErrorBoundary";
import { DisplacementScene } from "./DisplacementScene";

export interface DisplacementCanvasProps {
  className?: string;
  renderMode?: number;
  wireframe?: boolean;
  noiseFreq?: number;
  noiseAmp?: number;
}

export default function DisplacementCanvas({
  className = "",
  renderMode = 0,
  wireframe = false,
  noiseFreq = 1.2,
  noiseAmp = 0.28,
}: DisplacementCanvasProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full min-h-[360px] overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      <CanvasErrorBoundary
        fallback={
          <div className="w-full h-full min-h-[360px] flex items-center justify-center bg-card/60 rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              WebGL context unavailable. Enable hardware acceleration to preview interactive 3D shader.
            </p>
          </div>
        }
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 5, 4]} intensity={1.2} />
          <pointLight position={[-4, -3, 2]} color="#8b5cf6" intensity={2.0} />

          <DisplacementScene
            renderMode={renderMode}
            wireframe={wireframe}
            noiseFreq={noiseFreq}
            noiseAmp={noiseAmp}
            isHovered={isHovered}
          />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
