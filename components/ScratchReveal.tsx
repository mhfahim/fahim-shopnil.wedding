"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RevealCard } from "@/types/invitation";
import { childReveal } from "@/lib/motion";
import { formatLongDate, formatTime, formatWeekday } from "@/lib/date";
import {
  BRUSH_RADIUS,
  CLEAR_THRESHOLD,
  SAMPLE_EVERY,
  clearedFraction,
  paintFoil,
} from "@/lib/scratch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { ScratchSparkle } from "@/components/ScratchSparkle";
import { CornerFiligree } from "@/components/ornaments/CornerFiligree";

interface ScratchRevealProps {
  card: RevealCard;
  /** The date is derived from here, so it can never drift out of step. */
  weddingDate: string;
}

export function ScratchReveal({ card, weddingDate }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  const reveal = useCallback(() => setRevealed(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    paintFoil(ctx, width, height);
  }, [revealed]);

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !drawing.current || revealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH_RADIUS * 2;

    // Interpolate from the previous point so a fast drag leaves no gaps.
    const from = last.current ?? { x, y };
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };

    moves.current += 1;
    if (
      moves.current % SAMPLE_EVERY === 0 &&
      clearedFraction(canvas) > CLEAR_THRESHOLD
    ) {
      reveal();
    }
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    last.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratch(event);
  };

  const stop = () => {
    drawing.current = false;
    last.current = null;
  };

  return (
    <Section id="scratch" labelledBy="scratch-heading" band="cream-100">
      <SectionHeading id="scratch-heading" subline="Scratch the card below">
        Scratch to Reveal
      </SectionHeading>

      <motion.div variants={childReveal} className="mt-10 w-full">
        <div className="relative h-[195px] w-full">
          {/* Always in the DOM: screen readers and no-JS guests get this. */}
          <div className="absolute inset-0 grid place-content-center rounded-card border border-gold-600/20 bg-white/70 px-4 text-center shadow-card">
            <CornerFiligree corner="tl" className="absolute top-2 left-2" />
            <CornerFiligree corner="br" className="absolute right-2 bottom-2" />

            <p className="font-utility text-label-caps tracking-caps text-gold-600 uppercase">
              {card.eyebrow}
            </p>
            <p className="mt-3 font-serif text-meta text-ink-600 italic">
              {card.blessing}
            </p>
            <p className="mt-1 font-serif text-event-title font-semibold text-ink-900">
              {formatLongDate(weddingDate)}
            </p>
            <p className="mt-1 font-serif text-body text-ink-600">
              {formatWeekday(weddingDate)}
            </p>
            <p className="font-serif text-body text-ink-600">
              {formatTime(weddingDate)}
            </p>
          </div>

          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={scratch}
            onPointerUp={stop}
            onPointerCancel={stop}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full touch-none rounded-card transition-opacity duration-500 ${
              revealed ? "pointer-events-none opacity-0" : "cursor-grab"
            }`}
          />

          {revealed && !reduced ? <ScratchSparkle /> : null}
        </div>

        <button
          type="button"
          onClick={reveal}
          className="sr-only-focusable mt-4 font-utility text-label-caps tracking-caps text-ink-600 uppercase"
        >
          Reveal the date
        </button>
      </motion.div>
    </Section>
  );
}
