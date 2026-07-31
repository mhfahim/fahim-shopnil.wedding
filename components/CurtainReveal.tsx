"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Seal } from "@/types/invitation";
import { SealIntro } from "@/components/SealIntro";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CurtainRevealProps {
  seal: Seal;
  /** Fires once the curtain has fully cleared. */
  onRevealed: () => void;
}

type Phase = "idle" | "sealOut" | "splitting" | "gone";

const SEAL_OUT_MS = 420;
/** Heavy fabric: slow to start, then a long settling glide. */
const SPLIT_MS = 2600;
const FADE_MS = 200;
const CURTAIN_EASE = [0.62, 0.02, 0.24, 1] as const;

/** Each half paints the full column so the field looks continuous. */
const HALF_BACKGROUND = { backgroundSize: "100vw 100svh" } as const;

/** Pleat shading, faded in only while the curtain is actually moving. */
const PLEATS =
  "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0) 14px, rgba(255,255,255,0.07) 26px, rgba(0,0,0,0) 38px, rgba(0,0,0,0.22) 52px)";

export function CurtainReveal({ seal, onRevealed }: CurtainRevealProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const reduced = useReducedMotion();

  // Hold the page still until the curtain has finished clearing.
  useEffect(() => {
    if (phase === "gone") return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  const open = () => {
    if (phase !== "idle") return;

    if (reduced) {
      setPhase("gone");
      return;
    }

    setPhase("sealOut");
    window.setTimeout(() => setPhase("splitting"), SEAL_OUT_MS);
    window.setTimeout(() => setPhase("gone"), SEAL_OUT_MS + SPLIT_MS);
  };

  useEffect(() => {
    if (phase !== "gone") return;
    window.scrollTo(0, 0);
    onRevealed();
  }, [phase, onRevealed]);

  const splitting = phase === "splitting";

  const half = (side: "left" | "right") => (
    <motion.div
      aria-hidden="true"
      className={`maroon-curtain absolute inset-y-0 w-1/2 ${
        side === "left" ? "left-0 bg-left-top" : "right-0 bg-right-top"
      }`}
      style={HALF_BACKGROUND}
      animate={{ x: splitting ? (side === "left" ? "-100%" : "100%") : "0%" }}
      transition={{
        duration: SPLIT_MS / 1000,
        ease: CURTAIN_EASE,
        // The trailing half lags a beat, the way a real pair never
        // quite draws in unison.
        delay: side === "right" ? 0.06 : 0,
      }}
    >
      {/* Folds deepen as the fabric gathers */}
      <motion.span
        className="absolute inset-0"
        style={{ backgroundImage: PLEATS }}
        initial={{ opacity: 0 }}
        animate={{ opacity: splitting ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      {/* Soft shadow down the leading edge */}
      <span
        className={`absolute inset-y-0 w-10 ${
          side === "left"
            ? "right-0 bg-gradient-to-l from-black/35 to-transparent"
            : "left-0 bg-gradient-to-r from-black/35 to-transparent"
        }`}
      />
    </motion.div>
  );

  return (
    <AnimatePresence>
      {phase !== "gone" ? (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-50 bg-night-900"
          exit={reduced ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: reduced ? FADE_MS / 1000 : 0 }}
        >
          {/* Constrained to the phone column, like the rest of the page. */}
          <div className="relative mx-auto h-full w-full max-w-phone overflow-hidden">
            {half("left")}
            {half("right")}

            <div className="absolute inset-0 grid place-items-center">
              <SealIntro seal={seal} onOpen={open} opening={phase !== "idle"} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
