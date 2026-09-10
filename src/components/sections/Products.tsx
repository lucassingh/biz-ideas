"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain, BookOpen, Mic, Pause, Play, Settings2, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionInner, SectionLabel, SectionSub, SectionTitle } from "@/components/ui/Section";

type Product = {
    icon: LucideIcon;
    badge: string;
    badgeClass: string;
    name: string;
    description: string;
    features: string[];
    linkLabel: string;
};

const products: Product[] = [
    {
        icon: Brain,
        badge: "AI Platform",
        badgeClass: "bg-primary/[0.08] text-primary",
        name: "BGenAI Evolution",
        description:
            "A multi-agent AI ecosystem that transforms every business department — HR, Sales, Finance, Operations — into an AI-powered unit. No code required.",
        features: [
            "Intelligent AI agents per business area",
            "Custom knowledge base integration",
            "Real-time Odoo / CRM connectivity",
            "Voice AI with ElevenLabs + Twilio",
            "Unlimited automations & workflows",
        ],
        linkLabel: "Learn more →",
    },
    {
        icon: BookOpen,
        badge: "Learning Tech",
        badgeClass: "bg-secondary/[0.1] text-secondary",
        name: "BTrAIn",
        description:
            "The AI-powered course factory. Generate interactive SCORM courses with avatars, quizzes and decision scenarios — deploy to any LMS in hours.",
        features: [
            "SCORM-compliant output (Moodle, Odoo, Canvas)",
            "Talking AI avatars & voice narration",
            "Decision trees & scenario-based learning",
            "Multilingual content generation",
            "Integrated AI coaching companion",
        ],
        linkLabel: "Learn more →",
    },
    {
        icon: Settings2,
        badge: "Operations",
        badgeClass: "bg-dark/[0.05] text-dark/70",
        name: "ODIS",
        description:
            "Operational claims management platform with a structured 6-layer workflow. From intake to resolution — every step tracked, audited and optimized.",
        features: [
            "Automated claim intake & triage",
            "6-layer operational pipeline",
            "Real-time KPI dashboards",
            "AI-assisted resolution suggestions",
            "Full audit trail & reporting",
        ],
        linkLabel: "Learn more →",
    },
    {
        icon: Mic,
        badge: "Voice AI · New",
        badgeClass: "bg-accent text-light",
        name: "Voice AI Agents",
        description:
            "AI-powered phone agents that handle inbound calls, qualify leads and book appointments — 24/7, in English or Spanish, indistinguishable from human.",
        features: [
            "ElevenLabs ultra-realistic voices",
            "Twilio telephony for US numbers",
            "Live CRM & calendar integration",
            "Outbound campaign automation",
            "~$0.08/min fully operational",
        ],
        linkLabel: "Early access →",
    },
];

const AUTOPLAY_DELAY = 6000;
const MOBILE_BREAKPOINT = 640;
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

/** Same breakpoint the rest of the carousel's motion uses — on mobile the slide enters/exits
 * vertically instead of horizontally. */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        const update = () => setIsMobile(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    return isMobile;
}

export function Products() {
    const reduceMotion = useReducedMotion();
    const isMobile = useIsMobile();
    const [activeIndex, setActiveIndex] = useState(0);
    const [playing, setPlaying] = useState(true);

    const goTo = useCallback((i: number) => {
        setActiveIndex((prev) => (prev === i ? prev : i));
    }, []);

    const handleAutoAdvance = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % products.length);
    }, []);

    const active = products[activeIndex];
    const Icon = active.icon;
    const autoplayOn = !reduceMotion;
    const offAxis = isMobile ? { y: 24 } : { x: 24 };
    const onAxisExit = isMobile ? { y: -24 } : { x: -24 };

    return (
        <Section id="products" tone="muted">
            <SectionInner>
                <SectionLabel>Our Products</SectionLabel>
                <SectionTitle>
                    The Bizit Global
                    <br />
                    Product Suite
                </SectionTitle>
                <SectionSub>Proven platforms used across Latin America — now available for US businesses through BizIdeas+.</SectionSub>
            </SectionInner>

            <Reveal className="mx-auto mt-6 max-w-[1500px] px-6 sm:px-8 lg:px-10">
                <div className="overflow-hidden rounded-[28px] bg-light p-4 shadow-[0_20px_60px_rgba(7,47,95,0.12)] sm:p-12 lg:p-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.name}
                            initial={reduceMotion ? undefined : { opacity: 0, ...offAxis }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, ...onAxisExit }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="grid gap-10 lg:grid-cols-2 lg:items-center"
                        >
                            <div>
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/[0.06] text-primary">
                                    <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
                                </div>
                                <span
                                    className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] ${active.badgeClass}`}
                                >
                                    {active.badge}
                                </span>
                                <h3 className="mb-4 text-[2rem] font-bold tracking-tight text-primary sm:text-[2.2rem]">
                                    {active.name}
                                </h3>
                                <p className="mb-7 text-[1rem] leading-relaxed text-dark/60">{active.description}</p>
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-secondary transition-opacity hover:opacity-70"
                                >
                                    {active.linkLabel}
                                </a>
                            </div>

                            <ul className="flex flex-col gap-3">
                                {active.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 rounded-xl bg-main-bg px-4 py-3.5 text-[0.92rem] text-dark/75"
                                    >
                                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-15 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2" role="group" aria-label="Ir a un producto específico">
                        {products.map((product, i) => (
                            <button
                                key={product.name}
                                type="button"
                                aria-label={`Producto ${i + 1} de ${products.length}`}
                                aria-current={i === activeIndex ? "true" : undefined}
                                onClick={() => goTo(i)}
                                className={`relative h-2 shrink-0 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${i === activeIndex ? "w-10 bg-primary/15" : "w-2 bg-primary/25"
                                    }`}
                            >
                                {i === activeIndex &&
                                    (autoplayOn ? (
                                        <span
                                            key={activeIndex}
                                            className="absolute inset-0 rounded-full bg-primary"
                                            style={{
                                                transformOrigin: "left center",
                                                animationName: "bizProductFill",
                                                animationTimingFunction: "linear",
                                                animationFillMode: "forwards",
                                                animationDuration: `${AUTOPLAY_DELAY}ms`,
                                                animationPlayState: playing ? "running" : "paused",
                                            }}
                                            onAnimationEnd={handleAutoAdvance}
                                        />
                                    ) : (
                                        <span className="absolute inset-0 rounded-full bg-primary" />
                                    ))}
                            </button>
                        ))}
                    </div>
                    {autoplayOn && (
                        <button
                            type="button"
                            onClick={() => setPlaying((p) => !p)}
                            aria-label={playing ? "Pausar" : "Reproducir"}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-colors duration-300 hover:bg-primary hover:text-light"
                        >
                            {playing ? (
                                <Pause className="h-3 w-3" strokeWidth={0} fill="currentColor" aria-hidden="true" />
                            ) : (
                                <Play className="h-3 w-3" strokeWidth={0} fill="currentColor" aria-hidden="true" />
                            )}
                        </button>
                    )}
                </div>
            </Reveal>

            <style>{`
        @keyframes bizProductFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
        </Section>
    );
}
