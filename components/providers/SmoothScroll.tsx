"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        // lerp 1 = no smoothing (instant), used for reduced-motion users.
        lerp: reduce ? 1 : 0.1,
        duration: 1.1,
        smoothWheel: !reduce,
      }}
    >
      {children}
    </ReactLenis>
  );
}
