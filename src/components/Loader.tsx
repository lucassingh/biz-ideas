"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Draws the outline logo's stroke, then fades the backdrop away to reveal
// the page. Runs once per page load — no persistence, so it plays every time
// (as requested), not just on a user's first visit.
const DRAW_DURATION = 2.2;
const HOLD_AFTER_DRAW = 0.4;
const FADE_DURATION = 1;

export function Loader() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  // Read the reduced-motion preference and schedule the fade. Empty deps, so
  // this runs once per real mount — but in React Strict Mode (dev), React
  // double-invokes it (mount, cleanup, mount again) to surface exactly this
  // class of bug. Don't guard against that with a ref: the guard would let
  // the FIRST mount's cleanup cancel the only timer while blocking the
  // second mount from ever scheduling a replacement, permanently stalling
  // the loader. Left alone, each invocation schedules its own timer and
  // cleans up after itself — the final surviving mount's timer is the one
  // that actually fires.
  useEffect(() => {
    // Always reveal at the top of the page, regardless of where the browser
    // would otherwise restore scroll to on reload.
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduced);

    const delay = reduced ? 200 : (DRAW_DURATION + HOLD_AFTER_DRAW) * 1000;
    const t = setTimeout(() => setFading(true), delay);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Prevent scrolling while the loader covers the page.
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-999 flex items-center justify-center bg-main-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (fading) setDone(true);
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 423 422"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-52 w-52 text-primary sm:h-64 sm:w-64"
      >
        <motion.path
          d="M1 13.3223C46.6522 13.8592 83.5703 51.1094 83.5703 96.8887V119.899L85.0391 119.12C107.344 107.288 132.637 100.489 159.698 100.489C247.274 100.489 318.396 171.613 318.396 259.191C318.396 346.769 247.274 417.894 159.698 417.894C72.1218 417.894 1.00014 346.906 1 259.191C1 258.752 1.03171 258.272 1.06641 257.752C1.10012 257.246 1.13671 256.699 1.13672 256.181V255.181H1V13.3223ZM159.698 182.104C116.998 182.104 82.4756 216.627 82.4756 259.328C82.4757 302.03 116.998 336.553 159.698 336.553C202.399 336.553 236.921 302.03 236.921 259.328C236.921 216.627 202.399 182.104 159.698 182.104Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: DRAW_DURATION, ease: "easeInOut" }}
        />
        <motion.path
          d="M380.43 1C403.231 1 421.715 19.4844 421.715 42.2861C421.715 65.0879 403.231 83.5723 380.43 83.5723C357.629 83.5723 339.145 65.0879 339.145 42.2861C339.145 19.4844 357.629 1 380.43 1Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: DRAW_DURATION * 0.35, ease: "easeInOut", delay: DRAW_DURATION * 0.55 }
          }
        />
        <motion.path
          d="M421.715 336.648C421.715 382.427 384.797 419.676 339.145 420.213V188.988C339.145 143.209 376.063 105.958 421.715 105.421V336.648Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: DRAW_DURATION * 0.55, ease: "easeInOut", delay: DRAW_DURATION * 0.45 }
          }
        />
      </svg>
    </motion.div>
  );
}
