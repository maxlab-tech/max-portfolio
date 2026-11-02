"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Activity {
  id: string;
  type: string;
  icon: string;
  label: string;
  color: string;
  project: string;
  projectColor: string;
  message: string;
  timeAgo: string;
  timestamp: number;
}

const activityTypes = [
  { type: "deploy", icon: "🚀", label: "Deployed", color: "#00d4aa" },
  { type: "commit", icon: "💾", label: "Committed", color: "#8b5cf6" },
  { type: "review", icon: "👁️", label: "Code Review", color: "#f59e0b" },
  { type: "issue", icon: "🐛", label: "Issue Solved", color: "#ef4444" },
  { type: "merge", icon: "🔀", label: "Merged PR", color: "#06b6d4" },
  { type: "release", icon: "📦", label: "Released", color: "#ec4899" },
  { type: "test", icon: "✅", label: "Tests Passed", color: "#22c55e" },
  { type: "perf", icon: "⚡", label: "Perf Audit", color: "#f97316" },
];

// Deterministic static activities to guarantee 100% server-client parity during React hydration (prevents Error #418)
const STATIC_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "deploy",
    icon: "🚀",
    label: "Deployed",
    color: "#00d4aa",
    project: "max-portfolio",
    projectColor: "#00d4aa",
    message: "production release v1.4.2 live on Cloudflare Pages",
    timeAgo: "2m ago",
    timestamp: 1730560000000,
  },
  {
    id: "act-2",
    type: "commit",
    icon: "💾",
    label: "Committed",
    color: "#8b5cf6",
    project: "radar-engine",
    projectColor: "#f59e0b",
    message: "feat(radar): autonomous high-ticket lead auditor & pitch engine",
    timeAgo: "14m ago",
    timestamp: 1730559000000,
  },
  {
    id: "act-3",
    type: "perf",
    icon: "⚡",
    label: "Perf Audit",
    color: "#f97316",
    project: "max-portfolio",
    projectColor: "#00d4aa",
    message: "perf audit: LCP 1.1s, 0ms FID, 100/100 Core Web Vitals",
    timeAgo: "32m ago",
    timestamp: 1730558000000,
  },
  {
    id: "act-4",
    type: "merge",
    icon: "🔀",
    label: "Merged PR",
    color: "#06b6d4",
    project: "nexus-configurator",
    projectColor: "#8b5cf6",
    message: "merged PR #32: WebGL 3D dynamic lighting & shader optimization",
    timeAgo: "1h ago",
    timestamp: 1730555000000,
  },
  {
    id: "act-5",
    type: "release",
    icon: "📦",
    label: "Released",
    color: "#ec4899",
    project: "orbital-dashboard",
    projectColor: "#ec4899",
    message: "released v2.1.0 — new particle shader system & real-time telemetry",
    timeAgo: "2h ago",
    timestamp: 1730551000000,
  },
  {
    id: "act-6",
    type: "test",
    icon: "✅",
    label: "Tests Passed",
    color: "#22c55e",
    project: "max-portfolio",
    projectColor: "#00d4aa",
    message: "passed all 247 automated integration & visual regression tests",
    timeAgo: "3h ago",
    timestamp: 1730548000000,
  },
  {
    id: "act-7",
    type: "review",
    icon: "👁️",
    label: "Code Review",
    color: "#f59e0b",
    project: "pulse-analytics",
    projectColor: "#06b6d4",
    message: "code review completed on PR #234: zero-hydration SSR parity",
    timeAgo: "5h ago",
    timestamp: 1730541000000,
  },
  {
    id: "act-8",
    type: "deploy",
    icon: "🚀",
    label: "Deployed",
    color: "#00d4aa",
    project: "nexus-configurator",
    projectColor: "#8b5cf6",
    message: "deployed production to nexus-configurator.pages.dev",
    timeAgo: "8h ago",
    timestamp: 1730530000000,
  },
  {
    id: "act-9",
    type: "commit",
    icon: "💾",
    label: "Committed",
    color: "#8b5cf6",
    project: "max-portfolio",
    projectColor: "#00d4aa",
    message: "pushed 4 commits to feat/configurator-variants",
    timeAgo: "12h ago",
    timestamp: 1730515000000,
  },
  {
    id: "act-10",
    type: "issue",
    icon: "🐛",
    label: "Issue Solved",
    color: "#ef4444",
    project: "orbital-dashboard",
    projectColor: "#ec4899",
    message: "closed issue #89: optimized Three.js buffer memory deallocation",
    timeAgo: "1d ago",
    timestamp: 1730470000000,
  },
  {
    id: "act-11",
    type: "release",
    icon: "📦",
    label: "Released",
    color: "#ec4899",
    project: "pulse-analytics",
    projectColor: "#06b6d4",
    message: "released v1.3.0 — added Stripe webhook handler & billing portal",
    timeAgo: "1d ago",
    timestamp: 1730460000000,
  },
  {
    id: "act-12",
    type: "deploy",
    icon: "🚀",
    label: "Deployed",
    color: "#00d4aa",
    project: "astral-mint",
    projectColor: "#00d4aa",
    message: "deployed preview to astral-mint-staging.vercel.app",
    timeAgo: "2d ago",
    timestamp: 1730380000000,
  },
  {
    id: "act-13",
    type: "merge",
    icon: "🔀",
    label: "Merged PR",
    color: "#06b6d4",
    project: "radar-engine",
    projectColor: "#f59e0b",
    message: "merged PR #14: automated 3D hero pitch generation workflow",
    timeAgo: "2d ago",
    timestamp: 1730360000000,
  },
  {
    id: "act-14",
    type: "test",
    icon: "✅",
    label: "Tests Passed",
    color: "#22c55e",
    project: "nexus-configurator",
    projectColor: "#8b5cf6",
    message: "passed 182 3D mesh rendering & interaction matrix tests",
    timeAgo: "3d ago",
    timestamp: 1730280000000,
  },
  {
    id: "act-15",
    type: "commit",
    icon: "💾",
    label: "Committed",
    color: "#8b5cf6",
    project: "orbital-dashboard",
    projectColor: "#ec4899",
    message: "pushed 6 commits to feat/touch-gesture-controls",
    timeAgo: "4d ago",
    timestamp: 1730190000000,
  },
];

