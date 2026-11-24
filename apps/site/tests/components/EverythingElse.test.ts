import { getAllByRole, getByRole, within } from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import EverythingElse from '../../src/components/posters/EverythingElse.astro';
import { EVERYTHING_ELSE, KIND_NAMES } from '../../src/content/everything-else';
import { postersByKind, type EventPoster } from '../../src/lib/posters';

const poster = (kind: EventPoster['kind'], event: string, file: string): EventPoster => ({
  kind,
  event,
  poster: `https://example.supabase.co/storage/v1/object/public/events-images/${file}`,
});

const ROWS = postersByKind([
  poster('review', 'CP216 Final Review', 'cp216.png'),
  poster('review', 'CP312 Midterm Review', 'cp312.png'),
  poster('social', 'AI Bingo', 'ai-bingo.png'),
]);

/** The section as a visitor's browser gets it. */
async function renderSection(): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(EverythingElse, {
    props: { copy: EVERYTHING_ELSE, names: KIND_NAMES, rows: ROWS },
  });
  return new JSDOM(html).window.document.body;
}

describe('EverythingElse', () => {
  it('has a row per kind, named and counted, in order', async () => {
    const page = await renderSection();
    const kinds = getAllByRole(page, 'heading', { level: 3 }).map((heading) => heading.textContent?.trim());
    expect(kinds).toEqual([KIND_NAMES.review, KIND_NAMES.social]);
    expect(getByRole(page, 'list', { name: `${KIND_NAMES.review} posters` })).toBeDefined();
  });

  it('lists each poster once for screen readers, as a button that opens it big', async () => {
    const page = await renderSection();
    const reviews = getByRole(page, 'list', { name: `${KIND_NAMES.review} posters` });
    const posters = within(reviews).getAllByRole('button');
    expect(posters.map((poster) => poster.getAttribute('aria-label'))).toEqual([
      'CP216 Final Review poster',
      'CP312 Midterm Review poster',
    ]);
    // The repeats that keep the row going round are skipped by screen readers.
    expect(getAllByRole(page, 'button', { name: /CP216 Final Review poster/ })).toHaveLength(1);
  });

  it('repeats a row enough to fill a lap of at least eight posters, twice, for the drift', async () => {
    const page = await renderSection();
    const social = page.querySelectorAll('[data-poster-row]')[1];
    if (!social) throw new Error('The socials row is missing.');
    // One AI Bingo poster: a lap is eight of it, and the track holds two laps.
    expect(social.getAttribute('data-lap')).toBe('8');
    expect(social.querySelectorAll('[data-tile]')).toHaveLength(16);
  });
});
