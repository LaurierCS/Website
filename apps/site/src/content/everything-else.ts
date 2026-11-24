/**
 * The words on the home page's "Everything else we do". Marketing changes these, so they live here rather than in
 * the markup. The posters themselves come from the events table, set in the admin.
 */
import type { EventKind } from '../lib/posters';

export const EVERYTHING_ELSE = {
  label: 'Everything else we do',
  title: 'Something for every week.',
  summary: 'Four kinds of nights, all year round, one to a row. Open a poster to see it big.',
} as const;

/** What each kind of night is called on its row. */
export const KIND_NAMES: Readonly<Record<EventKind, string>> = {
  review: 'Review sessions',
  social: 'Socials',
  career: 'Career',
  workshop: 'Workshops',
};