const LIVE_TEMPLATES = [
  { type: "deploy", icon: "🚀", label: "Deployed", color: "#00d4aa", project: "max-portfolio", projectColor: "#00d4aa", message: "hotfix: asset pipeline optimization live" },
  { type: "commit", icon: "💾", label: "Committed", color: "#8b5cf6", project: "radar-engine", projectColor: "#f59e0b", message: "pushed lead enrichment parser updates" },
  { type: "test", icon: "✅", label: "Tests Passed", color: "#22c55e", project: "nexus-configurator", projectColor: "#8b5cf6", message: "e2e visual parity check passed" },
  { type: "review", icon: "👁️", label: "Code Review", color: "#f59e0b", project: "max-portfolio", projectColor: "#00d4aa", message: "approved PR: hydration safety barrier" },
  { type: "perf", icon: "⚡", label: "Perf Audit", color: "#f97316", project: "orbital-dashboard", projectColor: "#ec4899", message: "WebGL frame time steady at 16.6ms (60 FPS)" },
];

export default function ActivityFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(STATIC_ACTIVITIES);
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format time ago for client-side live updates
  const formatTimeAgo = (timestamp: number, defaultTimeAgo: string) => {
    // Keep server and client initial render strictly identical to eliminate hydration mismatch (Error #418)
    if (!mounted) return defaultTimeAgo;
    const diff = Math.max(0, Date.now() - timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Simulate live updates only after client mounting
  useEffect(() => {
    if (!mounted || !liveMode) return;
    
    intervalRef.current = setInterval(() => {
      if (paused) return;
      
      const template = LIVE_TEMPLATES[Math.floor(Math.random() * LIVE_TEMPLATES.length)];
      const now = Date.now();
      const newActivity: Activity = {
        id: `live-${now}`,
        type: template.type,
        icon: template.icon,
        label: template.label,
        color: template.color,
        project: template.project,
        projectColor: template.projectColor,
        message: template.message,
        timeAgo: "just now",
        timestamp: now,
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 49)]);
    }, 12000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mounted, liveMode, paused]);

  const filteredActivities = useMemo(() => {
    if (filter === "all") return activities;
    return activities.filter(a => a.type === filter);
  }, [activities, filter]);

  const activityTypesList = useMemo(() => 
    Array.from(new Set(STATIC_ACTIVITIES.map(a => a.type))), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionHeader = sectionRef.current?.querySelector(".section-header");
      if (sectionHeader) {
        gsap.fromTo(
          sectionHeader,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
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
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filter]);

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
              Built with an autonomous rhythm. Every deploy, commit, review, and metric — visible, queryable, persistent.
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

          {/* Activities List */}
          <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
            {filteredActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-4 border-t border-border/50 bg-card/30 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Showing {filteredActivities.length} events</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${paused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
                {paused ? "Feed paused" : "Streaming live events"}
              </span>
            </div>
            <div>
              <span>Updated automatically via autonomous rhythm</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityItem({
  activity,
  formatTimeAgo,
}: {
  activity: Activity;
  formatTimeAgo: (timestamp: number, defaultTimeAgo: string) => string;
}) {
  return (
    <div className="activity-item grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-card/50 transition-colors">
      <time
        suppressHydrationWarning
        className="text-xs text-muted-foreground font-mono whitespace-nowrap self-center"
      >
        {formatTimeAgo(activity.timestamp, activity.timeAgo)}
      </time>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: activity.projectColor }}
        />
        <span className="text-sm font-medium truncate">{activity.project}</span>
      </div>
      <div className="flex items-center gap-1.5 self-center">
        <span>{activity.icon}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
          style={{
            backgroundColor: `${activity.color}20`,
            color: activity.color,
          }}
        >
          {activity.label}
        </span>
      </div>
      <div className="self-center text-right pr-6 text-sm text-foreground/80 truncate">
        {activity.message}
      </div>
    </div>
  );
}
