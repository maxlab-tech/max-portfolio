"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    id: "launch",
    name: "LAUNCH",
    tagline: "Interactive Hero Experience",
    price: "$3,500",
    timeline: "10 days",
    description: "A scroll-driven 3D hero + interactive story that stops the scroll and starts the conversation.",
    deliverables: [
      "GSAP scroll-triggered narrative hero",
      "Three.js/R3F 3D hero element (shader, particles, or model)",
      "Responsive, CMS-ready (Contentful/Sanity/Supabase)",
      "Performance optimized (< 3s LCP)",
      "GitHub repo + docs + component library",
      "30-day maintenance window",
    ],
    idealFor: "SaaS launch, Web3 mint site, Product landing, Brand campaign",
    cta: "Start Launch",
    popular: false,
  },
  {
    id: "launch-pro",
    name: "LAUNCH PRO",
    tagline: "Hero + Product Configurator",
    price: "$6,500",
    timeline: "14 days",
    description: "Everything in LAUNCH plus a real-time 3D product explorer — color, material, variant, live price, add-to-cart.",
    deliverables: [
      "Everything in LAUNCH",
      "3D product configurator (color/material/variant)",
      "Real-time price calculation",
      "Add-to-cart / checkout hook (Stripe/Shopify)",
      "Variant image generation pipeline",
      "Analytics dashboard (interactions, conversions)",
      "45-day maintenance window",
    ],
    idealFor: "E-com flagship, Hardware pre-order, Customizable product, High-ticket demo",
    cta: "Start Launch Pro",
    popular: true,
  },
  {
    id: "launch-system",
    name: "LAUNCH SYSTEM",
    tagline: "Full Launch Asset Suite",
    price: "$11,000",
    timeline: "21 days",
    description: "The complete system: hero, configurator, animated case study, email capture microsite, analytics, ongoing partnership.",
    deliverables: [
      "Everything in LAUNCH PRO",
      "Animated case study / impact report page",
      "Email capture microsite (waitlist/lead gen)",
      "Full analytics + conversion funnel dashboard",
      "A/B test infrastructure (Vercel/Cloudflare)",
      "Component library documented in Storybook",
      "90-day maintenance + quarterly iteration sprint",
      "Priority access for future work",
    ],
    idealFor: "Series A+ launch, Platform rebrand, Multi-product ecosystem, Agency partner",
    cta: "Start Launch System",
    popular: false,
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTier, setActiveTier] = useState(1); // LAUNCH PRO default

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
        ".tier-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Popular badge pulse
      gsap.to(".popular-badge", {
        scale: 1.05,
        boxShadow: "0 0 20px rgba(0, 212, 170, 0.5)",
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Offers
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Three Tiers. <span className="gradient-text">Fixed Scope.</span> Fixed Price.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No hourly. No retainers. No scope creep. You pick a tier, we agree on scope, I deliver in 10–21 days.
            Includes repo, docs, component library, and maintenance window.
          </p>
        </div>

        {/* Tier Selector (Mobile) */}
        <div className="flex justify-center gap-2 mb-12 md:hidden">
          {tiers.map((tier, i) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTier === i
                  ? "bg-accent text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {tier.name}
            </button>
          ))}
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <TierCard
              key={tier.id}
              tier={tier}
              isActive={activeTier === i}
              onClick={() => setActiveTier(i)}
            />
          ))}
        </div>

        {/* Comparison Table (Desktop) */}
        <div className="hidden md:block mt-20">
          <ComparisonTable tiers={tiers} />
        </div>

        {/* Process */}
        <ProcessSteps />
      </div>
    </section>
  );
}

