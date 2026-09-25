"use client";

import { useEffect, useState } from "react";

const stops = ["Identity", "Experience", "Research", "Projects", "Contact"];

export default function DriveHUD() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(next);
      setActive(Math.min(stops.length - 1, Math.round(next * (stops.length - 1))));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <aside className="drive-hud" aria-label="Journey progress">
      <div className="drive-hud-copy">
        <span>SYS / AUTODRIVE</span><span className="text-accent">ONLINE</span>
      </div>
      <div className="drive-route">
        <span className="drive-route-fill" style={{ transform: `scaleY(${progress})` }} />
        {stops.map((stop, index) => <a key={stop} href={`#stop-${index}`} className={index === active ? "is-active" : ""} aria-label={`Go to ${stop}`}><span /><b>{stop}</b></a>)}
      </div>
    </aside>
  );
}
