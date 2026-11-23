/**
 * Reads the event posters out of the posters sheet (`content/event-posters.csv`): one row per event, with the
 * kind of night it was and its poster. Once event photos live in the database, only this reader changes.
 */
import type { ImageMetadata } from 'astro';
import { z } from 'zod';
import { readSheet, requiredText, sheetImage } from './sheet';

/** The kinds of night the club runs, in the order the home page shows them. */
export const EVENT_KINDS = ['review', 'social', 'career', 'workshop'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/** One past event and its poster. */
export type EventPoster = Readonly<{ kind: EventKind; event: string; poster: ImageMetadata }>;

/** One kind of night and its posters, in the sheet's order. */
export type PosterRow = Readonly<{ kind: EventKind; posters: readonly EventPoster[] }>;

const PosterRowSchema = z
  .object({
    kind: z.enum(EVENT_KINDS, { error: `kind must be one of ${EVENT_KINDS.join(', ')}.` }),
    event: requiredText('event'),
    poster: requiredText('poster'),
  })
  .strict();

/**
 * The posters in the sheet's order, with their pictures looked up by file name in `images`.
 * @throws Error naming the row and the problem when a row is incomplete, has an unknown kind, or names a poster
 * that isn't there.
 */
export function readPosters(csv: string, images: ReadonlyMap<string, ImageMetadata>): readonly EventPoster[] {
  return readSheet(csv, 'event-posters.csv', PosterRowSchema).map(({ cells, where }) => ({
    kind: cells.kind,
    event: cells.event,
    poster: sheetImage(images, cells.poster, where, 'src/assets/posters'),
  }));
}

/** The posters grouped by kind, kinds in their set order; a kind with no posters yet is left out. */
export function postersByKind(posters: readonly EventPoster[]): readonly PosterRow[] {
  return EVENT_KINDS.map((kind) => ({ kind, posters: posters.filter((poster) => poster.kind === kind) })).filter(
    (row) => row.posters.length > 0,
  );
}
