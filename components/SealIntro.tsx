"use client";

import { motion } from "framer-motion";
import type { Seal } from "@/types/invitation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SealIntroProps {
  seal: Seal;
  onOpen: () => void;
  /** True once the seal has been pressed; drives its exit. */
  opening: boolean;
}

/**
 * The wax seal on the maroon field. Nothing else is on screen.
 */
export function SealIntro({ seal, onOpen, opening }: SealIntroProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label="Open the invitation"
      onClick={onOpen}
      animate={
        opening
          ? { scale: 1.15, opacity: 0 }
          : reduced
            ? { scale: 1, opacity: 1 }
            : { scale: [1, 1.03, 1], opacity: 1 }
      }
      transition={
        opening
          ? { duration: 0.42, ease: "easeIn" }
          : reduced
            ? { duration: 0 }
            : {
                duration: 3.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }
      }
      className="group relative z-10 grid size-[148px] cursor-pointer place-items-center rounded-full"
      style={{ boxShadow: "var(--shadow-seal)" }}
    >
      {/* Ring pulsing outward */}
      {!reduced && !opening ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-gold-200"
          initial={{ scale: 1, opacity: 0.35 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 3.2, ease: "easeOut", repeat: Infinity }}
        />
      ) : null}

      {/* Seal face */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 42% 34%, var(--color-maroon-700) 0%, var(--color-maroon-900) 78%)",
        }}
      />

      {/* Inset hairline ring */}
      <span
        aria-hidden="true"
        className="absolute inset-[11px] rounded-full border border-gold-200/35"
      />

      <span className="relative flex flex-col items-center">
        <span className="text-gold-gradient font-script text-[2.5rem] leading-none">
          {seal.monogram}
        </span>
        <span className="text-gold-gradient mt-1 font-utility text-label-caps tracking-caps uppercase">
          {seal.tapLabel}
        </span>
      </span>
    </motion.button>
  );
}
