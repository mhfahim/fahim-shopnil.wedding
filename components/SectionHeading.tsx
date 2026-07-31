"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { childReveal } from "@/lib/motion";
import { DividerFlourish } from "@/components/ornaments/DividerFlourish";

interface SectionHeadingProps {
  id: string;
  children: string;
  /** Optional small gold glyph above the heading. */
  icon?: LucideIcon;
  /** Quiet line under the flourish. */
  subline?: string;
}

/**
 * Script heading, optional icon, flourish. Script headings are real
 * headings — never a styled div — so the document outline stays intact.
 */
export function SectionHeading({
  id,
  children,
  icon: Icon,
  subline,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={childReveal}
      className="flex flex-col items-center text-center"
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          strokeWidth={1.4}
          className="mb-4 size-[22px] text-gold-600"
        />
      ) : null}

      <h2
        id={id}
        className="text-gold-gradient font-script text-section-heading tracking-[0.02em]"
      >
        {children}
      </h2>

      <DividerFlourish className="mt-3" />

      {subline ? (
        <p className="mt-4 font-serif text-meta text-ink-300">{subline}</p>
      ) : null}
    </motion.div>
  );
}
