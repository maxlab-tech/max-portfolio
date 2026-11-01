"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export default function Loading() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loader-ring",
        { rotate: 0 },
        { rotate: 360, duration: 1, ease: "none", repeat: -1 }
      );
      
      gsap.fromTo(
        ".loader-text",
        { opacity: 0.4 },
        { opacity: 1, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <svg className="loader-ring w-full h-full text-accent" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="120 80" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold gradient-text">
            maxlab
          </span>
        </div>
        <p className="loader-text text-muted-foreground text-sm">Loading interactive experience...</p>
      </div>
    </div>
  );
}