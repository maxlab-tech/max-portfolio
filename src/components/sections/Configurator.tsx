"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

// Only load ConfiguratorCanvas on client-side to avoid SSG hydration errors
const ConfiguratorCanvas = dynamic(
  () =>
    import("@/components/three/ConfiguratorCanvas").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="aspect-square rounded-2xl glass border border-border/50" /> }
);

interface ConfigOption {
  id: string;
  label: string;
  value: string;
  preview: string;
}

const MATERIALS: ConfigOption[] = [
  { id: "matte", label: "Matte", value: "matte", preview: "#1a1a2e" },
  { id: "gloss", label: "Gloss", value: "gloss", preview: "#2a2a4e" },
  { id: "metallic", label: "Metallic", value: "metallic", preview: "#3a3a6e" },
  { id: "glass", label: "Glass", value: "glass", preview: "#4a4a8e" },
  { id: "ceramic", label: "Ceramic", value: "ceramic", preview: "#5a5aae" },
];

const COLORS: ConfigOption[] = [
  { id: "emerald", label: "Emerald", value: "#00d4aa", preview: "#00d4aa" },
  { id: "violet", label: "Violet", value: "#8b5cf6", preview: "#8b5cf6" },
  { id: "amber", label: "Amber", value: "#f59e0b", preview: "#f59e0b" },
  { id: "rose", label: "Rose", value: "#ef4444", preview: "#ef4444" },
  { id: "cyan", label: "Cyan", value: "#06b6d4", preview: "#06b6d4" },
  { id: "slate", label: "Slate", value: "#64748b", preview: "#64748b" },
];

const GEOMETRIES: ConfigOption[] = [
  { id: "icosahedron", label: "Icosahedron", value: "icosahedron", preview: "20 faces" },
  { id: "dodecahedron", label: "Dodecahedron", value: "dodecahedron", preview: "12 faces" },
  { id: "octahedron", label: "Octahedron", value: "octahedron", preview: "8 faces" },
  { id: "torus", label: "Torus", value: "torus", preview: "Ring" },
  { id: "torusKnot", label: "Torus Knot", value: "torusKnot", preview: "Knot" },
];

export default function Configurator() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [material, setMaterial] = useState("matte");
  const [color, setColor] = useState("#00d4aa");
  const [geometry, setGeometry] = useState("icosahedron");
  const [isInteracting, setIsInteracting] = useState(false);

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

      // Stagger in controls
      gsap.fromTo(
        ".config-panel",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: canvasRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Price counter animation
      ScrollTrigger.create({
        trigger: canvasRef.current,
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1,
        onUpdate: (self) => {
          const priceEl = document.querySelector(".price-counter");
          if (priceEl) {
            const basePrice = 3500;
            const materialMultiplier = material === "glass" ? 1.3 : material === "metallic" ? 1.2 : 1;
            const geometryMultiplier = geometry === "torusKnot" ? 1.15 : 1;
            const price = Math.round(basePrice * materialMultiplier * geometryMultiplier);
            priceEl.textContent = `$${price.toLocaleString()}`;
          }
        },
      });
    }, canvasRef);

    return () => ctx.revert();
  }, [material, geometry]);

  const handleCanvasPointerDown = () => setIsInteracting(true);
  const handleCanvasPointerUp = () => setIsInteracting(false);
  const handleCanvasPointerLeave = () => setIsInteracting(false);

  return (
    <section
      ref={canvasRef}
      id="configurator"
      className="relative w-full min-h-[100vh] bg-background py-20 md:py-32"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Live Demo
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Product <span className="gradient-text">Configurator</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real-time 3D customization — materials, colors, geometries. Instant price calc. Embed anywhere.
            This is a working demo of what we ship for clients.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
          {/* 3D Viewport */}
          <ConfiguratorCanvas
            material={material}
            color={color}
            geometry={geometry}
            onPointerDown={handleCanvasPointerDown}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={handleCanvasPointerLeave}
          />

          {/* Controls Panel */}
          <div className="space-y-8">
            {/* Material */}
            <ConfigPanel
              title="Material"
              options={MATERIALS}
              selected={material}
              onSelect={setMaterial}
              renderOption={(opt) => (
                <div
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    material === opt.id
                      ? "border-accent scale-110 shadow-lg"
                      : "border-border/50 hover:border-accent/50"
                  }`}
                  style={{ background: opt.preview }}
                  title={opt.label}
                />
              )}
            />

            {/* Color */}
            <ConfigPanel
              title="Color"
              options={COLORS}
              selected={color}
              onSelect={setColor}
              renderOption={(opt) => (
                <div
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    color === opt.value
                      ? "border-accent scale-110 shadow-lg"
                      : "border-border/50 hover:border-accent/50"
                  }`}
                  style={{ background: opt.value }}
                  title={opt.label}
                />
              )}
            />

            {/* Geometry */}
            <ConfigPanel
              title="Geometry"
              options={GEOMETRIES}
              selected={geometry}
              onSelect={setGeometry}
              renderOption={(opt) => (
                <button
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                    geometry === opt.id
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-card border-border/50 text-foreground hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.preview}</span>
                  </div>
                </button>
              )}
            />

            {/* Price Summary */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estimated Project</span>
                <span className="text-3xl font-bold gradient-text price-counter">$3,500</span>
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                Includes: 3D model, 3 materials, 6 colors, interactions, embed code
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl glass border border-border/50">
                  <div className="text-xl font-bold text-accent">10–14</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="p-3 rounded-xl glass border border-border/50">
                  <div className="text-xl font-bold text-accent">2</div>
                  <div className="text-xs text-muted-foreground">Revisions</div>
                </div>
                <div className="p-3 rounded-xl glass border border-border/50">
                  <div className="text-xl font-bold text-accent">100%</div>
                  <div className="text-xs text-muted-foreground">Ownership</div>
                </div>
              </div>
              <button className="w-full mt-6 px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:opacity-90 transition-opacity">
                Start This Project
              </button>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2">
              {["React", "Three.js", "GSAP", "TypeScript", "Tailwind", "Vite"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full glass border border-border/50 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConfigPanel({
  title,
  options,
  selected,
  onSelect,
  renderOption,
}: {
  title: string;
  options: ConfigOption[];
  selected: string;
  onSelect: (value: string) => void;
  renderOption: (opt: ConfigOption) => React.ReactNode;
}) {
  return (
    <div className="config-panel glass rounded-2xl p-6 border border-border/50">
      <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="cursor-pointer"
          >
            {renderOption(opt)}
          </div>
        ))}
      </div>
    </div>
  );
}