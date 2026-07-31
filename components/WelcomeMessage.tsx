"use client";

import { motion } from "framer-motion";
import { sectionReveal, viewportOnce } from "@/lib/motion";
import { ScallopEdge } from "@/components/ornaments/ScallopEdge";

/**
 * Deliberately quiet: no heading, no card. Just the welcome, bracketed by
 * scallops, closed with the one red glyph on the page.
 */
export function WelcomeMessage({ welcome }: { welcome: string }) {
  return (
    <section
      id="welcome"
      aria-label="A welcome from the families"
      className="paper-texture w-full bg-cream-50 px-5 py-[72px]"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={sectionReveal}
        className="flex w-full flex-col items-center"
      >
        <ScallopEdge position="top" />

        <p className="my-10 text-center font-serif text-body leading-[1.9] text-ink-600 italic">
          {welcome}{" "}
          <span aria-hidden="true" className="text-accent-red not-italic">
            &#10084;
          </span>
        </p>

        <ScallopEdge position="bottom" />
      </motion.div>
    </section>
  );
}
