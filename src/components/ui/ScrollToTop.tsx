"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

// Visible once the hero has fully scrolled out of view (i.e. from the logos
// strip onward) and hidden again back at the top — driven by an
// IntersectionObserver on the hero section rather than a scroll-position
// threshold, so it tracks the layout instead of a hardcoded pixel value.
export function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const hero = document.getElementById("top");
        if (!hero) return;

        const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
            threshold: 0,
        });
        io.observe(hero);
        return () => io.disconnect();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    className="fixed bottom-5 right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-light text-primary shadow-[0_8px_40px_rgba(7,47,95,0.16)] ring-1 ring-dark/[0.06] transition-shadow duration-300 hover:shadow-[0_12px_48px_rgba(7,47,95,0.24)]"
                >
                    <ArrowUp className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
