import type { Metadata } from "next";
import { Loader } from "@/components/Loader";
import { sfProDisplay, sfProText } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizIdeas+ · AI-Powered Business Transformation",
  description:
    "We bring enterprise-grade AI automation, intelligent agents, and digital transformation solutions to US businesses — backed by Bizit Global's proven technology ecosystem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sfProDisplay.variable} ${sfProText.variable}`}>
      <body className="bg-main-bg text-dark antialiased">
        <Loader />
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[999] focus-visible:rounded-full focus-visible:bg-primary focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-light"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
