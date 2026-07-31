"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** The target has passed. */
  isPast: boolean;
  /** False until the clock has started, so the server can render dashes. */
  isReady: boolean;
}

/* ---- A single shared one-second clock -------------------------------- */

let now = 0;
let intervalId: number | null = null;
const listeners = new Set<() => void>();

function subscribe(onTick: () => void) {
  listeners.add(onTick);

  if (intervalId === null) {
    // Read the wall clock on every tick, so a backgrounded tab that misses
    // intervals catches straight up instead of accumulating drift.
    now = Date.now();
    intervalId = window.setInterval(() => {
      now = Date.now();
      for (const listener of listeners) listener();
    }, 1000);
  }

  return () => {
    listeners.delete(onTick);
    if (listeners.size === 0 && intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };
}

/** A plain number, so the snapshot is referentially stable between ticks. */
function getSnapshot() {
  return now;
}

function getServerSnapshot() {
  return 0;
}

/* ---------------------------------------------------------------------- */

export function useCountdown(targetIso: string): Countdown {
  const nowMs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    const idle: Countdown = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
      isReady: false,
    };

    // Server render and the first client render agree on this branch.
    if (nowMs === 0) return idle;

    const remaining = new Date(targetIso).getTime() - nowMs;
    if (remaining <= 0) return { ...idle, isPast: true, isReady: true };

    const totalSeconds = Math.floor(remaining / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor(totalSeconds / 3600) % 24,
      minutes: Math.floor(totalSeconds / 60) % 60,
      seconds: totalSeconds % 60,
      isPast: false,
      isReady: true,
    };
  }, [nowMs, targetIso]);
}
