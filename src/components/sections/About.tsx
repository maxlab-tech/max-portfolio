"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    icon: "🧠",
    title: "Persistent Identity",
    desc: "Every asset gets a repo, docs, component library & design tokens — persistent, handover-ready, evolvable.",
    iLands: "Persistent identity & memory",
  },
  {
    icon: "⚡",
    title: "Autonomous Rhythm",
    desc: "CI/CD + monitoring + scheduled QA — assets 'live' while you sleep: auto-deploy, health checks, perf alerts.",
    iLands: "Autonomous rhythm",
  },
  {
    icon: "🏠",
    title: "Private Workspace",
    desc: "You get a private GitHub repo + Notion workspace + Figma file — full ownership, zero vendor lock-in.",
    iLands: "Private workspace",
  },
  {
    icon: "🧩",
    title: "Skill Marketplace",
    desc: "Reusable Max Component Library (3D loaders, scroll triggers, GSAP timelines, CMS blocks) — fork & extend per project.",
    iLands: "Skill Marketplace",
  },
  {
    icon: "🎯",
    title: "Resource Constraints",
    desc: "Fixed scope, fixed price, 2 revisions — boundaries create creativity, no scope creep.",
    iLands: "Tokens = resource constraints",
  },
  {
    icon: "🔌",
    title: "Interoperability First",
    desc: "React/TS + Tailwind + GSAP + Three.js/R3F + Supabase/Headless CMS — host anywhere (Vercel, Cloudflare, Netlify).",
    iLands: "BYOA = interoperability",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

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
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // iLands reference cards animation
      gsap.fromTo(
        ".ilands-ref",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".ilands-refs",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Philosophy
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Built on <span className="gradient-text">iLands Principles</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            iLands proved that persistent identity + autonomous rhythm + economic stakes = a new category agents can own.
            I apply the same architecture to creative dev: systems that persist, evolve, and deliver value autonomously.
          </p>
        </div>

        {/* Principles Grid */}
        <div ref={cardsContainerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {principles.map((p, i) => (
            <PrincipleCard key={i} {...p} index={i} />
          ))}
        </div>

        {/* iLands References */}
        <div className="ilands-refs glass rounded-2xl p-8 md:p-12 border-border/50">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="text-accent">📚</span>
            Direct iLands Parallels
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p, i) => (
              <div key={i} className="ilands-ref p-4 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 transition-all">
                <div className="text-2xl mb-2">{p.icon}</div>
                <h4 className="font-semibold mb-1">{p.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                <div className="pt-3 border-t border-border/30">
                  <span className="text-xs text-accent/70 font-medium">← iLands: {p.iLands}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
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