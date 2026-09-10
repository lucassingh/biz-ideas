"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

// Static lookup so we never call `motion.create()` during render (that
// resets component state on every re-render and trips the
// react-hooks/static-components lint rule). Add a tag here if a section
// needs it as a Reveal wrapper.
const tags = {
  div: motion.div,
  span: motion.span,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
  h1: motion.h1,
  p: motion.p,
  blockquote: motion.blockquote,
} as const;

type Tag = keyof typeof tags;

/** Fades + slides a block into view once, on scroll. Respects reduced-motion. */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  variants = defaultVariants,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  variants?: Variants;
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = tags[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={shouldReduceMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : variants}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger container — pair with <RevealItem> children for card grids / lists. */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = tags[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const MotionTag = tags[as];
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  );
}
