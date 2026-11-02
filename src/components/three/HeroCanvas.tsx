"use client";

import { Canvas } from "@react-three/fiber";
import { HeroScene } from "./HeroScene";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// Filter out upstream THREE.Clock deprecation warning if triggered by R3F
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const msg = args[0];
    if (
      typeof msg === "string" &&
      (msg.includes("THREE.Clock: This module has been deprecated") ||
        msg.includes("THREE.Clock"))
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        canvasRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power3.out" }
      );

      // GPU-accelerated smooth parallax on scroll (avoids layout thrashing / forced reflow)
      if (canvasRef.current) {
        gsap.to(canvasRef.current, {
          y: 100,
          scale: 0.9,
          ease: "none",
          scrollTrigger: {
            trigger: canvasRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, canvasRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ touchAction: "none", willChange: "transform, opacity" }}
    >
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          style={{ touchAction: "none" }}
        >
          <HeroScene />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
