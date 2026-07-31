"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Fixed offsets keep the burst deterministic — no hydration surprises. */
const DIAMONDS = [
  { x: -110, y: -46 },
  { x: -62, y: 40 },
  { x: -18, y: -66 },
  { x: 24, y: 54 },
  { x: 70, y: -34 },
  { x: 116, y: 30 },
  { x: 148, y: -52 },
  { x: -148, y: 20 },
];

/**
 * A single soft burst when the card clears itself. Small gold diamonds,
 * 700ms, scale and fade. Not confetti.
 */
export function ScratchSparkle() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      {DIAMONDS.map((d, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.6], x: d.x, y: d.y }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.03 }}
          className="absolute size-2 rotate-45 bg-gold-gradient"
        />
      ))}
    </div>
  );
}
