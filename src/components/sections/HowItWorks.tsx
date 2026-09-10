"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionInner, SectionLabel, SectionTitle } from "@/components/ui/Section";

const steps = [
  {
    num: "01",
    title: "Discovery Call",
    description: "We map your workflows, pain points and goals in a focused 45-minute session.",
  },
  {
    num: "02",
    title: "Solution Design",
    description: "Our team proposes the ideal combination of AI tools and integrations for your stack.",
  },
  {
    num: "03",
    title: "Rapid Deployment",
    description: "We build and deploy your solution — most projects go live within 2–4 weeks.",
  },
  {
    num: "04",
    title: "Ongoing Optimization",
    description: "Continuous monitoring, AI model tuning and feature expansion as your business grows.",
  },
];

const N = steps.length;
const SLOT_MS = 3400;

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % N), SLOT_MS);
    return () => clearInterval(id);
  }, [playing, reduceMotion]);

  return (
    <Section id="about" tone="muted">
      <SectionInner>
        <Reveal className="mb-20 text-center">
          <SectionLabel center>How We Work</SectionLabel>
          <SectionTitle className="mx-auto">
            From Discovery to
            <br />
            Live in Weeks
          </SectionTitle>
        </Reveal>

        <motion.div
          className="mx-auto flex max-w-[900px] items-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          onViewportEnter={() => setPlaying(true)}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;
            return (
              <div key={step.num} className="flex flex-1 items-center last:flex-none">
                <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-light text-[1.35rem] font-bold text-primary ring-1 ring-primary/15 sm:text-[1.5rem]">
                    {step.num}
                  </div>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-primary text-[1.35rem] font-bold text-light shadow-[0_16px_36px_rgba(7,47,95,0.32)] sm:text-[1.5rem]"
                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {step.num}
                  </motion.div>
                </div>

                {i < N - 1 && (
                  <div className="relative mx-2 h-[3px] flex-1 rounded-full bg-primary/12 sm:mx-4">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary"
                      style={{ transformOrigin: "left center" }}
                      animate={{ scaleX: isDone || isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        <div className="relative mx-auto mt-10 min-h-[15rem] max-w-[720px] overflow-hidden rounded-[28px] bg-light shadow-[0_20px_60px_rgba(7,47,95,0.1)] sm:mt-12 sm:min-h-[13rem]">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 text-center sm:px-16"
              animate={{ opacity: i === activeIndex ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <h3 className="text-[1.9rem] font-bold text-primary sm:text-[2.15rem]">{step.title}</h3>
              <p className="mx-auto mt-4 max-w-[480px] text-[1.1rem] leading-relaxed text-dark/60">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionInner>
    </Section>
  );
}
