"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { DisplacementCanvasProps } from "@/components/three/displacement/DisplacementCanvas";

// Client-only dynamic import for the 3D Canvas
const DisplacementCanvas = dynamic<DisplacementCanvasProps>(
  () => import("@/components/three/displacement/DisplacementCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-card/40 rounded-2xl border border-border/40">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground animate-pulse">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>Compiling Analytical Normal GLSL Shader Pipeline...</span>
        </div>
      </div>
    ),
  }
);

export default function DisplacementShowcase() {
  const [renderMode, setRenderMode] = useState<number>(0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [preset, setPreset] = useState<"fluid" | "organic" | "quantum">("organic");
  const [showCode, setShowCode] = useState<boolean>(false);

  // Preset parameters
  const presets = {
    fluid: { freq: 0.8, amp: 0.22, label: "Fluid Ripple" },
    organic: { freq: 1.35, amp: 0.3, label: "Organic Biosphere" },
    quantum: { freq: 2.6, amp: 0.16, label: "Quantum Resonance" },
  };

  const currentParams = presets[preset];

  return (
    <div className="relative glass rounded-3xl border border-accent/40 p-6 md:p-10 mb-20 shadow-[0_0_60px_rgba(0,212,170,0.08)] overflow-hidden">
      {/* Background ambient radial gradients */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />

      {/* Top Banner Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>MODULE PREVIEW • 3D WEBGL & SHADER PACK ($29)</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Procedural Displacement <span className="gradient-text">& Analytical Normals</span>
          </h3>
          <p className="text-sm text-foreground/80 mt-1 max-w-2xl leading-relaxed">
            Eliminates faceted lighting on procedural meshes. Recomputes exact surface normal vectors
            in GLSL via finite-difference tangent cross products: <code className="text-accent font-mono text-xs">N = normalize(cross(vT, vB))</code>.
          </p>
        </div>

        {/* Mode controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
            Shader View:
          </span>
          <button
            onClick={() => setRenderMode(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              renderMode === 0
                ? "bg-accent text-background font-semibold shadow-md shadow-accent/20"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            PBR Metallic
          </button>
          <button
            onClick={() => setRenderMode(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              renderMode === 1
                ? "bg-cyan-400 text-background font-semibold shadow-md shadow-cyan-400/20"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            Normal Vectors (RGB)
          </button>
          <button
            onClick={() => setRenderMode(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              renderMode === 2
                ? "bg-purple-400 text-background font-semibold shadow-md shadow-purple-400/20"
                : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            Iridescent Rim
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center pt-8">
        {/* 3D Canvas Viewport */}
        <div className="lg:col-span-7 relative min-h-[380px] md:min-h-[440px] rounded-2xl bg-[#05070d] border border-border/60 overflow-hidden group">
          {/* Subtle background tech coordinates */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none z-0">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-accent/80 block uppercase">
                  FINITE-DIFFERENCE NORMAL RECALCULATION
                </span>
                <span className="text-xl md:text-2xl font-bold text-white/90 tracking-tight block mt-0.5">
                  60 FPS GPU DERIVATIVE
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 border border-white/10 px-2 py-0.5 rounded bg-black/50">
                Δε = 0.005
              </span>
            </div>
            <div className="flex justify-between items-end text-[10px] font-mono text-zinc-500">
              <span>SIMD 128x128 GEOMETRY</span>
              <span className="text-accent/80 animate-pulse">MOVE CURSOR TO DISTURB</span>
            </div>
          </div>

          {/* Interactive R3F Canvas */}
          <div className="relative z-10 w-full h-full min-h-[380px] md:min-h-[440px]">
            <DisplacementCanvas
              renderMode={renderMode}
              wireframe={wireframe}
              noiseFreq={currentParams.freq}
              noiseAmp={currentParams.amp}
            />
          </div>
        </div>

        {/* Parameter & Inspection Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-medium">
              Real-Time Tuning Controls
            </span>
            <h4 className="text-xl font-bold mt-1">Procedural Harmonic Presets</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Toggle displacement harmonics or switch to wireframe mode to inspect the real-time vertex deformation.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {(["fluid", "organic", "quantum"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setPreset(key)}
                className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all text-center ${
                  preset === key
                    ? "border-accent bg-accent/15 text-accent font-semibold"
                    : "border-border/60 bg-card/50 text-muted-foreground hover:border-accent/40"
                }`}
              >
                {presets[key].label}
              </button>
            ))}
          </div>

          {/* Wireframe toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-card/60 border border-border/50">
            <div>
              <div className="text-xs font-semibold text-foreground">Wireframe Inspection</div>
              <div className="text-[11px] text-muted-foreground">Expose GPU vertex density (32,768 triangles)</div>
            </div>
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                wireframe
                  ? "bg-accent text-background font-semibold"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {wireframe ? "ON" : "OFF"}
            </button>
          </div>

          {/* Metrics Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-card/40 border border-border/40 text-center">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Frame Target</div>
              <div className="text-base font-bold text-accent mt-0.5">60–120 FPS</div>
              <div className="text-[10px] text-muted-foreground">Zero Main Thread Lag</div>
            </div>
            <div className="p-3 rounded-xl bg-card/40 border border-border/40 text-center">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Bundle Size</div>
              <div className="text-base font-bold text-foreground mt-0.5">&lt; 3.8 KB</div>
              <div className="text-[10px] text-muted-foreground">Pure GLSL Shaders</div>
            </div>
          </div>

          {/* Code toggle */}
          <div>
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1.5"
            >
              <span>{showCode ? "Hide Analytical GLSL Equation" : "View Analytical Normal GLSL Math"}</span>
              <span className="text-xs">→</span>
            </button>

            {showCode && (
              <pre className="mt-3 p-3.5 rounded-xl bg-black/70 border border-border/60 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`// Exact surface normal via finite difference cross product
vec3 t = getOrthogonal(normal);
vec3 b = normalize(cross(normal, t));
float eps = 0.005;

vec3 p0 = pos + normal * getDisp(pos);
vec3 pT = (pos + t*eps) + normal * getDisp(pos + t*eps);
vec3 pB = (pos + b*eps) + normal * getDisp(pos + b*eps);

vec3 vT = pT - p0;
vec3 vB = pB - p0;
vec3 analyticalNormal = normalize(cross(vT, vB));`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
