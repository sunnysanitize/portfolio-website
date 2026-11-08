"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Line drawings in the page margins: concentric circles and spokes pushed
 * through A(t) = (1 − t)I + tA as the reader scrolls, so the circles become
 * tilting ellipses. Every A(t) shares A's eigenvectors, so the dashed lines
 * stay fixed while everything else moves around them.
 *
 * There are two copies, one centred on the right edge and one in the
 * bottom-left corner. Each is sized to its margin so it never reaches the
 * text column.
 */

// A = [[a, b], [c, d]] in math coordinates (y up).
const A = { a: 1.2, b: 0.4, c: 0.2, d: 0.9 };

const RINGS = [1, 2, 3, 4];
const SPOKES = 12; // rays through the origin, every 30°
const MARK_AT = 3; // ring on which the images of ±î and ±ĵ are marked
// Upper bound on how far A(t) stretches any vector (largest singular value of
// A, rounded up), so the outer ring's image is known to fit the margin.
const MAX_STRETCH = 1.5;
const EXTENT = RINGS[RINGS.length - 1] * MAX_STRETCH; // in units
const TEXT_COLUMN = 864; // 54rem, the width of the content column
const GAP = 24; // clearance between the drawing and the text
const MIN_UNIT = 28; // below this the drawing is too small to read; hide it
const T_MIN = 0.15; // a little warp is visible even at the top of the page
const T_STILL = 0.6; // fixed t when the reader prefers reduced motion

/** Unit directions of A's real eigenvectors, in math coordinates. */
function eigenDirections(): [number, number][] {
  const { a, b, c, d } = A;
  const tr = a + d;
  const root = Math.sqrt(tr * tr - 4 * (a * d - b * c));
  return [(tr + root) / 2, (tr - root) / 2].map((lambda) => {
    const [x, y] = Math.abs(b) > 1e-9 ? [b, lambda - a] : [lambda - d, c];
    const len = Math.hypot(x, y);
    return [x / len, y / len];
  });
}

const EIGEN = eigenDirections();
const BASIS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

type Layout = { unit: number; origins: [number, number][] };

function layout(): Layout | null {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = (w - TEXT_COLUMN) / 2;
  const unit = Math.min(90, (margin - GAP) / EXTENT);
  if (unit < MIN_UNIT) return null;
  return {
    unit,
    origins: [
      [w, h * 0.38], // right edge: half the drawing shows
      [0, h], // bottom-left corner: a quarter shows
    ],
  };
}

export default function BackgroundPlane() {
  const planeRefs = useRef<(SVGGElement | null)[]>([]);
  const markRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [geo, setGeo] = useState<Layout | null>(null);

  useEffect(() => {
    const place = () => setGeo(layout());
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  useEffect(() => {
    if (!geo) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const draw = () => {
      frame = 0;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const progress = room > 0 ? Math.min(1, window.scrollY / room) : 0;
      const t = still ? T_STILL : T_MIN + (1 - T_MIN) * progress;
      const a = 1 - t + t * A.a;
      const b = t * A.b;
      const c = t * A.c;
      const d = 1 - t + t * A.d;

      geo.origins.forEach(([ox, oy], f) => {
        // SVG's y axis points down, so conjugate A(t) by diag(1, −1). The
        // rings are drawn in units, so the scale goes in the same matrix.
        const u = geo.unit;
        planeRefs.current[f]?.setAttribute(
          "transform",
          `matrix(${a * u} ${-c * u} ${-b * u} ${d * u} ${ox} ${oy})`,
        );

        // The marks stay round, so they are positioned rather than transformed.
        BASIS.forEach(([x, y], n) => {
          const mark = markRefs.current[f * BASIS.length + n];
          if (!mark) return;
          const r = MARK_AT * u;
          mark.setAttribute("cx", String(ox + (a * x + b * y) * r));
          mark.setAttribute("cy", String(oy - (c * x + d * y) * r));
        });
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    draw();
    if (still) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [geo]);

  if (!geo) return null;

  const reach = EXTENT * geo.unit;
  const ring = RINGS[RINGS.length - 1];

  return (
    <svg className="background-plane" aria-hidden="true">
      {geo.origins.map(([ox, oy], f) => {
        const segment = (dx: number, dy: number) => ({
          x1: ox - dx * reach,
          y1: oy + dy * reach,
          x2: ox + dx * reach,
          y2: oy - dy * reach,
        });
        return (
          <g key={f}>
            {/* The untouched axes, for reference. */}
            <line className="bp-axis" {...segment(1, 0)} />
            <line className="bp-axis" {...segment(0, 1)} />

            <g
              ref={(el) => {
                planeRefs.current[f] = el;
              }}
              className="bp-plane"
            >
              {RINGS.map((k) => (
                <circle key={k} r={k} vectorEffect="non-scaling-stroke" />
              ))}
              {Array.from({ length: SPOKES / 2 }, (_, n) => {
                const angle = (n * Math.PI) / (SPOKES / 2);
                const dx = Math.cos(angle) * ring;
                const dy = Math.sin(angle) * ring;
                return (
                  <line
                    key={n}
                    x1={-dx}
                    y1={-dy}
                    x2={dx}
                    y2={dy}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </g>

            {EIGEN.map(([dx, dy], n) => (
              <line key={n} className="bp-eigen" {...segment(dx, dy)} />
            ))}

            {BASIS.map((_, n) => (
              <circle
                key={n}
                ref={(el) => {
                  markRefs.current[f * BASIS.length + n] = el;
                }}
                className="bp-mark"
                r={4.5}
              />
            ))}
            <circle className="bp-origin" cx={ox} cy={oy} r={3} />
          </g>
        );
      })}
    </svg>
  );
}
