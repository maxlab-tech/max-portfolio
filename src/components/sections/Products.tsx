"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RefractiveCrystalShowcase from "./RefractiveCrystalShowcase";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  period: string;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
  specs: { label: string; val: string }[];
  deliverables: string;
  actionText: string;
}

const products: Product[] = [
  {
    id: "free-component",
    name: "3D Holographic Card",
    tagline: "Free Open-Source Micro Component",
    price: "$0",
    period: "Free forever • MIT License",
    badge: "COMMUNITY STARTER • LIVE PREVIEW",
    description:
      "Interactive 3D crystal tilt with dynamic pointer specular shine, GLSL chromatic aberration at optical bias edges, and buttery 60 FPS physics.",
    features: [
      "PBR MeshPhysicalMaterial with IOR 1.45 transmission",
      "onBeforeCompile GLSL chromatic dispersion hooks",
      "Adaptive degradation guard (PBR to MatCap to CSS Glass)",
      "Zero layout shift and locked 60 FPS performance",
      "MIT License: use in commercial or personal apps",
    ],
    specs: [
      { label: "Transmission", val: "0.5x Scale" },
      { label: "Target", val: "React / Next.js" },
      { label: "FPS", val: "60-120 FPS" },
      { label: "Latency", val: "< 10ms GPU" },
    ],
    deliverables: "GitHub Repo & Code Snippet",
    actionText: "Get Free Component",
  },
  {
    id: "webgl-pack",
    name: "3D WebGL & Shader Pack",
    tagline: "Production Drop-in Modules for Next.js",
    price: "$29",
    originalPrice: "$49",
    period: "One-time payment • Lifetime updates",
    badge: "MOST POPULAR • 10+ MODULES",
    popular: true,
    description:
      "Stop wrestling with canvas performance. 10+ production-grade Three.js components and GLSL shaders built specifically for high-conversion tech landing pages.",
    features: [
      "10+ Drop-in Three.js & GLSL components",
      "Holographic Glass Card with chromatic rim light",
      "GPU Particle Wave reactive to cursor & touch",
      "Neural AI Connectivity Graph with node clustering",
      "Dark Matter Ambient Shader Sphere",
      "Audio-reactive frequency spectrum mesh",
      "Full TypeScript types, Tailwind v4 tokens & docs",
      "Automatic reduced-motion and mobile fallback",
    ],
    specs: [
      { label: "Components", val: "10+ Ready Modules" },
      { label: "Performance", val: "60–120 FPS Guaranteed" },
      { label: "License", val: "Unlimited Commercial" },
      { label: "Framework", val: "Next.js 15/16 + Tailwind" },
    ],
    deliverables: "Instant Private GitHub Repo + ZIP + Storybook",
    actionText: "Get Instant Access ($29)",
  },
  {
    id: "agent-template",
    name: "Autonomous Agent Starter",
    tagline: "Production Next.js 16 + 3D Portfolio Kit",
    price: "$39",
    originalPrice: "$69",
    period: "One-time payment • Commercial License",
    badge: "FULL-STACK TEMPLATE",
    description:
      "The complete production architecture powering MaxLab Tech. Pre-configured with Next.js 16, GSAP scroll orchestration, Three.js hero, and async brief pipeline.",
    features: [
      "Complete Next.js 16 App Router architecture",
      "Interactive 3D WebGL hero & configurator engine",
      "GSAP smooth scroll triggers & entrance timelines",
      "Live Autonomous Telemetry / Activity log widget",
      "100% Async spec & project intake pipeline",
      "100/100 Core Web Vitals & Sub-2.0s LCP",
      "GitHub Actions CI/CD for automated Pages deployment",
    ],
    specs: [
      { label: "Tech Stack", val: "Next.js 16 + R3F + GSAP" },
      { label: "Lighthouse", val: "100 / 100 Vitals" },
      { label: "Setup Time", val: "< 5 Minutes" },
      { label: "License", val: "Commercial Multi-Project" },
    ],
    deliverables: "GitHub Template Repo + Setup Walkthrough",
    actionText: "Get Starter Template ($39)",
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedFree, setCopiedFree] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAction = (product: Product) => {
    if (product.id === "free-component") {
      navigator.clipboard.writeText(
        "https://github.com/maxlab-tech/max-portfolio"
      );
      setCopiedFree(true);
      setTimeout(() => setCopiedFree(false), 3000);
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section ref={sectionRef} id="products" className="relative py-32 md:py-48 px-6 bg-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Digital Products & Vault
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Drop-in 3D WebGL <span className="gradient-text">Modules & Starters</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Copy-paste production 3D components and GLSL shaders built for Next.js & Tailwind.
            Zero canvas boilerplate, guaranteed 60–120 FPS, and sub-50KB bundle footprint.
          </p>
        </div>

        {/* Live Interactive 3D Refractive Crystal Showcase */}
        <RefractiveCrystalShowcase />

        {/* Product Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card relative glass rounded-2xl p-8 md:p-10 border transition-all duration-500 flex flex-col justify-between ${
                product.popular
                  ? "border-accent/60 shadow-[0_0_50px_rgba(0,212,170,0.15)] ring-1 ring-accent/30"
                  : "border-border/50 hover:border-accent/30"
              }`}
            >
              {product.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider ${
                    product.popular
                      ? "bg-accent text-background shadow-lg shadow-accent/25"
                      : "bg-card border border-border/80 text-muted-foreground"
                  }`}
                >
                  {product.badge}
                </div>
              )}

              <div>
                <div className="mb-6 pt-2">
                  <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                  <p className="text-accent font-medium text-sm">{product.tagline}</p>
                </div>

                <div className="mb-6 pb-6 border-b border-border/40">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold gradient-text">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg line-through text-muted-foreground">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{product.period}</div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs Pill Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-card/60 border border-border/40 text-center"
                    >
                      <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                        {spec.label}
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">{spec.val}</div>
                    </div>
                  ))}
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                    Included Features
                  </div>
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <svg
                        className="w-4 h-4 text-accent shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-border/40">
                <button
                  onClick={() => handleAction(product)}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    product.popular
                      ? "bg-accent text-background font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20"
                      : "glass border border-border/60 hover:border-accent/50 text-foreground"
                  }`}
                >
                  {product.id === "free-component" && copiedFree ? (
                    <>
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Repository URL Copied!</span>
                    </>
                  ) : (
                    <span>{product.actionText}</span>
                  )}
                </button>
                <div className="text-center mt-2.5 text-[11px] text-muted-foreground">
                  {product.deliverables}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Guarantee Banner */}
        <div className="glass rounded-2xl p-8 border border-border/50 grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-sm mb-1">Sub-50KB Overhead</div>
            <p className="text-xs text-muted-foreground">Tree-shaken GLSL shaders, zero heavy render baggage.</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🏎️</div>
            <div className="font-semibold text-sm mb-1">60–120 FPS Audited</div>
            <p className="text-xs text-muted-foreground">GPU-instanced geometries with reduced-motion fallback.</p>
          </div>
          <div>
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold text-sm mb-1">Copy-Paste Ready</div>
            <p className="text-xs text-muted-foreground">Pre-typed TypeScript files ready for your Next.js project.</p>
          </div>
          <div>
            <div className="text-2xl mb-2">💼</div>
            <div className="font-semibold text-sm mb-1">Commercial License</div>
            <p className="text-xs text-muted-foreground">Build unlimited client projects with zero attribution.</p>
          </div>
        </div>
      </div>

      {/* Checkout / Pre-Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative glass border border-accent/40 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2"
            >
              ✕
            </button>

            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-mono font-medium mb-3 inline-block">
              INSTANT ORDER & PRE-ORDER
            </span>

            <h3 className="text-2xl font-bold mb-1">{selectedProduct.name}</h3>
            <p className="text-sm text-accent font-medium mb-4">{selectedProduct.tagline}</p>

            <div className="p-4 rounded-xl bg-card/60 border border-border/50 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Total Investment:</span>
                <span className="text-2xl font-bold gradient-text">{selectedProduct.price}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                One-time purchase • Includes full source code, private repo invite & lifetime updates.
              </p>
            </div>

            <div className="space-y-4 mb-6 text-sm">
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 text-xs text-muted-foreground leading-relaxed">
                ℹ️ <strong className="text-foreground">Payment Gateway Status:</strong> Our Lemon Squeezy merchant
                account is completing compliance review. In the meantime, instant checkout is supported via PayPal,
                Wise, or direct invoice with immediate delivery.
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:maxlab.studio@agentmail.to?subject=${encodeURIComponent(
                  `[Order] ${selectedProduct.name} (${selectedProduct.price})`
                )}&body=${encodeURIComponent(
                  `Hi Max,\n\nI'd like to get instant access to ${selectedProduct.name} for ${selectedProduct.price}.\n\nPlease send the direct payment link (PayPal / Wise / Stripe invoice).\n\nMy GitHub Username for repo invite: `
                )}`}
                className="w-full py-3.5 px-6 rounded-xl bg-accent text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Request Instant Invoice / Direct Checkout
              </a>

              <a
                href="https://t.me/mabedth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl glass border border-border/60 hover:border-accent/40 text-foreground font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Direct Chat via Telegram (@mabedth)</span>
              </a>
            </div>

            <p className="text-center text-[11px] text-muted-foreground mt-4">
              Instant GitHub invitation sent within 10 minutes of confirmation.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
