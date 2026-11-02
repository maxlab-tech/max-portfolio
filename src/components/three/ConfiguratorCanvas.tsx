"use client";

import { Canvas } from "@react-three/fiber";
import { ConfiguratorScene } from "./ConfiguratorScene";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Filter out upstream THREE.Clock deprecation warning if triggered by R3F
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const msg = args[0];
    if (
      typeof msg === "string" &&
      (msg.includes("THREE.Clock: This module has been deprecated") ||
        msg.includes("THREE.Clock"))
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

gsap.registerPlugin(ScrollTrigger);

interface ConfiguratorCanvasProps {
  material: string;
  color: string;
  geometry: string;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
}

export default function ConfiguratorCanvas({
  material,
  color,
  geometry,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
}: ConfiguratorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        canvasRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: canvasRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, canvasRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="relative group"
    >
      <div
        className="aspect-square rounded-2xl glass border border-border/50 overflow-hidden relative"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
            style={{ width: "100%", height: "100%", touchAction: "none" }}
          >
            <ConfiguratorScene
              material={material}
              color={color}
              geometry={geometry}
            />
          </Canvas>
        </CanvasErrorBoundary>

        {/* Interaction hint */}
        <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border-border/50 text-xs sm:text-sm text-muted-foreground max-w-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-spin flex-shrink-0">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
            </svg>
            <span className="truncate">Drag to rotate • Scroll to zoom • Right-click to pan</span>
          </div>
        </div>

        {/* Wireframe toggle (positioned top-left to avoid colliding with Live Preview badge on top-right) */}
        <div className="absolute top-4 left-4 pointer-events-auto z-10">
          <label htmlFor="configurator-wireframe-toggle" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/50 text-xs sm:text-sm text-foreground cursor-pointer hover:border-accent/50 transition-colors">
            <input
              id="configurator-wireframe-toggle"
              type="checkbox"
              aria-label="Toggle Wireframe mode"
              className="w-4 h-4 accent-accent"
            />
            <span>Wireframe</span>
          </label>
        </div>
      </div>

      {/* Live badge (kept securely within container bounds to prevent overflow) */}
      <div className="absolute top-4 right-4 pointer-events-none z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Preview
        </div>
      </div>
    </div>
  );
}