import type { Invitation } from "@/types/invitation";

/**
 * The whole page renders from this object. Changing a field here changes
 * every place it appears, including the countdown target, the reveal card
 * and every formatted date. Nothing below is duplicated in a component.
 *
 * Content transcribed from the printed invitation card.
 */
export const invitation: Invitation = {
  seal: { monogram: "S", tapLabel: "Tap to open" },

  bride: {
    name: "Tabassum Hossain Shopnil",
    displayName: "Shopnil",
    relation: "Younger daughter of",
    parents: "Md. Delwar Hossain & Mahmuda Hossain (Akhi)",
  },
  groom: {
    name: "Mehedi Hasan Fahim",
    displayName: "Fahim",
    relation: "Younger son of",
    parents: "Md. Siddiqur Rahman & Nasima Begum",
  },

  intro: "We are honored to welcome you to the wedding ceremony of..",
  welcome:
    "We are honored to welcome you to the wedding ceremony of Shopnil & Fahim. As they begin their journey together in faith and love, we thank you for being part of this blessed occasion",

  // Friday, 4 September 2026, 7:00 PM (Asia/Dhaka).
  weddingDate: "2026-09-04T19:00:00+06:00",

  revealCard: {
    eyebrow: "You're invited!",
    blessing: "InSha'Allah to be held on",
  },

  gallery: [
    {
      src: "/images/gallery-1.png",
      alt: "White roses and gypsophila arranged beside lit pillar candles",
      width: 1314,
      height: 668,
    },
    {
      src: "/images/gallery-2.png",
      alt: "A bridal bouquet of blush and cream roses held at golden hour",
      width: 1293,
      height: 666,
    },
    {
      src: "/images/gallery-3.png",
      alt: "A couple hand in hand beneath a floral arch at sunset",
      width: 1303,
      height: 670,
    },
    {
      src: "/images/gallery-4.png",
      alt: "The couple's hands, wedding rings resting over pale roses",
      width: 1296,
      height: 663,
    },
  ],

  timeline: [
    {
      title: "Guest Arrival",
      datetime: "2026-09-04T18:30:00+06:00",
      note: "We warmly welcome you",
    },
    {
      title: "Wedding Ceremony",
      datetime: "2026-09-04T19:00:00+06:00",
      note: "Your gracious presence is requested",
    },
    {
      title: "Food",
      datetime: "2026-09-04T19:30:00+06:00",
      note: "Dinner is served from 7:30 PM onwards",
    },
  ],

  venue: {
    name: "Senakunja",
    address: "R93X+9MG, Shaheed Sharani, Dhaka Cantonment, Dhaka",
    mapQuery: "Senakunja, Shaheed Sharani, Dhaka Cantonment, Dhaka",
  },

  closing: "We can't wait to celebrate with you!",
};
