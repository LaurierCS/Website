/**
 * Where everyone sits on the couch beside the team credits, as percentages of the couch picture: the middle of
 * each bird (or the popcorn) from the left, how far up its bottom edge is, and how wide it is. A bird moving seats
 * is changing its numbers here; another bird is one more entry.
 */
import type { CouchBirdName } from '../../assets/placeholders';

export type Spot = Readonly<{ left: number; bottom: number; width: number }>;

/** The birds, one per seat cushion, front to back. */
export const COUCH_SEATS: readonly (Spot & Readonly<{ bird: CouchBirdName }>)[] = [
  { bird: 'goose', left: 31, bottom: 40, width: 26 },
  { bird: 'eagle', left: 47.5, bottom: 50, width: 25 },
  { bird: 'robin', left: 64.5, bottom: 61.5, width: 25 },
];

/** The popcorn, on the front arm, next to the goose. */
export const POPCORN_SPOT: Spot = { left: 20, bottom: 40, width: 10 };
