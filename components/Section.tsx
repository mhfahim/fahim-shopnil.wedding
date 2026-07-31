"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { sectionReveal, viewportOnce } from "@/lib/motion";

export type Band = "cream-50" | "cream-100";

interface SectionProps {
  id: string;
  /** Element id of the heading that names this section. */
  labelledBy: string;
  band: Band;
  children: ReactNode;
  className?: string;
}

const BAND_CLASS: Record<Band, string> = {
  "cream-50": "bg-cream-50",
  "cream-100": "bg-cream-100",
};

/**
 * Band background, phone rhythm, and the single shared reveal that every
 * section on the page uses.
 */
export function Section({
  id,
  labelledBy,
  band,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`paper-texture w-full px-5 py-[72px] ${BAND_CLASS[band]} ${className}`}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={sectionReveal}
        className="flex w-full flex-col items-center"
      >
        {children}
      </motion.div>
    </section>
  );
}
