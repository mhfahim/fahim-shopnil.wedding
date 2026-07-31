"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Person } from "@/types/invitation";
import { childReveal, stagger } from "@/lib/motion";
import { givenName } from "@/lib/name";
import { ScrollCue } from "@/components/ScrollCue";
import { DividerFlourish } from "@/components/ornaments/DividerFlourish";

interface HeroSectionProps {
  intro: string;
  bride: Person;
  groom: Person;
  /** Focus moves here once the curtain has opened. */
  headingRef?: React.RefObject<HTMLHeadingElement | null>;
}

function Attribution({ person }: { person: Person }) {
  return (
    <span className="mt-2 flex flex-col gap-0.5 font-serif text-[0.82rem] font-light text-gold-200/70">
      <span>{person.relation}</span>
      <span>{person.parents}</span>
    </span>
  );
}

/**
 * The printed backdrop carries the chandelier, lanterns and florals, so no
 * SVG arch or floral spray is drawn here — the artwork already has them.
 */
export function HeroSection({
  intro,
  bride,
  groom,
  headingRef,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-night-900 px-6 py-16"
    >
      <Image
        src="/images/hero-backdrop.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Keeps the script legible over the busiest part of the artwork. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-night-900/35 via-night-900/55 to-night-900/35"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.p
          variants={childReveal}
          className="font-serif text-[0.88rem] font-light text-gold-200/80 italic"
        >
          {intro}
        </motion.p>

        {/* The one h1 on the page: the couple, as the script hero. */}
        <h1
          id="hero-heading"
          ref={headingRef}
          tabIndex={-1}
          className="flex flex-col items-center outline-none"
        >
          <motion.span
            variants={childReveal}
            className="text-gold-gradient mt-4 block font-script text-couple-name whitespace-nowrap"
          >
            {givenName(bride)}
          </motion.span>
          <motion.span variants={childReveal}>
            <Attribution person={bride} />
          </motion.span>

          <motion.span
            variants={childReveal}
            aria-hidden="true"
            className="text-gold-gradient my-4 block font-script text-[2.05rem] leading-none"
          >
            &amp;
          </motion.span>
          <span className="sr-only"> and </span>

          <motion.span
            variants={childReveal}
            className="text-gold-gradient block font-script text-couple-name whitespace-nowrap"
          >
            {givenName(groom)}
          </motion.span>
          <motion.span variants={childReveal}>
            <Attribution person={groom} />
          </motion.span>
        </h1>

        <motion.div variants={childReveal} className="mt-8 text-gold-400">
          <DividerFlourish />
        </motion.div>
      </motion.div>

      <ScrollCue />
    </section>
  );
}
