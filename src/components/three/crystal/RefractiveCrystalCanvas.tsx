"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasErrorBoundary } from "../CanvasErrorBoundary";
import { CrystalFacetScene } from "./CrystalFacetScene";
import { probeCapabilities } from "./perfGuard";

export interface RefractiveCrystalCanvasProps {
  className?: string;
  onTierChange?: (tier: "crystal" | "matcap" | "css") => void;
}

/**
 * Refractive crystal / glassmorphic 3D showcase canvas.
 *
 * Implements a transparent 3-stage degradation chain:
 *   Stage 1: Physically-based transmission MeshPhysicalMaterial (IOR 1.45,
 *            dispersion 0.075, 0.5x transmission render-target scale,
 *            prefiltered PMREM mipmapped roughness caching, onBeforeCompile
 *            Fresnel dispersion hook).
 *   Stage 2: Sphere-shaded MatCap material with baked chromatic edges (used
 *            when half-float render targets unsupported or FPS < 45).
 *   Stage 3: Pure CSS backdrop-filter glass card with SVG prism facets and
 *            radial chromatic rim gradients (used when WebGL2 is absent or
 *            WebGL crashes / context is lost).
 *
 * All state switches happen silently with zero console errors.
 */
export default function RefractiveCrystalCanvas({
  className = "",
  onTierChange,
}: RefractiveCrystalCanvasProps) {
  const [tier, setTier] = useState<"crystal" | "matcap" | "css">("crystal");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Probe capabilities on client mount before firing up the WebGL canvas
  useEffect(() => {
    setMounted(true);
    const caps = probeCapabilities();
    if (!caps || !caps.webgl2) {
      setTier("css");
      onTierChange?.("css");
      return;
    }
    if (!caps.floatTargets) {
      setTier("matcap");
      onTierChange?.("matcap");
      return;
    }
  }, [onTierChange]);

  const handleDegrade = useCallback(
    (newTier: "matcap" | "css") => {
      setTier(newTier);
      onTierChange?.(newTier);
    },
    [onTierChange]
  );

  // CSS backdrop-filter fallback card with interactive mouse tilt
  if (!mounted || tier === "css") {
    return <CssBackdropPrism className={className} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[360px] overflow-hidden select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      <CanvasErrorBoundary
        fallback={
          <CssBackdropPrism
            className={className}
            reason="Canvas recovered gracefully with CSS glassmorphism."
          />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            depth: true,
            stencil: false,
            preserveDrawingBuffer: false,
          }}
          dpr={[1, 1.5]}
          style={{ touchAction: "none", width: "100%", height: "100%" }}
        >
          <CrystalFacetScene onDegrade={handleDegrade} forceTier={tier} />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Subtle indicator pill showing current render tier */}
      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border/60 text-[10px] font-mono text-muted-foreground/80">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            tier === "crystal"
              ? "bg-accent animate-pulse"
              : tier === "matcap"
              ? "bg-amber-400"
              : "bg-blue-400"
          }`}
        />
        <span>
          {tier === "crystal"
            ? "GLSL PBR Refraction"
            : tier === "matcap"
            ? "MatCap Optimized"
            : "CSS Backdrop Glass"}
        </span>
      </div>
    </div>
  );
}

/** Pure CSS backdrop-filter glass fallback matching the 3D prism aesthetic. */
function CssBackdropPrism({
  className = "",
  reason,
}: {
  className?: string;
  reason?: string;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: nx * 12, y: -ny * 12 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      onPointerMove={handlePointer}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full min-h-[360px] flex items-center justify-center p-6 ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-64 h-80 rounded-3xl p-6 border border-white/20 transition-transform duration-200 ease-out shadow-2xl overflow-hidden flex flex-col justify-between"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 212, 170, 0.08) 50%, rgba(139, 92, 246, 0.12) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 212, 170, 0.4)",
        }}
      >
        {/* Chromatic rim glow */}
        <div
          className="absolute -top-16 -left-16 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,212,170,0.6) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Facet polygon outline */}
        <div className="relative flex items-center justify-center h-44">
          <svg viewBox="0 0 120 140" className="w-28 h-32 opacity-85">
            <polygon
              points="60,10 110,45 60,130 10,45"
              fill="rgba(0, 212, 170, 0.12)"
              stroke="#00d4aa"
              strokeWidth="1.5"
            />
            <polygon
              points="60,10 110,45 60,75 10,45"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1"
            />
            <line x1="60" y1="10" x2="60" y2="130" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
            <line x1="10" y1="45" x2="110" y2="45" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 text-center">
          <div className="text-xs uppercase tracking-widest font-mono text-accent mb-1">
            MDC Refractive Prism
          </div>
          <p className="text-[11px] text-foreground/80 leading-snug">
            {reason || "CSS backdrop-filter glass fallback with chromatic edge styling."}
          </p>
        </div>
      </div>
    </div>
  );
}