function TierCard({ tier, isActive, onClick }: { tier: typeof tiers[0]; isActive: boolean; onClick: () => void }) {
  return (
    <article
      className={`tier-card relative glass rounded-2xl p-8 md:p-10 border transition-all duration-500 ${
        isActive
          ? "border-accent/50 shadow-[0_0_40px_rgba(0,212,170,0.15)] ring-1 ring-accent/20"
          : "border-border/50 hover:border-accent/30"
      } ${tier.popular ? "relative" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {tier.popular && (
        <div className="popular-badge absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold tracking-wider">
          MOST POPULAR
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
        <p className="text-accent font-medium text-sm mb-4">{tier.tagline}</p>
      </div>

      <div className="mb-8">
        <div className="text-5xl md:text-6xl font-bold gradient-text mb-1">{tier.price}</div>
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {tier.timeline} delivery
        </div>
      </div>

      <p className="text-muted-foreground mb-8 leading-relaxed">{tier.description}</p>

      <ul className="space-y-3 mb-8">
        {tier.deliverables.map((d, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {d}
          </li>
        ))}
      </ul>

      <div className="p-4 rounded-xl bg-card/50 border border-border/50 mb-6">
        <h4 className="font-semibold mb-2 text-sm">Ideal for:</h4>
        <p className="text-sm text-muted-foreground">{tier.idealFor}</p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          isActive
            ? "bg-accent text-background hover:opacity-90"
            : "bg-card border border-border/50 text-foreground hover:border-accent/50"
        }`}
      >
        {tier.cta}
      </button>
    </article>
  );
}

interface Tier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  timeline: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  cta: string;
  popular: boolean;
}

function ComparisonTable({ tiers }: { tiers: Tier[] }) {
  const comparisonRows = [
    { key: "hero", label: "3D/GSAP Hero Narrative" },
    { key: "cms", label: "CMS-Ready (Contentful/Sanity/Supabase)" },
    { key: "perf", label: "Performance Optimized (<3s LCP)" },
    { key: "repo", label: "GitHub Repo + Docs + Component Library" },
    { key: "maintenance", label: "Maintenance Window" },
    { key: "configurator", label: "3D Product Configurator" },
    { key: "variants", label: "Real-time Variants & Pricing" },
    { key: "checkout", label: "Checkout/Stripe Hook" },
    { key: "analytics", label: "Analytics Dashboard" },
    { key: "caseStudy", label: "Animated Case Study Page" },
    { key: "microsite", label: "Email Capture Microsite" },
    { key: "abTest", label: "A/B Test Infrastructure" },
    { key: "storybook", label: "Storybook Component Library" },
    { key: "quarterly", label: "Quarterly Iteration Sprint" },
    { key: "priority", label: "Priority Future Access" },
  ];

  const tierFeatures: Record<string, string[]> = {
    launch: ["hero", "cms", "perf", "repo", "maintenance"],
    "launch-pro": ["hero", "cms", "perf", "repo", "maintenance", "configurator", "variants", "checkout", "analytics"],
    "launch-system": [
      "hero", "cms", "perf", "repo", "maintenance", "configurator", "variants", "checkout", "analytics",
      "caseStudy", "microsite", "abTest", "storybook", "quarterly", "priority"
    ],
  };

  return (
    <div className="overflow-x-auto glass rounded-2xl border border-border/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left p-4 font-semibold text-accent">Feature</th>
            {tiers.map((t) => (
              <th key={t.id} className="text-center p-4 font-semibold">
                {t.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.key} className="border-b border-border/30">
              <td className="p-4 text-sm text-foreground/80">{row.label}</td>
              {tiers.map((t) => (
                <td key={t.id} className="text-center p-4">
                  {tierFeatures[t.id]?.includes(row.key) ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2.5" className="mx-auto">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted-foreground/30">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProcessSteps() {
  const steps = [
    { num: "01", title: "Discover & Scope", desc: "30-min call → we define exact scope, timeline, success metrics. Fixed price agreed." },
    { num: "02", title: "Kickoff & Design", desc: "Figma prototypes, component architecture, tech spec. You approve before code." },
    { num: "03", title: "Build & Iterate", desc: "Daily commits, preview deployments, 2 revision cycles built-in. Transparent progress." },
    { num: "04", title: "Launch & Handover", desc: "Deploy to your domain, full repo/docs/component library handover, training call." },
    { num: "05", title: "Maintain & Evolve", desc: "Maintenance window active. Quarterly iteration sprints available. Priority access." },
  ];

  return (
    <div className="mt-24">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">
        From Call to Live in <span className="gradient-text">10–21 Days</span>
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-transparent -translate-x-1/2 hidden md:block" />
        
        <div className="space-y-16">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex md:flex-row flex-col items-center gap-8">
              <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full glass border border-border/50 flex items-center justify-center">
                <span className="text-2xl font-bold gradient-text">{step.num}</span>
              </div>
              <div className={`glass rounded-2xl p-6 md:w-1/2 border border-border/50 ${i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}