"use client";

import { useEffect } from "react";

export default function MotionLayer() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6%" },
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => reveal.observe(el));
    if (reduced) return () => reveal.disconnect();

    // pointermove also fires for touch drags, so on a phone this ran on every
    // frame of a scroll — each call invalidates .pointer-glow's gradient and
    // repaints a full-screen layer. Pointer parallax is a fine-pointer feature.
    if (!window.matchMedia("(pointer: fine)").matches) {
      return () => reveal.disconnect();
    }

    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--drift-x", `${(event.clientX / innerWidth - 0.5) * 18}px`);
      root.style.setProperty("--drift-y", `${(event.clientY / innerHeight - 0.5) * 18}px`);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      reveal.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="ambient-orb ambient-orb-primary" />
      <div className="ambient-orb ambient-orb-accent" />
      <div className="pointer-glow" />
      <div className="scanline" />
    </div>
  );
}
