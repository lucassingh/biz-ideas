"use client";

import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { onHashLinkClick } from "@/lib/hashLink";

/**
 * Adapted from react-bits' CardNav (https://reactbits.dev/components/card-nav),
 * TS + Tailwind variant. Changes from the original:
 *  - `logo` takes a ReactNode instead of an <img> src, so our inline SVG
 *    wordmark can inherit its color from the theme via `currentColor`.
 *  - the hardcoded "Get Started" CTA button is now a configurable <a>
 *    (`ctaLabel` / `ctaHref`), matching the mock's "Book a Call →" link.
 *  - swapped react-icons' GoArrowUpRight for lucide-react's ArrowUpRight.
 *  - the nav is `fixed` (not `absolute`) so it stays pinned while scrolling.
 */

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: ReactNode;
  items: CardNavItem[];
  ctaLabel: string;
  ctaHref: string;
  className?: string;
  ease?: string;
  /** Fill while the page is at the very top — meant to match the page
   *  background so the bar reads as "open"/masked into it (no border, no shadow). */
  baseColor?: string;
  /** Fill once the page is scrolled — the bar "closes" into a distinct pill. */
  scrolledColor?: string;
  menuColor?: string;
  /** Tailwind classes for the CTA button — lets callers wire up a real hover state (inline styles can't). */
  ctaClassName?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  items,
  ctaLabel,
  ctaHref,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  scrolledColor = "#ffffff",
  menuColor,
  ctaClassName = "",
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // Track whether the page has scrolled away from the top, to swap the bar
  // between its "open" (blended into the page bg) and "closed" (solid pill)
  // looks. Threshold of a few px so a resting page is unambiguously "top".
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        void contentEl.offsetHeight; // force a reflow so scrollHeight below is accurate

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, "-=0.1");

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const closeMenu = () => {
    if (!isExpanded) return;
    toggleMenu();
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // sync to the current position on mount (e.g. reload mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-1/2 top-[1.2em] z-[99] w-[90%] max-w-[900px] -translate-x-1/2 md:top-[1.5em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${
          isExpanded ? "open" : ""
        } relative block h-[60px] overflow-hidden rounded-2xl p-0 ring-1 transition-[background-color,box-shadow] duration-300 will-change-[height] ${
          scrolled
            ? "shadow-[0_8px_40px_rgba(247,93,0,0.12)] ring-dark/[0.06]"
            : "shadow-none ring-transparent"
        }`}
        style={{ backgroundColor: scrolled ? scrolledColor : baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 pl-[1.1rem]">
          <a
            href="#top"
            onClick={(e) => onHashLinkClick(e, "#top")}
            className="logo-container order-1 flex items-center md:absolute md:left-1/2 md:top-1/2 md:order-none md:-translate-x-1/2 md:-translate-y-1/2"
            aria-label="BizIdeas+ — back to top"
          >
            {logo}
          </a>

          <a
            href={ctaHref}
            onClick={(e) => onHashLinkClick(e, ctaHref)}
            className={`card-nav-cta-button order-2 hidden h-full cursor-pointer items-center rounded-[calc(1rem-0.2rem)] px-5 font-medium transition-colors duration-300 md:inline-flex ${ctaClassName}`}
          >
            {ctaLabel}
          </a>

          <div
            className={`hamburger-menu ${
              isHamburgerOpen ? "open" : ""
            } group order-3 flex h-full cursor-pointer flex-col items-center justify-center gap-[6px] md:order-none`}
            onClick={toggleMenu}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={`hamburger-line h-[2px] w-[26px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line h-[2px] w-[26px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>
        </div>

        <div
          className={`card-nav-content absolute inset-x-0 bottom-0 top-[60px] z-[1] flex flex-col items-stretch justify-start gap-2 p-2 md:flex-row md:items-end md:gap-3 ${
            isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"
          }`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => {
            // Each card links to exactly one section, so the whole box is
            // the click target (not just the small link line at the
            // bottom) — a full-cover anchor sits under the visible content.
            const link = item.links?.[0];
            return (
              <div
                key={`${item.label}-${idx}`}
                className="nav-card relative flex h-auto min-h-[60px] min-w-0 flex-[1_1_auto] select-none flex-col gap-2 rounded-xl p-[12px_16px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
                ref={setCardRef(idx)}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                {link && (
                  <a
                    className="absolute inset-0 z-1 rounded-xl"
                    href={link.href}
                    aria-label={link.ariaLabel}
                    onClick={(e) => {
                      onHashLinkClick(e, link.href);
                      closeMenu();
                    }}
                  />
                )}
                <div className="nav-card-label text-[17px] font-medium tracking-[-0.01em] md:text-[20px]">
                  {item.label}
                </div>
                <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                  {link && (
                    <span className="nav-card-link inline-flex items-center gap-[6px] text-[14px] opacity-90 transition-opacity duration-300 md:text-[15px]">
                      <ArrowUpRight className="nav-card-link-icon h-[15px] w-[15px] shrink-0" aria-hidden="true" />
                      {link.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
