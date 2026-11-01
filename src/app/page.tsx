"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import Configurator from "@/components/sections/Configurator";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import ActivityFeed from "@/components/sections/ActivityFeed";
import Contact from "@/components/sections/Contact";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();
    
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          history.pushState(null, "", target.hash);
        }
      }
    };
    
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-16 md:pt-20">
        <Hero />
        <Process />
        <Configurator />
        <About />
        <Services />
        <Work />
        <ActivityFeed />
        <Contact />
      </main>
      <Footer />
    </>
  );
}