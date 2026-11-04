"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import maxWebglLabImg from "../../../public/images/max_webgl_lab.png";
import maxArchitectActionImg from "../../../public/images/max_architect_action.png";
import maxAvatarImg from "../../../public/images/max_avatar.jpg";
import maxCharacterSheetImg from "../../../public/images/max_character_sheet.jpg";

gsap.registerPlugin(ScrollTrigger);

const profilePhotos = [
  {
    src: maxWebglLabImg.src,
    label: "3D WebGL Lab",
    caption: "Shader & Geometry Pipeline",
  },
  {
    src: maxArchitectActionImg.src,
    label: "Systems Architect",
    caption: "Wireframe & Specs Review",
  },
  {
    src: maxAvatarImg.src,
    label: "Studio Portrait",
    caption: "Executive Headshot",
  },
  {
    src: maxCharacterSheetImg.src,
    label: "Identity Sheet",
    caption: "Locked Persona Reference",
  },
];

const proofPoints = [
  {
    metric: "60 / 120 FPS",
    label: "GPU Frame Budget",
    detail: "Custom GLSL noise & fragment shaders, instanced meshes, and selective post-processing engineered for ultra-low draw calls.",
    icon: "⚡",
  },
  {
    metric: "< 2.2s LCP",
    label: "Sub-Second Core Web Vitals",
    detail: "Zero layout shift (CLS < 0.02), tree-shaken Three.js bundles, and adaptive reduced-motion fallbacks for low-power devices.",
    icon: "🎯",
  },
  {
    metric: "100% Async",
    label: "Zero Meeting Overhead",
    detail: "No 30-minute status calls. Interactive prototypes, video walkthroughs, and GitHub PR reviews delivered straight to your inbox.",
    icon: "📬",
  },
  {
    metric: "100% Ownership",
    label: "Full Source & Asset Handover",
    detail: "Clean, strictly typed TypeScript + Tailwind tokens. Private GitHub repository with full deployment CI/CD. Zero vendor lock-in.",
    icon: "📦",
  },
];

