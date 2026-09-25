"use client";

import type { MouseEvent } from "react";
import { getLenis } from "../SmoothScroll";

// Ease-in-out so the drive pulls away from a standstill, cruises, then brakes
// into the next stop — Lenis' default anchor easing lurches and coasts instead.
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Props = { target: string; label?: string; direction?: "down" | "up"; className?: string };

export default function CheckpointAdvance({ target, label = "Continue to next stop", direction = "down", className }: Props) {
  const drive = (event: MouseEvent<HTMLAnchorElement>) => {
    const lenis = getLenis();
    if (!lenis) return; // reduced motion or pre-hydration: let the anchor jump
    event.preventDefault();
    lenis.scrollTo(target, { duration: 1.6, easing: easeInOutCubic });
  };

  return (
    <a href={target} onClick={drive} data-direction={direction} className={className ? `checkpoint-advance ${className}` : "checkpoint-advance"}>
      {label} <span>{direction === "up" ? "↑" : "→"}</span>
    </a>
  );
}
