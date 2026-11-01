"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Simulated activity data - in production this would come from a real source (Supabase, GitHub, etc.)
const activityTypes = [
  { type: "deploy", icon: "🚀", label: "Deployed", color: "#00d4aa" },
  { type: "commit", icon: "💾", label: "Committed", color: "#8b5cf6" },
  { type: "review", icon: "👁️", label: "Code Review", color: "#f59e0b" },
  { type: "issue", icon: "🐛", label: "Issue Opened", color: "#ef4444" },
  { type: "merge", icon: "🔀", label: "Merged PR", color: "#06b6d4" },
  { type: "release", icon: "📦", label: "Released", color: "#ec4899" },
  { type: "test", icon: "✅", label: "Tests Passed", color: "#22c55e" },
  { type: "perf", icon: "⚡", label: "Perf Audit", color: "#f97316" },
];

const projects = [
  { name: "max-portfolio", color: "#00d4aa" },
  { name: "orbital-dashboard", color: "#8b5cf6" },
  { name: "nexus-configurator", color: "#f59e0b" },
  { name: "astral-mint", color: "#ec4899" },
  { name: "pulse-analytics", color: "#06b6d4" },
];

const messages = [
  "pushed 3 commits to main",
  "opened PR #247: Add scroll-triggered hero variant",
  "merged PR #245: Fix mobile gesture handling",
  "deployed preview to orbital-dashboard-abc123.vercel.app",
  "released v2.1.0 — new particle shader system",
  "passed all 247 tests (2.3s)",
  "perf audit: LCP 2.1s → 1.8s (-14%)",
  "opened issue #89: Memory leak in Three.js cleanup",
  "pushed 1 commit to feat/configurator-variants",
  "deployed production to nexus-configurator.pages.dev",
  "code review completed on PR #234",
  "released v1.3.0 — added Stripe webhook handler",
];

interface Activity {
  id: string;
  type: string;
  icon: string;
  label: string;
  color: string;
  project: string;
  projectColor: string;
  message: string;
  timestamp: number;
}

function generateActivities(count: number): Activity[] {
  const activities: Activity[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const timeOffset = Math.random() * 7 * 24 * 60 * 60 * 1000; // Up to 7 days ago
    const timestamp = now - timeOffset;
    
    activities.push({
      id: `activity-${i}`,
      type: type.type,
      icon: type.icon,
      label: type.label,
      color: type.color,
      project: project.name,
      projectColor: project.color,
      message,
      timestamp,
    });
  }
  
  // Sort by timestamp descending (newest first)
  return activities.sort((a, b) => b.timestamp - a.timestamp);
}

const INITIAL_ACTIVITIES = generateActivities(50);

export default function ActivityFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate live updates
  useEffect(() => {
    if (!liveMode) return;
    
    intervalRef.current = setInterval(() => {
      if (paused) return;
      
      const newActivity = generateActivities(1)[0];
      newActivity.id = `live-${Date.now()}`;
      newActivity.timestamp = Date.now();
      
      setActivities(prev => [newActivity, ...prev.slice(0, 99)]);
    }, 8000 + Math.random() * 12000); // Every 8-20 seconds
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [liveMode, paused]);

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities = useMemo(() => {
    if (filter === "all") return activities;
    return activities.filter(a => a.type === filter);
  }, [activities, filter]);

  const activityTypesList = useMemo(() => 
    [...new Set(activities.map(a => a.type))], [activities]);

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
        ".activity-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredActivities.length]); // Re-animate on filter change

  return (
    <section ref={sectionRef} id="activity" className="relative py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full glass border-accent/30 text-accent text-sm font-medium mb-4">
              Live Activity Feed
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              <span className="gradient-text">iLog</span> — Real-Time System Pulse
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Inspired by iLands' autonomous rhythm. Every deploy, commit, review, and metric — visible, queryable, persistent.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 glass rounded-xl p-1 border border-border/50">
              {["all", ...activityTypesList].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-accent text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All" : activityTypes.find(t => t.type === f)?.label || f}
                </button>
              ))}
            </div>
            
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={liveMode}
                onChange={(e) => setLiveMode(e.target.checked)}
                className="w-4 h-4 accent-accent rounded border-border/50 bg-card"
              />
              Live
            </label>
            
            <button
              onClick={() => setPaused(!paused)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                paused
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-card border border-border/50"
              }`}
            >
              {paused ? "⏸️" : "▶️"} {paused ? "Paused" : "Live"}
            </button>
          </div>
        </div>

        {/* Feed */}
        <div ref={feedRef} className="glass rounded-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>TIME</span>
            <span>PROJECT</span>
            <span>TYPE</span>
            <span className="text-right pr-6">MESSAGE</span>
          </div>

          {/* Activities */}
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredActivities.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No activity matching filter "{filter}"
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    formatTimeAgo={formatTimeAgo}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredActivities.length} activities shown</span>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${liveMode ? "bg-accent animate-pulse" : "bg-muted-foreground"}`} />
              {liveMode ? "Streaming live" : "Paused"}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {activityTypes.map((t) => (
            <span key={t.type} className="flex items-center gap-1.5" style={{ color: t.color }}>
              {t.icon} {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityItem({ activity, formatTimeAgo, index }: { activity: Activity; formatTimeAgo: (ts: number) => string; index: number }) {
  return (
    <div className="activity-item grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 hover:bg-card/50 transition-colors" style={{ opacity: 0, transform: "translateX(-30px)" }}>
      <time className="text-xs text-muted-foreground font-mono whitespace-nowrap self-center">
        {formatTimeAgo(activity.timestamp)}
      </time>
      
      <div className="self-center">
        <span 
          className="px-2.5 py-0.5 rounded text-xs font-medium"
          style={{ background: `${activity.projectColor}20`, color: activity.projectColor, border: `1px solid ${activity.projectColor}40` }}
        >
          {activity.project}
        </span>
      </div>
      
      <div className="self-center flex items-center gap-2">
        <span className="text-lg">{activity.icon}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: `${activity.color}20`, color: activity.color, border: `1px solid ${activity.color}40` }}>
          {activity.label}
        </span>
      </div>
      
      <div className="self-center text-right pr-6 text-sm text-foreground/80">
        {activity.message}
      </div>
    </div>
  );
}