"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });

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
        ".contact-form .form-group",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".contact-info",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-info",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    // Simulate form submission - in production, this would send to an API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For now, just show success
    setFormState("success");
    setFormData({ name: "", email: "", projectType: "", budget: "", timeline: "", message: "" });
    
    setTimeout(() => setFormState("idle"), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-6">
            Let's Build
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Ready to <span className="gradient-text">Ship Something Live</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Pick a tier, we scope it, I deliver in 10–21 days. Fixed price. Full handover. Let's start.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="contact-form glass rounded-2xl p-8 md:p-10 border border-border/50">
            {formState === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6 text-3xl">✅</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-8">
                  I'll review your project details and get back within 24 hours with a scoped proposal.
                </p>
                <button
                  onClick={() => setFormState("idle")}
                  className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:opacity-90"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormGroup label="Name" required>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="form-input"
                      required
                    />
                  </FormGroup>
                  <FormGroup label="Email" required>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="form-input"
                      required
                    />
                  </FormGroup>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormGroup label="Project Tier" required>
                    <select name="projectType" value={formData.projectType} onChange={handleChange} className="form-input" required>
                      <option value="">Select a tier</option>
                      <option value="launch">LAUNCH — $3,500 (10 days)</option>
                      <option value="launch-pro">LAUNCH PRO — $6,500 (14 days)</option>
                      <option value="launch-system">LAUNCH SYSTEM — $11,000 (21 days)</option>
                      <option value="custom">Custom / Not Sure</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="Timeline">
                    <select name="timeline" value={formData.timeline} onChange={handleChange} className="form-input">
                      <option value="">When do you need it?</option>
                      <option value="asap">ASAP</option>
                      <option value="2-weeks">2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </FormGroup>
                </div>

                <FormGroup label="Budget Range">
                  <select name="budget" value={formData.budget} onChange={handleChange} className="form-input">
                    <option value="">Budget range (USD)</option>
                    <option value="3-5k">$3,000 – $5,000</option>
                    <option value="5-8k">$5,000 – $8,000</option>
                    <option value="8-12k">$8,000 – $12,000</option>
                    <option value="12k+">$12,000+</option>
                    <option value="discuss">Let's discuss</option>
                  </select>
                </FormGroup>

                <FormGroup label="Project Details" required>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, goals, stack preferences, must-haves..."
                    rows={6}
                    className="form-input resize-none"
                    required
                  />
                </FormGroup>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full py-4 rounded-xl bg-accent text-background font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                  {formState === "submitting" ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Sending...
                    </>
                  ) : (
                    "Start Project →"
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to scope discussion before any payment. 50% deposit to begin, 50% on delivery.
                </p>
              </form>
            )}
          </div>

          {/* Contact Info / Process */}
          <div className="contact-info space-y-8">
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-accent">💬</span>
                What Happens Next
              </h3>
              <dl className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-lg">1</div>
                  <div>
                    <dt className="font-semibold mb-1">Discovery Call (30 min)</dt>
                    <dd className="text-muted-foreground text-sm">We define exact scope, success metrics, timeline. Fixed price agreed in writing.</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-lg">2</div>
                  <div>
                    <dt className="font-semibold mb-1">Design & Architecture</dt>
                    <dd className="text-muted-foreground text-sm">Figma prototypes, component architecture, tech spec. You approve before any code.</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-lg">3</div>
                  <div>
                    <dt className="font-semibold mb-1">Build & Daily Updates</dt>
                    <dd className="text-muted-foreground text-sm">Daily commits, preview deployments, 2 revision cycles included. Transparent progress.</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-lg">4</div>
                  <div>
                    <dt className="font-semibold mb-1">Launch & Handover</dt>
                    <dd className="text-muted-foreground text-sm">Deploy to your domain, full repo/docs/component library handover, training call.</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent text-lg">5</div>
                  <div>
                    <dt className="font-semibold mb-1">Maintain & Evolve</dt>
                    <dd className="text-muted-foreground text-sm">Maintenance window active. Quarterly iteration sprints available. Priority access.</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="glass rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-accent">📋</span>
                What I Need From You
              </h3>
              <ul className="space-y-3">
                {[
                  "Brand assets (logo, fonts, colors) or brand guidelines",
                  "Content/copy for the experience (or we can placeholder)",
                  "Product 3D models (GLTF/GLB) if configurator tier — or we create simple ones",
                  "CMS access (Contentful, Sanity, Supabase) or we set up Supabase",
                  "Domain & hosting access (Vercel, Cloudflare, Netlify) for deploy",
                  "Stripe/Shopify credentials if checkout hook needed",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-accent">💰</span>
                Payment & Contract
              </h3>
              <div className="space-y-4 text-sm">
                <p><strong>50% deposit</strong> to begin (via PayPal: <a href="mailto:tuwaidanmabedth@gmail.com" className="text-accent hover:underline">tuwaidanmabedth@gmail.com</a>)</p>
                <p><strong>50% on delivery</strong> before final repo handover</p>
                <p><strong>Digital contract</strong> via DocuSign/HelloSign (handled by Mariabeth)</p>
                <p><strong>Full IP ownership</strong> transfers to you on final payment</p>
                <p><strong>No hidden fees</strong> — scope locked, price fixed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="block text-sm font-medium mb-2 flex items-center gap-1">
        {label}
        {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}