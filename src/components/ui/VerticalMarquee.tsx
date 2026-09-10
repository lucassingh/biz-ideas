"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface VerticalMarqueeItem {
  id: string;
  content: ReactNode;
}

interface VerticalMarqueeProps {
  items: VerticalMarqueeItem[];
  direction?: "up" | "down";
  speed?: number;
  gap?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const MIN_COPIES = 2;
const COPY_HEADROOM = 1;

/** Continuous vertical scroller — duplicates `items` enough times to cover the
 * container height, then translates the whole track and wraps the offset at
 * one copy's height so the loop is seamless. Pauses off-screen and respects
 * prefers-reduced-motion. Generic content (not logo-specific), unlike
 * LogoLoop, which is why this is its own small component. */
export function VerticalMarquee({
  items,
  direction = "up",
  speed = 26,
  gap = 20,
  pauseOnHover = true,
  className = "",
}: VerticalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);

  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const seq = seqRef.current;
    if (!container || !seq) return;

    const measure = () => {
      const height = seq.getBoundingClientRect().height;
      if (height > 0) {
        setSeqHeight(Math.ceil(height));
        const viewport = container.clientHeight;
        const copiesNeeded = Math.ceil(viewport / height) + COPY_HEADROOM;
        setCopyCount(Math.max(MIN_COPIES, copiesNeeded));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(seq);
    ro.observe(container);
    return () => ro.disconnect();
  }, [items]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || seqHeight === 0) return;

    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    let offset = 0;
    let lastTimestamp: number | null = null;
    let isVisible = true;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!hovered) {
        offset += speed * deltaTime;
        offset = ((offset % seqHeight) + seqHeight) % seqHeight;
        const y = direction === "up" ? -offset : offset - seqHeight;
        track.style.transform = `translate3d(0, ${y}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const tryStart = () => {
      if (isVisible && raf === 0) raf = requestAnimationFrame(tick);
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastTimestamp = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0 },
    );
    io.observe(container);
    tryStart();

    return () => {
      tryStop();
      io.disconnect();
    };
  }, [seqHeight, speed, direction, hovered]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setHovered(true)}
      onMouseLeave={() => pauseOnHover && setHovered(false)}
    >
      <div ref={trackRef} className="flex flex-col will-change-transform">
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <div key={copyIndex} ref={copyIndex === 0 ? seqRef : undefined}>
            {items.map((item) => (
              <div key={item.id} style={{ marginBottom: gap }}>
                {item.content}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
