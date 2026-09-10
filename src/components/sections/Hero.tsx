"use client";

import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import Grainient from "@/components/backgrounds/Grainient";

// useLayoutEffect on the client (so the hidden start is applied before the
// browser paints — no flash of the final text), useEffect on the server to
// avoid React's SSR warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const trustItems = ["AI-Powered Solutions", "Enterprise Ready", "US-Based Support"];

// Convex radius for the panel's top-left corner — the one interior corner
// that faces the blue. A normal rounded corner on an opaque box, so nothing
// behind it can leak; it bulges toward the blue instead of scooping in.
const RADIUS = 40;
// Bottom-right corner radius, used only by the canvas wrapper — see the note
// on the bridge panel below for why the panel itself deliberately stays
// square there instead of matching it.
const RADIUS_BR = 50;
// The panel overhangs the card's right/bottom edges by this much, and is
// UNCLIPPED — it's free to spill past the card into the page margin, which is
// invisible since both are bg-main-bg. The padding added back on those sides
// keeps its inner content where it was.
const OVERHANG = 24;

// Palette tokens as hex, read from the CSS variables so this still traces
// back to the single source of truth in globals.css instead of a new
// hardcoded set of colors just for the shader.
function readPaletteHex(varName: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
}

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [reduceMotion, setReduceMotion] = useState(false);
    const palette = useMemo(
        () => ({
            accent: readPaletteHex("--color-accent", "#3895D3"),
            secondary: readPaletteHex("--color-secondary", "#1261A0"),
            primary: readPaletteHex("--color-primary", "#072F5F"),
        }),
        [],
    );

    // One-shot intro reveal. We deliberately DO NOT use useGSAP / a
    // revert-on-cleanup context here: under React StrictMode (on by default in
    // Next dev) an effect mounts, is torn down, and remounts, and the revert of
    // that first teardown interleaves with the second run in a way that left the
    // first masked line frozen at its hidden start (translateY 120%) — the
    // exact bug we were chasing. Instead we run the timeline exactly once
    // (guarded by a ref) and never revert it, so nothing can poison the tween.
    // The hero never unmounts, so there's nothing to clean up in practice.
    const introRan = useRef(false);
    useIsoLayoutEffect(() => {
        if (introRan.current) return;
        introRan.current = true;

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduceMotion(media.matches);

        const lines = gsap.utils.toArray<HTMLElement>("[data-mask-line] > span");
        const fades = gsap.utils.toArray<HTMLElement>("[data-fade]");
        const pulseTarget = containerRef.current?.querySelector<HTMLElement>("[data-pulse]");

        // Reduced motion: leave everything in its natural (visible) resting state.
        if (media.matches) return;

        // Very subtle "heartbeat" on the emphasized headline word — a slow,
        // gentle breath every few seconds, not a constant loop.
        if (pulseTarget) {
            gsap
                .timeline({ repeat: -1, repeatDelay: 4.5, delay: 2 })
                .to(pulseTarget, { scale: 1.012, duration: 1.4, ease: "sine.inOut" })
                .to(pulseTarget, { scale: 1, duration: 1.4, ease: "sine.inOut" });
        }

        // Hide first (applied before paint via the layout effect), then reveal.
        gsap.set(lines, { yPercent: 120 });
        gsap.set(fades, { y: 22, autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(lines, {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.14,
            delay: 0.15,
            clearProps: "transform",
        }).to(
            fades,
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.08,
                // Settle to the natural, fully-visible resting state so no inline
                // opacity/visibility can ever leave an element stuck hidden.
                clearProps: "opacity,visibility,transform",
            },
            "-=0.65",
        );
    }, []);

    return (
        <section
            id="top"
            className="relative flex min-h-dvh flex-col bg-main-bg px-4 pb-4 pt-24 md:px-14 md:pb-14 md:pt-14"
        >
            <div ref={containerRef} className="relative flex flex-1 flex-col">
                {/* The canvas wrapper and the bridge panel below each carry their
                    OWN border-radius and clip themselves independently, rather
                    than this outer container clipping both to a shared curve.
                    The WebGL canvas is its own GPU-compositing layer, painted via
                    a different path than the panel's plain DOM paint; clipping
                    both to one ancestor curve left their antialiasing 1px out of
                    step at the bottom-right corner, leaking a faint sliver of the
                    gradient through the "opaque" panel. Two independently-clipped,
                    self-contained shapes removes the shared curve entirely. */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ borderRadius: RADIUS, borderBottomRightRadius: RADIUS_BR }}
                >
                    <Grainient
                        color1={palette.accent}
                        color2={palette.secondary}
                        color3={palette.primary}
                        timeSpeed={reduceMotion ? 0 : 0.55}
                        warpSpeed={reduceMotion ? 0 : 3.6}
                        warpFrequency={3.5}
                        warpAmplitude={38}
                        blendSoftness={0.28}
                        rotationAmount={650}
                        zoom={1.15}
                        contrast={1.32}
                        saturation={1.12}
                        grainAmount={0.07}
                        grainScale={2.2}
                        grainAnimated={!reduceMotion}
                    />
                </div>

                <div className="relative z-10 flex flex-1 flex-col justify-center gap-10 px-6 pb-28 pt-10 sm:px-10 sm:pb-10 md:px-14 lg:px-20">
                    <div className="max-w-[820px]">
                        <p
                            data-fade
                            className="mb-5 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-light/70"
                        >
                            Bizit Global Official US Partner
                        </p>

                        <h1 className="mb-7 text-[clamp(2.3rem,6.2vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-light">
                            <span data-mask-line className="block overflow-hidden">
                                <span className="block">
                                    Where{" "}
                                    <span
                                        data-pulse
                                        className="inline-block origin-left text-[1.12em] font-bold"
                                    >
                                        AI Intelligence
                                    </span>
                                </span>
                            </span>
                            <span data-mask-line className="block overflow-hidden">
                                <span className="block">Meets Business Growth</span>
                            </span>
                        </h1>

                        <p data-fade className="max-w-[560px] text-[1.1rem] font-light leading-relaxed text-light">
                            We bring enterprise-grade AI automation, intelligent agents, and
                            digital transformation solutions to US businesses — backed by
                            Bizit Global&rsquo;s proven technology ecosystem.
                        </p>

                        <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
                            <Button href="#contact" variant="primary">
                                Schedule a Free Demo →
                            </Button>
                            <Button href="#products" variant="inverse">
                                Explore Our Products
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bridge panel — one opaque off-white box in the bottom-right.
                    Its top-left corner (the one facing the blue) is a normal
                    convex rounded corner. Its bottom-right corner is deliberately
                    left SQUARE and UNCLIPPED, overhanging past the card's own
                    edges: since the panel is the same bg-main-bg as the page
                    behind it, the square corner poking out is invisible. This
                    way the panel's opaque pixels fully blanket the canvas's own
                    rounded corner with no rounding of its own to antialias —
                    only the canvas's single, clean, isolated curve is ever
                    visible (rounding the SAME curve twice, on two separately
                    painted layers, is what left a 1px sliver of the gradient
                    showing through before). */}
                <div
                    className="absolute z-20 bg-main-bg"
                    style={{
                        borderTopLeftRadius: RADIUS,
                        bottom: -OVERHANG,
                        right: -OVERHANG,
                        paddingRight: OVERHANG,
                        paddingBottom: OVERHANG,
                    }}
                >
                    <div className="pb-4 pl-8 pr-5 pt-6 sm:pb-6 sm:pl-16 sm:pr-10 sm:pt-8">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8">
                            {trustItems.map((item) => (
                                <span key={item} className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-dark/75 sm:text-[0.9rem]">
                                    <ArrowUpRight className="h-4 w-4 text-secondary" strokeWidth={2.25} aria-hidden="true" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}