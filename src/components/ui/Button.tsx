"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { onHashLinkClick } from "@/lib/hashLink";

type ButtonVariant = "primary" | "ghost" | "inverse" | "outline-light";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-primary text-light hover:bg-secondary",
  ghost: "border border-dark/15 bg-light text-dark hover:border-dark/25 hover:bg-main-bg",
  // solid light pill for use on top of the dark hero gradient
  inverse: "bg-light text-dark hover:bg-main-bg",
  // transparent + light border, for a secondary action on a colorful/dark background
  "outline-light": "border border-light/40 bg-transparent text-light hover:border-light/70 hover:bg-light/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      onClick={(e) => onHashLinkClick(e, href)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-[0.95rem] font-semibold transition-colors duration-200 ${variantClass[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </motion.a>
  );
}
