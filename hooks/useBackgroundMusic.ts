"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Background level — present, but never over the top of a conversation. */
const TARGET_VOLUME = 0.4;
/** Swells in over roughly the length of the curtain draw. */
const FADE_MS = 2600;
const FADE_STEP_MS = 50;

export interface BackgroundMusic {
  /** Attach to the page's <audio> element. */
  attach: (element: HTMLAudioElement | null) => void;
  /**
   * Must be called synchronously from inside a tap handler. Mobile browsers
   * block playback that begins outside a user gesture, so this cannot be
   * deferred until the curtain finishes drawing.
   */
  start: () => void;
  /** True while sound is actually coming out. */
  audible: boolean;
  /** Sound on/off for the guest. */
  toggle: () => void;
}

/**
 * Imperative control of a media element is exactly what refs are for: the
 * element is only ever touched from event handlers, never read during
 * render. Callers should destructure the result rather than holding the
 * object, so no ref-derived value is read while rendering.
 */
export function useBackgroundMusic(): BackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | undefined>(undefined);
  const [started, setStarted] = useState(false);
  const [audible, setAudible] = useState(false);

  const attach = useCallback((element: HTMLAudioElement | null) => {
    audioRef.current = element;
  }, []);

  useEffect(() => () => window.clearInterval(fadeRef.current), []);

  const fadeTo = useCallback((to: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    window.clearInterval(fadeRef.current);
    const from = audio.volume;
    const ticks = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS));
    let tick = 0;

    fadeRef.current = window.setInterval(() => {
      tick += 1;
      const next = from + ((to - from) * tick) / ticks;
      audio.volume = Math.min(1, Math.max(0, next));
      if (tick >= ticks) window.clearInterval(fadeRef.current);
    }, FADE_STEP_MS);
  }, []);

  const play = useCallback(
    (fromSilence: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (fromSilence) audio.volume = 0;

      void audio
        .play()
        .then(() => {
          setStarted(true);
          setAudible(true);
          fadeTo(TARGET_VOLUME);
        })
        .catch(() => {
          // Blocked despite the gesture. The toggle is the second chance.
          setAudible(false);
        });
    },
    [fadeTo],
  );

  const start = useCallback(() => {
    if (started) return;
    play(true);
  }, [started, play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audible) {
      window.clearInterval(fadeRef.current);
      audio.pause();
      setAudible(false);
      return;
    }

    play(!started);
  }, [audible, started, play]);

  return { attach, start, audible, toggle };
}
