"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { EASE } from "@/lib/motion";

interface SoundToggleProps {
  audible: boolean;
  onToggle: () => void;
  /** Track name, so the control says what it is turning off. */
  title: string;
}

/**
 * A guest may well open this in a quiet room, on a bus, or at work. The
 * music is never something they cannot switch off.
 */
export function SoundToggle({ audible, onToggle, title }: SoundToggleProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-phone justify-end p-4">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={audible}
        aria-label={
          audible ? `Turn the music off (${title})` : `Turn the music on (${title})`
        }
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
        className="pointer-events-auto grid size-11 place-items-center rounded-full border border-gold-600/40 bg-night-900/75 text-gold-400 backdrop-blur-sm"
      >
        {audible ? (
          <Volume2 aria-hidden="true" strokeWidth={1.4} className="size-[18px]" />
        ) : (
          <VolumeX aria-hidden="true" strokeWidth={1.4} className="size-[18px]" />
        )}
      </motion.button>
    </div>
  );
}
