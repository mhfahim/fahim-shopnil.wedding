import type { Person } from "@/types/invitation";

/**
 * The hero, the closing line and the footer show the couple by the single
 * name they go by; the full name and surname are carried by the card and
 * the parents line. Stored explicitly in `data/invitation.ts` rather than
 * derived, because a Bangladeshi call-name is often not the first word.
 */
export function givenName(person: Person): string {
  return person.displayName;
}

/** "Shopnil & Fahim" */
export function coupleNames(bride: Person, groom: Person): string {
  return `${givenName(bride)} & ${givenName(groom)}`;
}
