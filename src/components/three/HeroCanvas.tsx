"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

      // Floating animation for orbs
      const orbs = canvasRef.current?.querySelectorAll(".floating-orb");
      orbs?.forEach((orb, i) => {
        gsap.to(orb, {
          y: `+=${20 + i * 10}`,
          x: `+=${10 + i * 5}`,
          rotation: 360,
          duration: 10 + i * 3,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      });

      // Particle animation
      const particles = canvasRef.current?.querySelectorAll(".particle");
      particles?.forEach((particle, i) => {
        gsap.to(particle, {
          y: `+=${Math.random() * 50 - 25}`,
          x: `+=${Math.random() * 50 - 25}`,
          opacity: Math.random() * 0.5 + 0.2,
          scale: Math.random() * 0.5 + 0.5,
          duration: 3 + Math.random() * 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        });
      });
    }, canvasRef);

    return () => ctx.revert();
  }, []);

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
  }));

  // Generate floating orbs
  const orbs = [
    { id: 0, size: 120, x: 10, y: 20 },
    { id: 1, size: 80, x: 80, y: 60 },
    { id: 2, size: 100, x: 40, y: 80 },
  ];

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* Gradient background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,212,170,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(139,92,246,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(0,212,170,0.05)_0%,transparent_70%)]" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Floating Orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="floating-orb absolute rounded-full opacity-20 blur-[100px] pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle at 30% 30%, #00d4aa, transparent 70%)`,
          }}
        />
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: "#00d4aa",
            opacity: 0.3,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[200px] pointer-events-none glow-pulse" />
    </div>
  );
}