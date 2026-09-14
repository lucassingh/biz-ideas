"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Beams from "@/components/backgrounds/Beams";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const RADIUS = 40;
const GAP_MOBILE = 16; // px — matches the old p-4
const GAP_DESKTOP = 56; // px — matches the old md:p-14
// Floor for the entering/leaving edges, as a fraction of the resting gap and
// radius — keeps the box big while off-center, but never lets it go fully
// edge-to-edge/square. Matches the look right before the section leaves the
// viewport, which read better than a hard flush edge.
const EDGE_RATIO = 0.3;

// Palette tokens as hex, read from the CSS variables — same pattern Hero uses
// so the shader still traces back to the single source of truth in
// globals.css instead of a new hardcoded palette.
function readPaletteHex(varName: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

export function CTA() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [gapTarget, setGapTarget] = useState(GAP_MOBILE);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const sync = () => setGapTarget(mql.matches ? GAP_DESKTOP : GAP_MOBILE);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const palette = useMemo(
    () => ({
      accent: readPaletteHex("--color-accent", "#662D91"),
      primary: readPaletteHex("--color-primary", "#F75D00"),
    }),
    [],
  );

  // Scroll-expand, run in reverse: big while the section is entering or
  // leaving, shrinking to the resting padded/rounded look right as it's
  // centered in the viewport (progress 0.5). Same idea as
  // https://reactbits.dev/animations/scroll-expand. Output ranges collapse
  // to a constant when reduced motion is requested, so the hook order stays
  // stable while the section just sits in its resting state.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 210, damping: 38, mass: 1 });
  const edgeGap = gapTarget * EDGE_RATIO;
  const edgeRadius = RADIUS * EDGE_RATIO;
  const gap = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    reduceMotion ? [gapTarget, gapTarget, gapTarget] : [edgeGap, gapTarget, edgeGap],
  );
  const radius = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    reduceMotion ? [RADIUS, RADIUS, RADIUS] : [edgeRadius, RADIUS, edgeRadius],
  );

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-dvh flex-col bg-main-bg"
      style={{ padding: gap }}
    >
      <motion.div className="relative flex flex-1 flex-col overflow-hidden" style={{ borderRadius: radius }}>
        <motion.div className="absolute inset-0 overflow-hidden" style={{ borderRadius: radius }}>
          <Beams
            backgroundColor={palette.accent}
            beamColor={palette.primary}
            beamNumber={29}
            beamHeight={24}
            beamWidth={3.4}
            rotation={126}
            scale={0.22}
            noiseIntensity={2.1}
            speed={reduceMotion ? 0 : 2}
          />
        </motion.div>

        <Reveal className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-10">
          <h2 className="max-w-[900px] text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.05] tracking-tight text-light">
            Ready to Transform
            <br />
            Your Business with AI?
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[1.1rem] leading-relaxed text-light/85">
            Book a no-obligation discovery call. In 45 minutes we&rsquo;ll show you exactly what&rsquo;s possible —
            and what it takes to get there.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="mailto:info@bizideasplus.com" variant="inverse">
              Schedule a Free Call →
            </Button>
            <Button href="#products" variant="outline-light">
              View Our Products
            </Button>
          </div>
        </Reveal>
      </motion.div>
    </motion.section>
  );
}
