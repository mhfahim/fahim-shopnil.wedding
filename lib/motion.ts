import type { Variants, Transition } from "framer-motion";

/** The one easing curve the whole page shares. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Every section reveals identically, so the page reads as one scroll. */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

export const childReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Ornament strokes draw themselves in. */
export const flourishDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

/** Shared whileInView config — reveal once, a quarter into view. */
export const viewportOnce = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -12% 0px",
} as const;

export const softTransition: Transition = { duration: 0.6, ease: EASE };
