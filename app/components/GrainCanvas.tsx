"use client";

import { useEffect, useRef } from "react";

/**
 * Animated film-grain layer, inspired by n1.xyz's fixed `<canvas id="noise">`.
 * Redraws monochrome luminance noise at a throttled frame rate to get a living,
 * flickering grain on top of the static feTurbulence overlay (see globals.css).
 *
 * Performance: backing store is capped at DPR 1 and the noise is only regenerated
 * a few times per second. Honors prefers-reduced-motion (renders a single frame).
 */
export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let imageData: ImageData | null = null;
    let rafId = 0;
    let lastDraw = 0;
    const FRAME_MS = 70; // ~14fps — classic film-grain flicker, easy on the CPU

    const resize = () => {
      // Grain doesn't need retina; cap at DPR 1 to keep the per-pixel loop cheap.
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);
      canvas.width = w;
      canvas.height = h;
      imageData = ctx.createImageData(w, h);
    };

    const draw = () => {
      if (!imageData) return;
      const data = imageData.data;
      // Biased near-black grayscale (0–22). Under screen blend the dark pixels
      // leave the dark background untouched and only the occasional brighter
      // speck flickers through — a subtle film shimmer on the dark theme.
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 22) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    resize();

    if (reduceMotion) {
      draw(); // single static frame, no animation loop
    } else {
      const loop = (now: number) => {
        if (now - lastDraw >= FRAME_MS) {
          draw();
          lastDraw = now;
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduceMotion) draw();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      style={{ opacity: 0.5, mixBlendMode: "screen" }}
    />
  );
}
