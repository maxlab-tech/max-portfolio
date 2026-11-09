"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TiltController } from "@/components/three/crystal/tiltController";

// Client-only dynamic import for the 3D Canvas
const RefractiveCrystalCanvas = dynamic(
  () => import("@/components/three/crystal/RefractiveCrystalCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-card/40 rounded-2xl border border-border/40">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground animate-pulse">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>Initializing WebGL2 Optical Pipeline...</span>
        </div>
      </div>
    ),
  }
);

export default function RefractiveCrystalShowcase() {
  const [selectedTier, setSelectedTier] = useState<"crystal" | "matcap" | "css">("crystal");
  const [activeTier, setActiveTier] = useState<"crystal" | "matcap" | "css">("crystal");
  const [gyroRequested, setGyroRequested] = useState(false);

  const handleGyroClick = async () => {
    const granted = await TiltController.requestGyroPermission();
    setGyroRequested(granted);
  };

  return (
    <div className="relative glass rounded-3xl border border-accent/40 p-6 md:p-10 mb-20 shadow-[0_0_60px_rgba(0,212,170,0.08)] overflow-hidden">
      {/* Background radial ambient glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      {/* Top Banner Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>INTERACTIVE 3D UPGRADE • MESHPHYSICALMATERIAL</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Refractive Crystal <span className="gradient-text">& Optical Dispersion</span>
          </h3>
          <p className="text-sm text-foreground/80 mt-1 max-w-2xl leading-relaxed">
            Physically-based transmission buffer with IOR 1.45, downsampled 0.5x render target scale,
            and custom onBeforeCompile GLSL chromatic dispersion hooks. Developed by Mabedth Digital Creation.
          </p>
        </div>

        {/* Fallback chain testing buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
            Fallback Chain:
          </span>
          <button
            onClick={() => {
              setSelectedTier("crystal");
              setActiveTier("crystal");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedTier === "crystal"
                ? "bg-accent text-background font-semibold shadow-md shadow-accent/20"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            PBR Refraction
          </button>
          <button
            onClick={() => {
              setSelectedTier("matcap");
              setActiveTier("matcap");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedTier === "matcap"
                ? "bg-amber-400 text-background font-semibold shadow-md shadow-amber-400/20"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            MatCap Mode
          </button>
          <button
            onClick={() => {
              setSelectedTier("css");
              setActiveTier("css");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedTier === "css"
                ? "bg-blue-400 text-background font-semibold shadow-md shadow-blue-400/20"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            CSS Glass
          </button>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center pt-8">
        {/* Interactive 3D Canvas Container with High-Contrast Typography BEHIND Glass */}
        <div className="lg:col-span-7 relative min-h-[380px] md:min-h-[440px] rounded-2xl bg-[#07070d] border border-border/60 overflow-hidden group">
          {/* Typography BEHIND the 3D crystal: WCAG AA contrast (> 18:1 against #07070d) */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#00d4aa] font-bold block uppercase">
                  MABEDTH DIGITAL CREATION
                </span>
                <span className="text-3xl md:text-4xl font-extrabold text-[#ffffff] tracking-tight block mt-1 drop-shadow-md">
                  OPTICAL DISPERSION
                </span>
              </div>
              <span className="text-xs font-mono text-[#cbd5e1] border border-white/20 px-2 py-1 rounded bg-black/40">
                IOR 1.45
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-[#f1f5f9] tracking-wider uppercase">
                PHYSICALLY-BASED TRANSMISSION BUFFER • 0.5X FBO SCALE
              </div>
              <div className="text-[11px] font-mono text-[#94a3b8]">
                MOVE CURSOR OR TILT DEVICE TO TEST INERTIAL PARALLAX & CHROMATIC RIM
              </div>
            </div>
          </div>

          {/* 3D Canvas with Real Refraction overlaid on top of the typography */}
          <div className="relative z-10 w-full h-full min-h-[380px] md:min-h-[440px]">
            <RefractiveCrystalCanvas
              key={selectedTier}
              onTierChange={setActiveTier}
            />
          </div>
        </div>

        {/* Technical Specs & Verification Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-card/60 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Active Optical Shader
              </span>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                  activeTier === "crystal"
                    ? "bg-accent/20 text-accent"
                    : activeTier === "matcap"
                    ? "bg-amber-400/20 text-amber-300"
                    : "bg-blue-400/20 text-blue-300"
                }`}
              >
                {activeTier === "crystal"
                  ? "PBR MeshPhysicalMaterial"
                  : activeTier === "matcap"
                  ? "Sphere MatCap Texture"
                  : "CSS backdrop-filter"}
              </span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Chromatic dispersion and Fresnel edge bias are injected via{" "}
              <code className="text-accent text-[11px] font-mono">onBeforeCompile</code> GLSL hooks,
              preserving Three.js native transmission buffer and mipmapped roughness caching.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-card/40 border border-border/40">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Index of Refraction</div>
              <div className="text-lg font-bold text-foreground mt-0.5 font-mono">1.45 IOR</div>
              <div className="text-[10px] text-accent mt-0.5">Crown glass optical ratio</div>
            </div>
            <div className="p-3 rounded-lg bg-card/40 border border-border/40">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">FBO Resolution Scale</div>
              <div className="text-lg font-bold text-foreground mt-0.5 font-mono">0.5x Scale</div>
              <div className="text-[10px] text-accent mt-0.5">4x transmission fill-rate saving</div>
            </div>
            <div className="p-3 rounded-lg bg-card/40 border border-border/40">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">GPU Frame Time</div>
              <div className="text-lg font-bold text-foreground mt-0.5 font-mono">&lt; 10ms</div>
              <div className="text-[10px] text-accent mt-0.5">Locked 60 FPS target</div>
            </div>
            <div className="p-3 rounded-lg bg-card/40 border border-border/40">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Adaptive Guard</div>
              <div className="text-lg font-bold text-foreground mt-0.5 font-mono">45 FPS Floor</div>
              <div className="text-[10px] text-accent mt-0.5">Transparent fallback trigger</div>
            </div>
          </div>

          {/* Inertial Tilt & Mobile Gyroscope */}
          <div className="p-4 rounded-xl bg-card/60 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Inertial Tilt & Gyroscope</span>
              <button
                onClick={handleGyroClick}
                className="text-[11px] font-mono px-2 py-1 rounded bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
              >
                {gyroRequested ? "Gyroscope Active" : "Enable Gyroscope (Mobile)"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pointer coordinates on desktop and DeviceOrientation gamma/beta on mobile are smoothed with
              a critically damped spring lerp, dynamically steering specular highlights and transmission angles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
