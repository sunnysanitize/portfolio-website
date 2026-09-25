"use client";

import { Children, useEffect, useRef, useState } from "react";

const AUTO_ROTATE_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function FeaturedProjectsCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children);
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  useEffect(() => {
    if (interacted || count <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [interacted, count]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      setInteracted(true);
      goTo(index + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  if (count === 0) return null;

  return (
    <div>
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === index}
              onClick={() => {
                setInteracted(true);
                goTo(i);
              }}
              className={`h-1 transition-all duration-300 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${
                i === index ? "w-6 bg-primary" : "w-2 bg-line"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
