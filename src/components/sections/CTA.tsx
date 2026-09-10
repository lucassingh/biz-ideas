"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import Beams from "@/components/backgrounds/Beams";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const RADIUS = 40;

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
  const palette = useMemo(
    () => ({
      accent: readPaletteHex("--color-accent", "#3895D3"),
      primary: readPaletteHex("--color-primary", "#072F5F"),
    }),
    [],
  );

  return (
    <section id="contact" className="relative flex min-h-dvh flex-col bg-main-bg p-4 md:p-14">
      <div className="relative flex flex-1 flex-col overflow-hidden" style={{ borderRadius: RADIUS }}>
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: RADIUS }}>
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
        </div>

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
      </div>
    </section>
  );
}
