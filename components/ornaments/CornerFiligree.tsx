"use client";

interface CornerFiligreeProps {
  corner: "tl" | "tr" | "bl" | "br";
  className?: string;
}

const ROTATION: Record<CornerFiligreeProps["corner"], string> = {
  tl: "",
  tr: "-scale-x-100",
  bl: "-scale-y-100",
  br: "-scale-100",
};

/**
 * A small scrolled corner. Deliberately rationed — the spec allows this on
 * at most two cards across the entire page.
 */
export function CornerFiligree({ corner, className = "" }: CornerFiligreeProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      fill="none"
      className={`h-8 w-8 text-gold-600 ${ROTATION[corner]} ${className}`}
    >
      <g
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.7"
      >
        <path d="M2 14 V6 C2 3.8 3.8 2 6 2 H14" />
        <path d="M8 20 C8 12 12 8 20 8" strokeOpacity="0.45" />
        <path d="M14 30 C22 30 30 22 30 14 C30 10 27 8 24 10 C21.4 11.8 22 16 26 16" />
      </g>
      <circle cx="30" cy="30" r="1.4" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}
