"use client";

import { motion } from "framer-motion";
import { flourishDraw, viewportOnce } from "@/lib/motion";

interface ScallopEdgeProps {
  /** "bottom" mirrors the wave so the band is symmetrically framed. */
  position?: "top" | "bottom";
  className?: string;
}

/**
 * The scalloped rule that brackets the welcome band and the closing band.
 * Two offset waves with a scatter of dots between them.
 */
export function ScallopEdge({
  position = "top",
  className = "",
}: ScallopEdgeProps) {
  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 24"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`h-6 w-[240px] text-gold-600 ${
        position === "bottom" ? "-scale-y-100" : ""
      } ${className}`}
    >
      <motion.path
        d="M4 15 C22 15 26 7 44 7 C62 7 66 15 84 15 C102 15 106 7 124 7 C142 7 146 15 164 15 C182 15 186 7 204 7 C222 7 226 15 236 15"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1"
        strokeLinecap="round"
        variants={flourishDraw}
      />
      <motion.path
        d="M14 20 C32 20 36 12 54 12 C72 12 76 20 94 20 C112 20 116 12 134 12 C152 12 156 20 174 20 C192 20 196 12 214 12"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="0.8"
        strokeLinecap="round"
        variants={flourishDraw}
      />
      <motion.g fill="currentColor" fillOpacity="0.5" variants={flourishDraw}>
        <circle cx="64" cy="3" r="1.3" />
        <circle cx="120" cy="2" r="1.6" />
        <circle cx="176" cy="3" r="1.3" />
      </motion.g>
    </motion.svg>
  );
}
