"use client";

import { Canvas } from "@react-three/fiber";
import { HeroScene } from "./HeroScene";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

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

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: canvasRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (canvasRef.current) {
            const progress = self.progress;
            canvasRef.current.style.transform = `translateY(${progress * 100}px) scale(${1 - progress * 0.1})`;
          }
        },
      });
    }, canvasRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ touchAction: "none" }}
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