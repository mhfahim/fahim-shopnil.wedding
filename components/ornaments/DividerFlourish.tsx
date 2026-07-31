"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { flourishDraw, viewportOnce } from "@/lib/motion";

/**
 * The one ornament every section is allowed. A hairline either side of a
 * small diamond-leaf motif, fading only at the very tips. Inherits gold
 * via currentColor.
 */
export function DividerFlourish({ className = "" }: { className?: string }) {
  // Gradient ids must be unique — this ornament appears a dozen times.
  const uid = useId().replace(/:/g, "");
  const leftId = `fl-l-${uid}`;
  const rightId = `fl-r-${uid}`;

  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 180 16"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`h-4 w-[150px] text-gold-600 ${className}`}
    >
      {/* userSpaceOnUse is required: these rules are perfectly horizontal, so
          their object bounding box has zero height and an objectBoundingBox
          gradient would not paint at all. */}
      <defs>
        <linearGradient
          id={leftId}
          gradientUnits="userSpaceOnUse"
          x1="2"
          y1="8"
          x2="74"
          y2="8"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="18%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient
          id={rightId}
          gradientUnits="userSpaceOnUse"
          x1="106"
          y1="8"
          x2="178"
          y2="8"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="82%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Tapered rules */}
      <motion.path
        d="M2 8 H74"
        stroke={`url(#${leftId})`}
        strokeWidth="1"
        strokeLinecap="round"
        variants={flourishDraw}
      />
      <motion.path
        d="M106 8 H178"
        stroke={`url(#${rightId})`}
        strokeWidth="1"
        strokeLinecap="round"
        variants={flourishDraw}
      />

      {/* Centre diamond-leaf */}
      <motion.path
        d="M90 2.5 C93.2 5.4 94.8 6.7 97.2 8 C94.8 9.3 93.2 10.6 90 13.5 C86.8 10.6 85.2 9.3 82.8 8 C85.2 6.7 86.8 5.4 90 2.5 Z"
        fill="currentColor"
        fillOpacity="0.9"
        variants={flourishDraw}
      />

      {/* Flanking dots */}
      <motion.circle
        cx="78"
        cy="8"
        r="1.1"
        fill="currentColor"
        fillOpacity="0.6"
        variants={flourishDraw}
      />
      <motion.circle
        cx="102"
        cy="8"
        r="1.1"
        fill="currentColor"
        fillOpacity="0.6"
        variants={flourishDraw}
      />
    </motion.svg>
  );
}
