"use client";

import { Bot, Code2, GraduationCap, Link2, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import Ferrofluid from "@/components/backgrounds/Ferrofluid";
import FloatingLines from "@/components/backgrounds/FloatingLines";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionInner, SectionLabel, SectionSub, SectionTitle } from "@/components/ui/Section";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  size: "lg" | "sm";
  bg?: "ferrofluid" | "lines";
};

// Order matters: with a 4-col bento grid, a sparse auto-placed 2x2 item
// lands top-right when preceded by two 1x1 cells, and a following 2x2 item
// lands bottom-left — see the two `size: "lg"` entries below.
const services: Service[] = [
  {
    icon: Zap,
    title: "Process Automation",
    description:
      "Eliminate repetitive workflows with intelligent automation. Connect your existing systems and let AI handle the heavy lifting 24/7.",
    tag: "Workflow AI →",
    size: "sm",
  },
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Custom web and mobile applications engineered for performance and built to scale. From MVPs to enterprise-grade platforms.",
    tag: "Custom Build →",
    size: "sm",
  },
  {
    icon: Bot,
    title: "Artificial Intelligence",
    description:
      "Custom AI agents, intelligent automations and enterprise copilots built on proven multi-agent architectures. Deploy in days, not months.",
    tag: "BGenAI Evolution →",
    size: "lg",
    bg: "ferrofluid",
  },
  {
    icon: GraduationCap,
    title: "AI Learning & Training",
    description:
      "Transform your training programs into immersive, AI-driven experiences. SCORM-compliant courses with avatars, quizzes and real-time coaching.",
    tag: "BTrAIn Platform →",
    size: "lg",
    bg: "lines",
  },
  {
    icon: Link2,
    title: "Web3 & Blockchain",
    description:
      "Smart contracts, tokenization, and decentralized applications. We bridge emerging blockchain technologies with real business use cases.",
    tag: "Web3 Ready →",
    size: "sm",
  },
  {
    icon: ShieldCheck,
    title: "IT Outsourcing",
    description:
      "Dedicated tech teams and on-demand specialists. Extend your capabilities without the overhead — aligned to your timezone and culture.",
    tag: "Dedicated Team →",
    size: "sm",
  },
];

// Read from the CSS variables so the shader colors trace back to the single
// source of truth in globals.css instead of a new hardcoded palette.
function readPaletteHex(varName: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

export function Services() {
  const reduceMotion = useReducedMotion();
  const palette = useMemo(
    () => ({
      primary: readPaletteHex("--color-primary", "#F75D00"),
      secondary: readPaletteHex("--color-secondary", "#C52126"),
      accent: readPaletteHex("--color-accent", "#662D91"),
    }),
    [],
  );

  return (
    <Section id="services" tone="muted">
      <SectionInner>
        <SectionLabel>What We Do</SectionLabel>
        <SectionTitle>
          Technology Solutions
          <br />
          Built for Scale
        </SectionTitle>
        <SectionSub>
          From AI automation to full digital transformation — we deliver
          end-to-end solutions that drive measurable results for US
          businesses.
        </SectionSub>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[360px]">
          {services.map(({ icon: Icon, title, description, tag, size, bg }) => {
            const isLarge = size === "lg";
            return (
              <RevealItem
                key={title}
                as="article"
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-light p-8 shadow-[0_10px_30px_rgba(247,93,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(247,93,0,0.16)] ${
                  isLarge ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div>
                  <div
                    className={`flex items-center justify-center rounded-xl bg-primary/[0.06] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-light ${
                      isLarge ? "mb-5 h-16 w-16" : "mb-4 h-10 w-10"
                    }`}
                  >
                    <Icon className={isLarge ? "h-7 w-7" : "h-5 w-5"} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className={`mb-2.5 font-semibold text-ink ${isLarge ? "text-[1.35rem]" : "text-[1.1rem]"}`}>
                    {title}
                  </h3>
                  <p className={`leading-relaxed text-dark/60 ${isLarge ? "text-[0.98rem]" : "text-[0.92rem]"}`}>
                    {description}
                  </p>
                </div>

                {bg && (
                  <div className="hidden overflow-hidden rounded-2xl bg-linear-to-br from-accent/20 to-secondary/[0.14] lg:my-5 lg:block lg:flex-1">
                    {bg === "ferrofluid" && (
                      <Ferrofluid
                        colors={[palette.accent, palette.secondary, palette.primary]}
                        speed={reduceMotion ? 0 : 0.35}
                        scale={1.7}
                        turbulence={0.8}
                        fluidity={0.16}
                        rimWidth={0.22}
                        sharpness={3.2}
                        shimmer={0.8}
                        glow={1.9}
                        opacity={0.85}
                        flowDirection="right"
                        mouseInteraction={!reduceMotion}
                        mouseStrength={1.1}
                        mouseRadius={0.4}
                        mouseDampening={0.18}
                      />
                    )}
                    {bg === "lines" && (
                      <FloatingLines
                        color1={palette.accent}
                        color2={palette.primary}
                        lightMode={false}
                        animationSpeed={reduceMotion ? 0 : 0.7}
                        enabledWaves={["top", "middle", "bottom"]}
                        lineCount={9}
                        lineDistance={3.2}
                        interactive={!reduceMotion}
                        parallax={!reduceMotion}
                        parallaxStrength={0.15}
                        mouseDamping={0.08}
                      />
                    )}
                  </div>
                )}

                <span
                  className={`inline-block text-[0.75rem] font-bold uppercase tracking-[0.06em] text-secondary ${isLarge ? "mt-5" : "mt-4"}`}
                >
                  {tag}
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </SectionInner>
    </Section>
  );
}
