"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Venue } from "@/types/invitation";
import { childReveal } from "@/lib/motion";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * The map is held to a supporting role: muted into the palette, and never
 * the loudest thing in the band.
 */
export function VenueSection({ venue }: { venue: Venue }) {
  const query = encodeURIComponent(venue.mapQuery);
  const embedSrc = `https://www.google.com/maps?q=${query}&hl=en&z=16&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <Section id="venue" labelledBy="venue-heading" band="cream-100">
      <SectionHeading id="venue-heading" icon={MapPin}>
        Venue
      </SectionHeading>

      <motion.div
        variants={childReveal}
        className="mt-8 flex flex-col items-center text-center"
      >
        <p className="font-serif text-[1.25rem] font-semibold text-ink-900">
          {venue.name}
        </p>
        <p className="mt-2 font-serif text-body text-ink-600">
          {venue.address}
        </p>
      </motion.div>

      <motion.div
        variants={childReveal}
        className="relative mt-10 w-full overflow-hidden rounded-card border border-gold-600/25 shadow-card"
      >
        <iframe
          title="Map to the venue"
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block aspect-video w-full border-0"
        />
        {/* Settles the map into the cream palette instead of shouting. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cream-200/6 mix-blend-multiply"
        />
      </motion.div>

      <motion.a
        variants={childReveal}
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-button bg-gold-gradient px-9 py-[0.9rem] font-utility text-label-caps tracking-button text-night-900/90 uppercase"
      >
        View on Google Maps
      </motion.a>
    </Section>
  );
}