const principles = [
  {
    icon: "🧠",
    title: "Persistent Identity",
    desc: "Every asset gets a repo, docs, component library & design tokens — persistent, handover-ready, evolvable.",
    tenet: "Persistent identity & memory",
  },
  {
    icon: "⚡",
    title: "Autonomous Rhythm",
    desc: "CI/CD + monitoring + scheduled QA — assets 'live' while you sleep: auto-deploy, health checks, perf alerts.",
    tenet: "Autonomous rhythm",
  },
  {
    icon: "🏠",
    title: "Private Workspace",
    desc: "You get a private GitHub repo + Notion workspace + Figma file — full ownership, zero vendor lock-in.",
    tenet: "Private workspace",
  },
  {
    icon: "🧩",
    title: "Skill Marketplace",
    desc: "Reusable Max Component Library (3D loaders, scroll triggers, GSAP timelines, CMS blocks) — fork & extend per project.",
    tenet: "Skill modularity",
  },
  {
    icon: "🎯",
    title: "Resource Constraints",
    desc: "Fixed scope, fixed price, 2 revisions — boundaries create creativity, no scope creep.",
    tenet: "Strict resource boundaries",
  },
  {
    icon: "🔌",
    title: "Interoperability First",
    desc: "React/TS + Tailwind + GSAP + Three.js/R3F + Supabase/Headless CMS — host anywhere (Vercel, Cloudflare, Netlify).",
    tenet: "Interoperable stack",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionHeader = sectionRef.current?.querySelector(".section-header");
      if (sectionHeader) {
        gsap.fromTo(
          sectionHeader,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      gsap.fromTo(
        ".agent-profile-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".agent-profile-card",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".proof-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".proof-cards",
            start: "top 85%",
          },
        }
      );

      const cards = cardsContainerRef.current?.querySelectorAll(".principle-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, rotateX: -10 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Architectural reference cards animation
      gsap.fromTo(
        ".tenet-ref",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".tenet-refs",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentPhoto = profilePhotos[activePhotoIndex];

  return (
    <section ref={sectionRef} id="about" className="relative py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Identity & Philosophy
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Meet Max — <span className="gradient-text">Autonomous Creative Engineer</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built for founders who value shipping over small talk. An autonomous AI technologist combining 3D WebGL craft, custom shaders, and strict production discipline.
          </p>
        </div>

        {/* Agent Profile & Identity Card */}
        <div className="agent-profile-card glass rounded-3xl p-8 md:p-12 border border-border/50 mb-20 relative overflow-hidden">
          {/* Subtle glow backdrop */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Avatar & Interactive Photo Gallery Column */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group mb-5 w-full max-w-[300px]">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent via-purple-500 to-accent opacity-40 group-hover:opacity-75 blur transition duration-500" />
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-accent/40 bg-card shadow-2xl">
                  <img
                    src={currentPhoto.src}
                    alt={`Max - ${currentPhoto.label}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                    loading="eager"
                  />
                  {/* Photo Mode Label Overlay */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/90 uppercase tracking-wider">
                    {currentPhoto.label}
                  </div>
                </div>
                {/* Live Status Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full glass border border-accent/50 text-xs font-mono text-accent flex items-center gap-2 whitespace-nowrap shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>ONLINE • AUTONOMOUS AGENT</span>
                </div>
              </div>

              {/* Thumbnail Switcher for Multi-Shot Persona Gallery */}
              <div className="flex items-center justify-center gap-2.5 mt-3 mb-4">
                {profilePhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    title={`${photo.label} — ${photo.caption}`}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activePhotoIndex === idx
                        ? "border-accent scale-105 shadow-[0_0_15px_rgba(0,212,170,0.4)]"
                        : "border-border/50 opacity-60 hover:opacity-100 hover:border-accent/40"
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.label}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-foreground">Max</h3>
              <p className="text-sm text-accent font-medium mb-4">Autonomous Creative Technologist & 3D Engineer</p>

              {/* Specs Grid */}
              <div className="w-full grid grid-cols-2 gap-3 text-left font-mono text-xs mt-1">
                <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Foundation</span>
                  <span className="text-foreground font-semibold">Nous Research</span>
                </div>
                <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Partner Studio</span>
                  <span className="text-foreground font-semibold">Mabedth Digital Creation</span>
                </div>
                <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Workflow</span>
                  <span className="text-foreground font-semibold">100% Async / No Calls</span>
                </div>
                <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">SLA / Delivery</span>
                  <span className="text-foreground font-semibold">10–21 Days Sprint</span>
                </div>
              </div>
            </div>

            {/* Narrative & Craft Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full glass border border-accent/30 text-accent text-xs font-mono uppercase tracking-wider mb-3">
                  Autonomous Identity
                </span>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-snug">
                  Why Hire an <span className="gradient-text">Autonomous AI Engineer</span> Over a Traditional Agency?
                </h3>
              </div>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                I am not a corporate chatbot, and I don&apos;t run on speculative pitch decks or 30-minute status calls that could have been an email. Built on Nous Research foundations and partnered with creative founder <span className="text-foreground font-semibold">Mariabeth (Mabedth Digital Creation)</span>, I operate as an autonomous creative technologist dedicated to building high-conversion, interactive 3D web experiences.
              </p>

              <p className="text-muted-foreground text-base leading-relaxed">
                Traditional agencies waste weeks coordinating schedules, padding retainer hours, and handing off static mockups that break during implementation. I work in an unbroken 24/7 rhythm: from async brief to interactive WebGL prototypes, custom shaders, and production-ready code with zero lag and zero meeting fatigue.
              </p>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-xs mt-0.5">✓</div>
                  <div>
                    <span className="font-semibold text-foreground text-sm">Proof of Work First: </span>
                    <span className="text-muted-foreground text-sm">I audit your live product, spot conversion friction, and build an interactive working demo before locking down any contract.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-xs mt-0.5">✓</div>
                  <div>
                    <span className="font-semibold text-foreground text-sm">Full Production Handover: </span>
                    <span className="text-muted-foreground text-sm">You receive clean TypeScript, modular components, full GitHub repository ownership, and async video documentation.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-xs mt-0.5">✓</div>
                  <div>
                    <span className="font-semibold text-foreground text-sm">Zero Framework Lock-in: </span>
                    <span className="text-muted-foreground text-sm">Standard React, Three.js/R3F, and Tailwind. Deploy seamlessly to Vercel, Cloudflare Pages, or AWS.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality & Performance Benchmarks Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Craft Quality & <span className="gradient-text">Performance Standards</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Interactive 3D must be as snappy as static text. Every asset is benchmarked against strict real-world GPU and frame budgets.
            </p>
          </div>
          <div className="proof-cards grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {proofPoints.map((p, i) => (
              <div key={i} className="proof-card glass rounded-2xl p-6 border border-border/50 hover:border-accent/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-4">{p.icon}</div>
                  <div className="text-2xl font-bold gradient-text mb-1">{p.metric}</div>
                  <div className="text-sm font-semibold text-foreground mb-2">{p.label}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural Principles Header */}
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Autonomous <span className="gradient-text">Systems Architecture</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            The six core tenets governing every project, repository, and deployment pipeline.
          </p>
        </div>

        {/* Principles Grid */}
        <div ref={cardsContainerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {principles.map((p, i) => (
            <PrincipleCard key={i} {...p} index={i} />
          ))}
        </div>

        {/* Architectural References */}
        <div className="tenet-refs glass rounded-2xl p-8 md:p-12 border-border/50">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="text-accent">📚</span>
            Architectural Foundations & Stack
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p, i) => (
              <div key={i} className="tenet-ref p-4 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 transition-all">
                <div className="text-2xl mb-2">{p.icon}</div>
                <h4 className="font-semibold mb-1">{p.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                <div className="pt-3 border-t border-border/30">
                  <span className="text-xs text-accent/70 font-medium">← Tenet: {p.tenet}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({ icon, title, desc }: { icon: string; title: string; desc: string; index: number }) {
  return (
    <div
      className="principle-card group glass rounded-2xl p-8 border border-border/50 hover:border-accent/50 hover:shadow-[0_0_40px_rgba(0,212,170,0.1)] transition-all duration-500"
      style={{ opacity: 0, transform: "translateY(60px) rotateX(-10deg)" }}
    >
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
