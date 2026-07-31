"use client";

import { motion } from "framer-motion";
import type { Person } from "@/types/invitation";
import { sectionReveal, viewportOnce } from "@/lib/motion";
import { coupleNames } from "@/lib/name";
import { formatYear } from "@/lib/date";
import { ScallopEdge } from "@/components/ornaments/ScallopEdge";
import { DividerFlourish } from "@/components/ornaments/DividerFlourish";

interface ClosingSectionProps {
  closing: string;
  bride: Person;
  groom: Person;
  weddingDate: string;
}

export function ClosingSection({
  closing,
  bride,
  groom,
  weddingDate,
}: ClosingSectionProps) {
  const names = coupleNames(bride, groom);

  return (
    <>
      <section
        id="closing"
        aria-labelledby="closing-heading"
        className="paper-texture w-full bg-cream-50 px-5 py-[72px]"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={sectionReveal}
          className="flex w-full flex-col items-center text-center"
        >
          <ScallopEdge position="top" />

          <h2
            id="closing-heading"
            className="text-gold-gradient mt-10 font-script text-section-heading"
          >
            {closing}
          </h2>

          <p className="mt-5 font-serif text-body tracking-smallcaps text-ink-600 uppercase">
            {names}
          </p>

          <DividerFlourish className="mt-6" />
        </motion.div>
      </section>

      <footer className="w-full bg-cream-100 px-5 py-8 text-center">
        <p className="font-serif text-[0.75rem] text-ink-300">
          {names} &middot; {formatYear(weddingDate)}
        </p>
      </footer>
    </>
  );
}
