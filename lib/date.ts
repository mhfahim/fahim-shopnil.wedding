import type { IsoDateTime } from "@/types/invitation";

/**
 * Every date on the page is formatted here with Intl, pinned to the
 * wedding's timezone, so the output is identical on the server and on a
 * guest's device regardless of where they open the invitation from.
 */
export const TIME_ZONE = "Asia/Dhaka";

const LOCALE = "en-GB";

function format(iso: IsoDateTime, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    ...options,
  }).format(new Date(iso));
}

/** "21 November 2026" */
export function formatLongDate(iso: IsoDateTime): string {
  return format(iso, { day: "numeric", month: "long", year: "numeric" });
}

/** "Saturday" */
export function formatWeekday(iso: IsoDateTime): string {
  return format(iso, { weekday: "long" });
}

/** "7:00 PM" */
export function formatTime(iso: IsoDateTime): string {
  return format(iso, { hour: "numeric", minute: "2-digit", hour12: true });
}

/** "21 Nov 2026, 7:00 PM" — the timeline / pre-wedding stamp. */
export function formatDateTime(iso: IsoDateTime): string {
  return `${format(iso, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}, ${formatTime(iso)}`;
}

/** Machine-readable value for <time dateTime>. */
export function toDateTimeAttr(iso: IsoDateTime): string {
  return new Date(iso).toISOString();
}

/** Wedding year, for the footer. */
export function formatYear(iso: IsoDateTime): string {
  return format(iso, { year: "numeric" });
}
