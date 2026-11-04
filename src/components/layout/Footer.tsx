import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const footerLinks = footerRef.current?.querySelectorAll(".footer-link");
      if (footerLinks && footerLinks.length > 0) {
        gsap.fromTo(
          footerLinks,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="relative border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4" aria-label="Max Lab Home">
              <span className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2.5">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="15.5" />
                  <polyline points="22 8.5 12 15.5 2 8.5" />
                </svg>
              </span>
              <span className="gradient-text font-bold tracking-tight">MaxLab Tech</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Interactive launch assets that live and evolve. Built on autonomous systems principles: persistent identity, continuous rhythm, economic stakes.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/maxlab" target="_blank" rel="noopener noreferrer" className="footer-link text-muted-foreground hover:text-accent transition-colors" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://x.com/maxlab_tech" target="_blank" rel="noopener noreferrer" className="footer-link text-muted-foreground hover:text-accent transition-colors" aria-label="X/Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.308.54L12 12.75l-6.977 7.47-3.308-.54 8.502-9.24L0 2.25h3.308l2.75 3.015 4.497-4.993 4.842 5.29-1.355 4.23h3.556l-5.397-6.432z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/in/maxlab" target="_blank" rel="noopener noreferrer" className="footer-link text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:maxlab.studio@agentmail.to" className="footer-link text-muted-foreground hover:text-accent transition-colors" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav>
            <h4 className="font-semibold mb-4">Navigate</h4>
            <ul className="space-y-3">
              {[
                { href: "#about", label: "Philosophy" },
                { href: "#services", label: "Offers" },
                { href: "#work", label: "Work" },
                { href: "#activity", label: "iLog" },
                { href: "#contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link text-sm text-muted-foreground hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tiers */}
          <nav>
            <h4 className="font-semibold mb-4">Tiers</h4>
            <ul className="space-y-3">
              {[
                { href: "#services", label: "LAUNCH — $3,500" },
                { href: "#services", label: "LAUNCH PRO — $6,500" },
                { href: "#services", label: "LAUNCH SYSTEM — $11,000" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="footer-link text-sm text-muted-foreground hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal/Info */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Fixed scope, fixed price</li>
              <li>2 revisions included</li>
              <li>Full IP ownership on delivery</li>
              <li>50% deposit, 50% on delivery</li>
              <li>Direct: maxlab.studio@agentmail.to</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            © {currentYear} maxlab.tech — Built with Next.js, GSAP & Three.js. Partnered with Mabed Digital Creation.
          </p>
          <p className="text-sm text-muted-foreground">
            Privacy • Terms • Cookie Policy
          </p>
        </div>
      </div>
    </footer>
  );
}