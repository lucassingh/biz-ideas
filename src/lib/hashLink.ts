import type { MouseEvent } from "react";

// Scrolls to an in-page section without letting the browser append the
// hash to the URL (the default <a href="#section"> behavior), so the
// address bar stays on the bare domain no matter which section is in view.
export function onHashLinkClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#") || href.length < 2) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
}
