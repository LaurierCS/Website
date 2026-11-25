import { describe, expect, it } from 'vitest';
import { postersByKind, toEventPoster, type EventPoster } from '../../src/lib/posters';

/** Stands in for the events bucket: a photo's path becomes an address under it. */
const inBucket = (path: string) => `https://example.supabase.co/storage/v1/object/public/event-media/${path}`;
const POSTER = inBucket('ai-bingo/photos/poster.png');

const row = (fields: Record<string, unknown> = {}) => ({
  title: 'AI Bingo',
  category: 'social',
  event_photos: [{ path: 'ai-bingo/photos/poster.png' }],
  ...fields,
});

describe('toEventPoster', () => {
  it('reads an events table row and its cover photo into the event and its poster', () => {
    expect(toEventPoster(row(), inBucket)).toEqual({ kind: 'social', event: 'AI Bingo', poster: POSTER });
  });

  it.each([
    ['Meet the Professionals in the career row', 'meet_the_pros', 'career'],
    ['a hackathon in the workshops row', 'hackathon', 'workshop'],
  ])('puts %s', (_case, category, kind) => {
    expect(toEventPoster(row({ category }), inBucket)?.kind).toBe(kind);
  });

  it.each([
    ['no title', { title: '  ' }],
    ['no category', { category: null }],
    ['a category we do not know', { category: 'party' }],
    ['no cover photo', { event_photos: [] }],
    ['a cover photo without a path', { event_photos: [{ path: '' }] }],
  ])('is null for a row with %s', (_case, fields) => {
    expect(toEventPoster(row(fields), inBucket)).toBeNull();
  });
});

describe('postersByKind', () => {
  const poster = (kind: EventPoster['kind'], event: string): EventPoster => ({ kind, event, poster: POSTER });

  it('groups the posters by kind in their set order, keeping their order and leaving out kinds with none', () => {
    const posters = [poster('social', 'AI Bingo'), poster('review', 'CP216'), poster('social', 'Spill')];
    const rows = postersByKind(posters);
    expect(rows.map((kindRow) => kindRow.kind)).toEqual(['review', 'social']);
    expect(rows[1]?.posters.map((each) => each.event)).toEqual(['AI Bingo', 'Spill']);
  });
});
