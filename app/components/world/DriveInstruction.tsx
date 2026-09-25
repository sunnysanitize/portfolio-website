"use client";

import { useEffect, useState } from "react";

// The hint has done its job once the drive is underway, so retire it after the
// first stretch of scrolling and bring it back only at a standstill.
const FADE_AFTER = 0.12;

export default function DriveInstruction() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => setHidden(window.scrollY > window.innerHeight * FADE_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className={`drive-instruction ${hidden ? "is-hidden" : ""}`} aria-hidden={hidden}>
      <span className="mouse-icon" /> Scroll to accelerate
    </div>
  );
}
