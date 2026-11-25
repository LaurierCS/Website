/**
 * The event posters on the home page's "Everything else we do": every event in the events table with a cover
 * photo, which for most events is its poster. Rows from the table are checked here, once, then grouped into one
 * row per kind of night.
 */
import { z } from 'zod';

/** The categories the events table sorts events into. */
export const EVENT_CATEGORIES = ['review', 'social', 'career', 'workshop', 'hackathon', 'meet_the_pros'] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/** The kinds of night the home page has a row for, in the order it shows them. */
export const EVENT_KINDS = ['review', 'social', 'career', 'workshop'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/**
 * Which row each category's posters go in. Meet the Professionals has its own section above, so its posters join
 * the career nights; a hackathon is a weekend of workshops.
 */
export const ROW_FOR_CATEGORY: Readonly<Record<EventCategory, EventKind>> = {
  review: 'review',
  social: 'social',
  career: 'career',
  workshop: 'workshop',
  hackathon: 'workshop',
  meet_the_pros: 'career',
};

/** One event and its poster. `poster` is the picture's public address. */
export type EventPoster = Readonly<{ kind: EventKind; event: string; poster: string }>;

/** One kind of night and its posters, in the order they came in. */
export type PosterRow = Readonly<{ kind: EventKind; posters: readonly EventPoster[] }>;

const PosterRowSchema = z.object({
  title: z.string().trim().min(1),
  category: z.enum(EVENT_CATEGORIES),
  // The event's cover photo; the query asks only for covers, so there is one.
  event_photos: z.array(z.object({ path: z.string().trim().min(1) })).min(1),
});

/**
 * An events table row, with its cover photo, as an `EventPoster`, or null when it can't be one (no title, a
 * category we don't know, no cover). `pictureUrl` turns the cover's path in the events bucket into its address.
 */
export function toEventPoster(row: unknown, pictureUrl: (path: string) => string): EventPoster | null {
  const parsed = PosterRowSchema.safeParse(row);
  if (!parsed.success) return null;
  const { title, category, event_photos } = parsed.data;
  return { kind: ROW_FOR_CATEGORY[category], event: title, poster: pictureUrl(event_photos[0].path) };
}

/** The posters grouped by kind, kinds in their set order; a kind with no posters yet is left out. */
export function postersByKind(posters: readonly EventPoster[]): readonly PosterRow[] {
  return EVENT_KINDS.map((kind) => ({ kind, posters: posters.filter((poster) => poster.kind === kind) })).filter(
    (row) => row.posters.length > 0,
  );
}
