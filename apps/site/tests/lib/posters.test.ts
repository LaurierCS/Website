import { describe, expect, it } from 'vitest';
import { postersByKind, toEventPoster, type EventPoster } from '../../src/lib/posters';

const POSTER = 'https://example.supabase.co/storage/v1/object/public/events-images/ai-bingo.png';
const row = (fields: Record<string, unknown> = {}) => ({
  title: 'AI Bingo',
  kind: 'social',
  picture_url: POSTER,
  ...fields,
});

describe('toEventPoster', () => {
  it('reads an events table row into the event and its poster', () => {
    expect(toEventPoster(row())).toEqual({ kind: 'social', event: 'AI Bingo', poster: POSTER });
  });

  it.each([
    ['no title', { title: '  ' }],
    ['no kind', { kind: null }],
    ['a kind we do not run', { kind: 'party' }],
    ['no poster', { picture_url: null }],
    ['a poster that is not a link', { picture_url: 'ai-bingo.png' }],
  ])('is null for a row with %s', (_case, fields) => {
    expect(toEventPoster(row(fields))).toBeNull();
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
