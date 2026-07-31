"use client";

import { motion } from "framer-motion";
import type { Attendance } from "@/types/invitation";
import { EASE } from "@/lib/motion";
import { CONFIRMATION } from "@/lib/rsvp";
import { DividerFlourish } from "@/components/ornaments/DividerFlourish";

/** What the form cross-fades into once a message is away. */
export function MessageSent({ attending }: { attending: Attendance }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-10 flex flex-col items-center text-center"
    >
      <DividerFlourish />
      <p className="text-gold-gradient mt-6 font-script text-section-heading">
        Thank you
      </p>
      <p className="mt-3 font-serif text-body text-ink-600">
        {CONFIRMATION[attending]}
      </p>
    </motion.div>
  );
}
