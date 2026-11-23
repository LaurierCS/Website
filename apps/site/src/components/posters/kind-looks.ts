/**
 * How each kind of night's label looks on its row of posters: a chip in the kind's accent, with a solid edge in
 * the accent's dark ink. A new kind is one more entry here (and one in `KIND_NAMES`).
 */
import type { EventKind } from '../../lib/posters';

export const KIND_CHIP: Readonly<Record<EventKind, string>> = {
  review: 'bg-blue shadow-blue-ink',
  social: 'bg-pink shadow-pink-ink',
  career: 'bg-yellow shadow-yellow-ink',
  workshop: 'bg-orange shadow-orange-ink',
};
