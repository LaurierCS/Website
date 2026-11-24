/**
 * The event posters on the home page's "Everything else we do": every event in the events table that has a kind
 * of night and a poster. Rows from the table are checked here, once, then grouped into one row per kind.
 */
import { z } from 'zod';

/** The kinds of night the club runs, as the events table spells them, in the order the home page shows them. */
export const EVENT_KINDS = ['review', 'social', 'career', 'workshop'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/** One event and its poster. `poster` is the picture's address in the events bucket. */
export type EventPoster = Readonly<{ kind: EventKind; event: string; poster: string }>;

/** One kind of night and its posters, in the order they came in. */
export type PosterRow = Readonly<{ kind: EventKind; posters: readonly EventPoster[] }>;

const PosterRowSchema = z.object({
  title: z.string().trim().min(1),
  kind: z.enum(EVENT_KINDS),
  picture_url: z.url({ protocol: /^https$/ }),
});

/** An events table row as an `EventPoster`, or null when it can't be one (no title, no kind, no usable poster). */
export function toEventPoster(row: unknown): EventPoster | null {
  const parsed = PosterRowSchema.safeParse(row);
  if (!parsed.success) return null;
  return { kind: parsed.data.kind, event: parsed.data.title, poster: parsed.data.picture_url };
}

/** The posters grouped by kind, kinds in their set order; a kind with no posters yet is left out. */
export function postersByKind(posters: readonly EventPoster[]): readonly PosterRow[] {
  return EVENT_KINDS.map((kind) => ({ kind, posters: posters.filter((poster) => poster.kind === kind) })).filter(
    (row) => row.posters.length > 0,
  );
}
