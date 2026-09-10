import type { SVGProps } from "react";

/**
 * lucide-react doesn't ship the X (formerly Twitter) brand glyph, so this
 * is hand-drawn to match lucide's stroke conventions (24x24, round caps).
 */
export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  );
}
