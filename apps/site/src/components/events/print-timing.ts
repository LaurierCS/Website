/**
 * The timing of "Coming up" as it comes into view: the event days light up one after another, then the ticket
 * booth prints the tickets one at a time (each feeds out of the slot in little jerks, like a receipt printer,
 * then drops onto the pile), and once the last one is down the "Next up" stamp comes down on the first.
 */

/** Gap between one event day lighting up and the next, in milliseconds. */
export const DAY_STAGGER_MS = 120;

/** When the booth starts printing, after the days have lit up, in seconds. */
export const PRINT_START_S = 0.45;

/** How long a ticket takes to feed out of the slot, and how many jerks it comes out in. */
export const FEED_S = 0.7;
export const FEED_STEPS = 9;

/** How long a ticket takes to drop onto the pile and bounce to a stop. */
export const DROP_S = 0.55;
