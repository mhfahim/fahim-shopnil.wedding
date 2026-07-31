"use client";

import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
}

/** Hairline-only input styling, shared by every control in the form. */
const CONTROL_CLASS =
  // py-2.5 keeps every control at or above the 44px touch-target minimum.
  "w-full border-0 border-b border-gold-600/30 bg-transparent px-0 py-2.5 font-serif text-body text-ink-900 transition-colors duration-200 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus-visible:outline-none";

/** Label above, always visible — never a floating label. */
export function FormField({ id, label, error, children }: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-1 font-utility text-label-caps tracking-caps text-ink-600 uppercase"
      >
        {label}
      </label>

      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
        className: `${CONTROL_CLASS} ${error ? "border-accent-red" : ""}`,
      })}

      {error ? (
        <p id={errorId} className="mt-1.5 font-serif text-meta text-accent-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
