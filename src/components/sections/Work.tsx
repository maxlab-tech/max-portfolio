"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "orbital",
    title: "Orbital Dashboard",
    category: "SaaS / Data Viz",
    description: "Real-time 3D data visualization dashboard with WebGL globe, animated metrics, and collaborative annotations.",
    image: "🌐",
    tech: ["React", "Three.js", "GSAP", "Supabase Realtime", "Tailwind"],
    metrics: { lcp: "2.1s", tti: "1.8s", cls: "0.02" },
    link: "#",
  },
  {
    id: "nexus",
    title: "Nexus Configurator",
    category: "E-com / 3D Product",
    description: "Interactive 3D product configurator for modular furniture — material, color, dimension variants with live pricing.",
    image: "🪑",
    tech: ["React", "R3F", "GSAP", "Zustand", "Stripe"],
    metrics: { lcp: "2.8s", tti: "2.3s", conversion: "+34%" },
    link: "#",
  },
  {
    id: "astral",
    title: "Astral Mint Experience",
    category: "Web3 / Campaign",
    description: "Scroll-driven NFT mint narrative with particle shaders, wallet connection, and generative art reveal.",
    image: "✨",
    tech: ["Next.js", "Three.js", "GSAP", "Wagmi", "Vercel"],
    metrics: { lcp: "2.4s", minted: "8,432", gas: "optimized" },
    link: "#",
  },
  {
    id: "pulse",
    title: "Pulse Analytics Suite",
    category: "B2B / Dashboard",
    description: "Executive analytics dashboard with animated charts, drill-down exploration, and automated insight generation.",
    image: "📊",
    tech: ["React", "D3.js", "GSAP", "ClickHouse", "Tailwind"],
    metrics: { lcp: "1.9s", queries: "<100ms", users: "500+" },
    link: "#",
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState("all");
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const categories = ["all", "SaaS", "E-com", "Web3", "B2B"];

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(p => p.category.includes(filter));

  // Initial animations
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
        ".filter-btn",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".filter-bar",
            start: "top 85%",
          },
        }
      );
      const initialCards = cardsContainerRef.current?.querySelectorAll(".project-card");
      if (initialCards && initialCards.length > 0) {
        gsap.fromTo(
          initialCards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.08,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate cards on filter change
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current?.querySelectorAll(".project-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.08,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <section ref={sectionRef} id="work" className="relative py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Selected Work
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Shipped <span className="gradient-text">Interactive Experiences</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real projects, real metrics. Every project includes full repo handover, component library, and maintenance window.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-accent text-background shadow-[0_0_20px_rgba(0,212,170,0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-card border border-border/50"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div ref={cardsContainerRef} className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent text-background font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Start Your Project
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <article className="project-card group glass rounded-2xl overflow-hidden border border-border/50 hover:border-accent/50 hover:shadow-[0_0_40px_rgba(0,212,170,0.1)] transition-all duration-500">
      {/* Image/Visual Placeholder */}
      <div className="aspect-video relative bg-card/50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-8xl">{project.image}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <a href={project.link} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/90 text-background text-sm font-medium">
            View Case Study
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border/50 text-muted-foreground">
            {project.category}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded text-xs font-medium bg-card border border-border/50 text-muted-foreground/80">
              {t}
            </span>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          {Object.entries(project.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold gradient-text">{value}</div>
              <div className="text-xs text-muted-foreground">{key.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}