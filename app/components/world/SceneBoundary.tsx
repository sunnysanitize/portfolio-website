"use client";

import { Component, type ReactNode } from "react";

/**
 * Keeps a WebGL failure contained to the 3D layer.
 *
 * three.js is WebGL2-only since r163, so constructing the renderer throws
 * outright on machines with hardware acceleration off or a blocklisted GPU
 * driver. That throw escapes <Canvas> while React is committing, and with no
 * boundary above it React unmounts the whole page — the visitor gets Next's
 * generic "a client-side exception has occurred" screen instead of a
 * portfolio. The drive is decoration, so a lost context should cost the
 * decoration and nothing else.
 */
export default class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
