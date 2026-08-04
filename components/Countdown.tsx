"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment } from "react";
import { EASE, childReveal } from "@/lib/motion";
import { useCountdown } from "@/hooks/useCountdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

interface CountdownProps {
  targetIso: string;
  closing: string;
}

function Digit({ value, animate }: { value: string; animate: boolean }) {
  if (!animate) {
    return <span className="tabular">{value}</span>;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: EASE }}
        className="tabular block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export function Countdown({ targetIso, closing }: CountdownProps) {
  const { days, hours, minutes, seconds, isPast, isReady } =
    useCountdown(targetIso);
  const reduced = useReducedMotion();

  // Dashes on the server and on the first client paint - no mismatch.
  // Hoisted to a constant because this en dash was once mangled into
  // mojibake by a bulk rewrite; one place to check beats four.
  const DASH = "–";
  const cells = [
    { label: "Days", value: isReady ? String(days) : DASH },
    { label: "Hours", value: isReady ? String(hours).padStart(2, "0") : DASH },
    { label: "Minutes", value: isReady ? String(minutes).padStart(2, "0") : DASH },
    { label: "Seconds", value: isReady ? String(seconds).padStart(2, "0") : DASH },
  ];

  return (
    <Section id="countdown" labelledBy="countdown-heading" band="cream-100">
      <SectionHeading id="countdown-heading">
        Counting Down to Forever
      </SectionHeading>

      {isPast ? (
        <motion.p
          variants={childReveal}
          className="text-gold-gradient mt-10 font-script text-section-heading"
        >
          {closing}
        </motion.p>
      ) : (
        <motion.div
          variants={childReveal}
          aria-live="off"
          className="mt-10 flex w-full items-stretch justify-center"
        >
          {cells.map((cell, i) => (
            <Fragment key={cell.label}>
              {i > 0 ? (
                <div
                  aria-hidden="true"
                  className="w-px self-stretch bg-gold-600/25"
                />
              ) : null}
              <div className="flex flex-1 flex-col items-center px-1">
                <div className="flex h-[74px] w-full items-center justify-center rounded-card border border-gold-600/18 bg-white/70 shadow-card">
                  <span className="font-serif text-countdown-num font-light text-ink-900">
                    <Digit
                      value={cell.value}
                      animate={!reduced && cell.label === "Seconds"}
                    />
                  </span>
                </div>
                <span className="mt-3 font-utility text-label-caps tracking-caps text-ink-600 uppercase">
                  {cell.label}
                </span>
              </div>
            </Fragment>
          ))}
        </motion.div>
      )}
    </Section>
  );
}
