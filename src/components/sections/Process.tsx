"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discover & Scope",
    description: "We map your vision to a fixed-scope spec. One call, one brief, zero ambiguity. You approve the plan before a single line of code.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: "#00d4aa",
  },
  {
    number: "02",
    title: "Design System",
    description: "Tokens, motion language, 3D mood boards. You get a living Figma + Storybook — not static mockups. Every component is production-ready.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: "#8b5cf6",
  },
  {
    number: "03",
    title: "Build & Animate",
    description: "React + GSAP + Three.js. Scroll-triggered narratives, interactive 3D, product configurators. Clean, typed, accessible, performant.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 18 2 12 8 6" />
      </svg>
    ),
    color: "#f59e0b",
  },
  {
    number: "04",
    title: "Launch & Iterate",
    description: "Deployed to Cloudflare Pages / Vercel. Analytics, error tracking, A/B hooks built-in. Two revision rounds included. You own everything.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#ef4444",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards on scroll reveal cleanly without getting stuck in opacity 0
      gsap.fromTo(
        stepsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full min-h-screen py-24 px-6 flex flex-col items-center justify-center bg-background"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            How We Work
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Four Steps to <span className="gradient-text">Living Assets</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Fixed scope. Fixed price. Fixed timeline. No retainers, no surprise invoices.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => { if (el) stepsRef.current[i] = el; }}
              className="relative group step-card"
            >
              {/* Step Card */}
              <div className="relative glass rounded-2xl p-8 border border-border/50 h-full flex flex-col transition-all duration-500 hover:border-accent/40">
                {/* Number */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: step.color }}>
                    {step.number}
                  </div>
                  <div className="w-full h-px bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }} />
                </div>

                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed flex-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">10–21</div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="w-px h-8 bg-border/50 mx-4" />
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">2</div>
            <div className="text-sm text-muted-foreground">Revision Rounds</div>
          </div>
          <div className="w-px h-8 bg-border/50 mx-4" />
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
            <div className="text-sm text-muted-foreground">Code Ownership</div>
          </div>
        </div>
      </div>
    </section>
  );
}