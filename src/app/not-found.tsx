"use client";

import Link from "next/link";
import { useEffect } from "react";
import { gsap } from "gsap";

export default function NotFound() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".not-found-content > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="not-found-content text-center max-w-md">
        <div className="text-8xl mb-6">🌌</div>
        <h1 className="text-5xl font-bold mb-4 gradient-text">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Lost in Orbit</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for drifted into deep space. 
          No worries — mission control can bring you back.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Base
          </Link>
          <Link
            href="#contact"
            className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-colors"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}