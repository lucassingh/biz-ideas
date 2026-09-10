import localFont from "next/font/local";

// SF Pro Display — used for all headings (h1–h6). Loaded as a single
// variable-style font-family spanning the weights we ship locally.
export const sfProDisplay = localFont({
  src: [
    { path: "../fonts/SFProDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/SFProDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/SFProDisplay-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

// SF Pro Text — used for body copy, labels, nav and buttons.
export const sfProText = localFont({
  src: [
    { path: "../fonts/SFProText-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/SFProText-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SFProText-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/SFProText-Semibold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/SFProText-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-text",
  display: "swap",
});
