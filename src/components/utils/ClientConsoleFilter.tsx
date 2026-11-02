"use client";

import { useEffect } from "react";

// Filter out upstream library deprecation notices that pollute the console
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("THREE.Clock: This module has been deprecated") ||
      msg.includes("THREE.Clock") ||
      msg.includes("using deprecated parameters for the initialization function") ||
      msg.includes("feature_collector.js")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export default function ClientConsoleFilter() {
  useEffect(() => {
    // Ensuring console filter is active on client
  }, []);
  return null;
}
