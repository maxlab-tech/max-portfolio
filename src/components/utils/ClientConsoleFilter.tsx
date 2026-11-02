"use client";

import { useEffect } from "react";

// Filter out upstream library deprecation notices that pollute the console
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const msg = args[0];
    if (
      typeof msg === "string" &&
      (msg.includes("THREE.Clock: This module has been deprecated") ||
        msg.includes("THREE.Clock"))
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
