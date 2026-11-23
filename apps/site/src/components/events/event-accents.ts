/**
 * How each coming-up ticket looks, by its place in the list: the soonest is pink, then yellow, then light blue,
 * each with its mascot (Doug, Coco, Krill) and the angle it lands at when the booth prints it. A ticket's day on
 * the calendar lights up in the same colour with the same mascot sticker, so the two are easy to match.
 */
import type { MASCOT_FACES } from '../../assets/brand';

export const TICKET_ACCENTS = ['pink', 'yellow', 'sky'] as const;
export type TicketAccent = (typeof TICKET_ACCENTS)[number];

/** The mascot whose sticker marks each ticket's day, in the same order as the accents. */
export const TICKET_MASCOTS = ['doug', 'coco', 'krill'] as const satisfies ReadonlyArray<
  keyof typeof MASCOT_FACES
>;
export type TicketMascot = (typeof TICKET_MASCOTS)[number];

/** How crooked each ticket lands once printed, in degrees, like tickets dropped on the floor. */
export const TICKET_TILTS = [-1.2, 0.8, -0.6] as const;

/** How each mascot sticker sits on its calendar day: slapped on at a slight angle, a different one each. */
export const STICKER_TILTS = ['-rotate-12', 'rotate-9', '-rotate-6'] as const;

/** How many tickets the section shows: one per accent. */
export const SHOWN_TICKETS = TICKET_ACCENTS.length;

/** Each accent as a fill: the ticket's date stub and tag, and its day on the calendar. */
export const ACCENT_FILL: Readonly<Record<TicketAccent, string>> = {
  pink: 'bg-pink',
  yellow: 'bg-yellow',
  sky: 'bg-sky',
};

/**
 * The "Next up" stamp's ink in each accent: ink only, no background, like the admin's stamps. Top-down it lands
 * on the coloured date band, so it uses the accent's dark ink; side by side it lands on the dark ticket, so it
 * uses the accent itself.
 */
export const ACCENT_STAMP: Readonly<Record<TicketAccent, string>> = {
  pink: 'text-pink-ink @ticket:text-pink',
  yellow: 'text-yellow-ink @ticket:text-yellow',
  sky: 'text-blue-ink @ticket:text-sky',
};
