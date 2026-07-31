"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/types/invitation";
import { EASE, sectionReveal, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DividerFlourish } from "@/components/ornaments/DividerFlourish";

const AUTOPLAY_MS = 4000;
/** How long autoplay stays paused after a guest swipes or taps. */
const RESUME_MS = 8000;
const SWIPE_DISTANCE = 45;
const SWIPE_VELOCITY = 320;

export function ImageSlider({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();

  const count = images.length;

  /* The track is offset in pixels, never percentages: dragging writes px
     to the same motion value, and the two units cannot be reconciled. */
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSlideWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  /** Any manual interaction pauses the reel, then hands it back. */
  const nudge = useCallback(
    (next: number) => {
      goTo(next);
      setPaused(true);
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => setPaused(false), RESUME_MS);
    },
    [goTo],
  );

  useEffect(() => {
    if (reduced || paused || count < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [reduced, paused, count]);

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  return (
    <section
      id="gallery"
      aria-label="Photographs"
      className="paper-texture w-full bg-cream-50 px-5 py-[72px]"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={sectionReveal}
        className="flex w-full flex-col items-center"
      >
        <DividerFlourish className="mb-8" />

        <div
          aria-roledescription="carousel"
          className="w-full rounded-card border border-gold-600/25 bg-cream-50 p-2"
          style={{ boxShadow: "var(--shadow-print)" }}
        >
          <div ref={viewport} className="overflow-hidden rounded-card">
            <motion.div
              className="flex touch-pan-y"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragEnd={(_, info) => {
                const far = Math.abs(info.offset.x) > SWIPE_DISTANCE;
                const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY;
                if (!far && !fast) return;
                nudge(index + (info.offset.x < 0 ? 1 : -1));
              }}
              animate={{ x: -index * slideWidth }}
              transition={{ duration: reduced ? 0 : 0.65, ease: EASE }}
            >
              {images.map((image, i) => (
                <div
                  key={image.src}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={i !== index}
                  className="w-full shrink-0"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="100vw"
                    draggable={false}
                    priority={i === 0}
                    className="pointer-events-none h-auto w-full select-none"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dots — each a 44px touch target with a small visible pip. */}
        <div className="mt-5 flex items-center justify-center">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => nudge(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              className="grid size-11 place-items-center"
            >
              <span
                aria-hidden="true"
                className={`block rounded-full transition-all duration-300 ${
                  i === index ? "size-2 bg-gold-500" : "size-1.5 bg-gold-600/35"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
