"use client";

import { useEffect, useRef, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

// Only load HeroCanvas on client-side to avoid SSG hydration errors
const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="fixed inset-0 z-0 w-full h-full" /> }
);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.3,
        }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.6,
        }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 1,
        }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2,
        }
      );

      // Floating badge animation
      gsap.to(".floating-badge", {
        y: -10,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // CTA glow pulse
      gsap.to(".glow-border", {
        boxShadow: "0 0 40px rgba(0, 212, 170, 0.4), 0 0 80px rgba(0, 212, 170, 0.2)",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js Canvas - REAL WebGL */}
      <HeroCanvas />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 noise-overlay z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center">
          {/* Floating Badge */}
          <div className="floating-badge inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/30 mb-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">Live on maxlab.tech</span>
          </div>

          {/* Main Title */}
          <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
            <span className="block">Interactive Launch</span>
            <span className="block gradient-text">Assets That Live</span>
            <span className="block text-foreground/60 text-3xl md:text-4xl lg:text-5xl font-normal mt-2">and Evolve</span>
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Persistent, interactive web experiences — 3D heroes, product configurators, scroll-driven stories.
            Built with React, GSAP & Three.js. Fixed scope. Fixed price. Delivered in 10–21 days.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#contact"
              className="group relative px-8 py-4 rounded-xl bg-accent text-background font-semibold text-lg overflow-hidden glow-border transition-all hover:scale-[1.02] hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start a Project
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
            <a
              href="#work"
              className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-card transition-all hover:border-accent/50"
            >
              View Work
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto pt-8 border-t border-border">
            <StatCard value="10–21" label="Days Delivery" />
            <StatCard value="$3.5K–11K" label="Fixed Price" />
            <StatCard value="2" label="Revisions Included" />
            <StatCard value="100%" label="Client Ownership" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/50">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 glass rounded-xl border-border/50 hover:border-accent/30 transition-all">
      <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}