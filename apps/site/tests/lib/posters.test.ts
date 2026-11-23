import type { ImageMetadata } from 'astro';
import { describe, expect, it } from 'vitest';
import { postersByKind, readPosters } from '../../src/lib/posters';

const image = (src: string): ImageMetadata => ({ src, width: 800, height: 800, format: 'jpg' });
const IMAGES: ReadonlyMap<string, ImageMetadata> = new Map([
  ['review.jpg', image('/review.jpg')],
  ['bingo.jpg', image('/bingo.jpg')],
]);

const sheet = (...rows: string[]): string => ['kind,event,poster', ...rows].join('\n');

describe('readPosters', () => {
  it('reads each row into an event and its poster, found by file name', () => {
    expect(readPosters(sheet('review,CP216 Final Review,review.jpg'), IMAGES)).toEqual([
      { kind: 'review', event: 'CP216 Final Review', poster: IMAGES.get('review.jpg') },
    ]);
  });

  it.each([
    [
      'a kind we do not run',
      'party,Game Night,bingo.jpg',
      /row 2: kind must be one of review, social, career, workshop/,
    ],
    ['an empty event name', 'social,,bingo.jpg', /row 2: event is empty/],
    [
      'a poster that is not in the folder',
      'social,AI Bingo,missing.jpg',
      /row 2: there is no picture called missing\.jpg in src\/assets\/posters/,
    ],
  ])('stops with the row and the fix for %s', (_case, row, message) => {
    expect(() => readPosters(sheet(row), IMAGES)).toThrow(message);
  });
});

describe('postersByKind', () => {
  it('groups the posters by kind, kinds in their set order, leaving out kinds with none', () => {
    const posters = readPosters(
      sheet('social,AI Bingo,bingo.jpg', 'review,CP216,review.jpg', 'social,Spill the Tea,bingo.jpg'),
      IMAGES,
    );
    const rows = postersByKind(posters);
    expect(rows.map((row) => row.kind)).toEqual(['review', 'social']);
    expect(rows[1]?.posters.map((poster) => poster.event)).toEqual(['AI Bingo', 'Spill the Tea']);
  });
});
