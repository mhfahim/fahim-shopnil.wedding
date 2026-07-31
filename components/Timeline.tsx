"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { TimelineEntry } from "@/types/invitation";
import { EASE, viewportOnce } from "@/lib/motion";
import { formatDateTime, toDateTimeAttr } from "@/lib/date";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Section id="timeline" labelledBy="timeline-heading" band="cream-50">
      <SectionHeading id="timeline-heading" icon={Clock}>
        Program Timeline
      </SectionHeading>

      <ol className="relative mt-12 w-full ps-6">
        {/* The rail */}
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-px bg-gold-600/45"
        />

        {entries.map((entry, i) => (
          <motion.li
            key={entry.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
            className="relative pb-10 last:pb-0"
          >
            {/* Centred on the rail: the list is padded 24px, so the dot's
                9px box starts 28px left of the content edge. */}
            <span
              aria-hidden="true"
              className="absolute top-[7px] -left-7 size-[9px] rounded-full bg-gold-500 ring-4 ring-cream-50"
            />

            <h3 className="font-serif text-event-title font-semibold tracking-title text-ink-900">
              {entry.title}
            </h3>
            <time
              dateTime={toDateTimeAttr(entry.datetime)}
              className="mt-1 block font-serif text-meta text-ink-600"
            >
              {formatDateTime(entry.datetime)}
            </time>
            <p className="mt-1 font-serif text-body text-ink-600">
              {entry.note}
              {i === entries.length - 1 ? (
                <>
                  {" "}
                  <span aria-hidden="true" className="text-accent-red">
                    &#10084;
                  </span>
                </>
              ) : null}
            </p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
