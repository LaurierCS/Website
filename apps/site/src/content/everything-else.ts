/**
 * The words on the home page's "Everything else we do", and its posters. Marketing changes these, so they live
 * here rather than in the markup. The posters come from the posters sheet (`event-posters.csv`), with the
 * pictures in `assets/posters/`.
 */
import { POSTER_IMAGES } from '../assets/posters';
import { postersByKind, readPosters, type EventKind } from '../lib/posters';
import postersSheet from './event-posters.csv?raw';

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

export const POSTER_ROWS = postersByKind(readPosters(postersSheet, POSTER_IMAGES));
