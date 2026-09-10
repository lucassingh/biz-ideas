import type { ReactNode } from "react";

type Tone = "light" | "muted";

const toneClass: Record<Tone, string> = {
  light: "bg-light",
  muted: "bg-main-bg",
};

/**
 * Full-bleed page section. `fullHeight` makes it occupy at least one
 * viewport (matching the mock's section-by-section layout) while still
 * allowing content to grow taller than 100vh when it needs to.
 */
export function Section({
  id,
  children,
  className = "",
  tone = "light",
  fullHeight = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  fullHeight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${toneClass[tone]} ${
        fullHeight ? "flex min-h-dvh flex-col justify-center" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionInner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 py-20 sm:px-8 md:py-24 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({
  children,
  center = false,
  className = "",
}: {
  children: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mb-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-secondary ${
        center ? "justify-center" : ""
      } ${className}`}
    >
      <span aria-hidden="true" className="block h-[2px] w-6 rounded-full bg-accent" />
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag className={`text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-tight text-primary ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionSub({
  children,
  className = "",
  center = false,
}: {
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <p
      className={`mt-4 max-w-[560px] text-[1.05rem] leading-relaxed text-dark/60 ${
        center ? "mx-auto text-center" : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}
