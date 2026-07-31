/** ISO-8601 string with an explicit offset, e.g. "2026-09-04T19:00:00+06:00". */
export type IsoDateTime = string;

export interface Seal {
  monogram: string;
  tapLabel: string;
}

export interface Person {
  /** Full name, as printed on the card. */
  name: string;
  /** The single name shown large in the hero. */
  displayName: string;
  /** "Younger daughter of" / "Younger son of" */
  relation: string;
  parents: string;
}

export interface RevealCard {
  eyebrow: string;
  /** The line above the date, e.g. "InSha'Allah to be held on". */
  blessing: string;
}

export interface Music {
  src: string;
  /** Named on the sound toggle, so the control says what it silences. */
  title: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface TimelineEntry {
  title: string;
  datetime: IsoDateTime;
  note: string;
}

export interface Venue {
  name: string;
  address: string;
  /** Drives both the embedded map and the "View on Google Maps" link. */
  mapQuery: string;
}

export interface Invitation {
  seal: Seal;
  bride: Person;
  groom: Person;
  intro: string;
  welcome: string;
  weddingDate: IsoDateTime;
  revealCard: RevealCard;
  music: Music;
  gallery: GalleryImage[];
  timeline: TimelineEntry[];
  venue: Venue;
  closing: string;
}

/** RSVP choices offered by the message form. */
export type Attendance = "accept" | "decline";
