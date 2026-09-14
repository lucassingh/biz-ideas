"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stats = [
  { num: "50+", titleLines: ["AI Agents", "Deployed"], bg: "bg-accent" },
  { num: "12+", titleLines: ["Years of Tech", "Experience"], bg: "bg-secondary" },
  { num: "30+", titleLines: ["Enterprise", "Clients"], bg: "bg-primary" },
  { num: "24/7", titleLines: ["AI Systems", "Running"], bg: "bg-secondary" },
];

const MAX_HEIGHT = 380;
const MIN_HEIGHT = MAX_HEIGHT * 0.75;
const DIP_DURATION = 2;

export function Stats() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-main-bg px-6 pb-20 sm:px-8 md:pb-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.map(({ num, titleLines, bg }, i) => (
          <motion.article
            key={titleLines.join(" ")}
            initial={{ opacity: 0, y: 24, height: MAX_HEIGHT }}
            whileInView={{
              opacity: 1,
              y: 0,
              height: reduceMotion ? MAX_HEIGHT : [MAX_HEIGHT, MIN_HEIGHT, MAX_HEIGHT],
            }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              opacity: { duration: 0.5, ease: EASE, delay: i * 0.08 },
              y: { duration: 0.5, ease: EASE, delay: i * 0.08 },
              height: reduceMotion
                ? { duration: 0 }
                : {
                    duration: DIP_DURATION,
                    times: [0, 0.5, 1],
                    ease: "easeInOut",
                    delay: i * DIP_DURATION,
                    repeat: Infinity,
                    repeatDelay: (stats.length - 1) * DIP_DURATION,
                  },
            }}
            className={`flex flex-col justify-between overflow-hidden rounded-2xl p-7 shadow-[0_16px_40px_rgba(247,93,0,0.16)] ${bg}`}
          >
            <div className="text-[1.35rem] font-semibold leading-[1.2] text-light">
              {titleLines[0]}
              <br />
              {titleLines[1]}
            </div>
            <div className="text-[4rem] font-bold leading-none text-light">{num}</div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
