"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** The gentle nudge at the foot of the hero. */
export function ScrollCue() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: EASE }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        className="flex flex-col items-center gap-1 text-gold-200/60"
      >
        {/* Sized here rather than from the label-caps token, which the
            other sections share. */}
        <span className="font-utility text-[0.78rem] tracking-caps uppercase">
          Scroll
        </span>
        <ChevronDown strokeWidth={1.2} className="size-[18px]" />
      </motion.div>
    </motion.div>
  );
}
