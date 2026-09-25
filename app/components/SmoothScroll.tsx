"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    instance = new Lenis({
      autoRaf: true,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      anchors: { duration: 1.35 },
    });

    return () => {
      instance?.destroy();
      instance = null;
    };
  }, []);

  return null;
}
