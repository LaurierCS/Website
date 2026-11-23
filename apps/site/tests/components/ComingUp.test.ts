import {
  getAllByRole,
  getAllByText,
  getByRole,
  getByText,
  queryAllByText,
  queryByRole,
} from '@testing-library/dom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import ComingUp from '../../src/components/events/ComingUp.astro';
import type { ClubEvent } from '../../src/content/events';

const event = (id: string, title: string, date: string, extra: Partial<ClubEvent> = {}): ClubEvent => ({
  id,
  title,
  date,
  time: '18:00',
  location: 'BA201',
  photoUrl: null,
  ...extra,
});

const past = event('mtp', 'Meet the Professionals', '2026-11-12');
const upcoming = [
  event('study', 'Study n Chill', '2026-11-26'),
  event('games', 'Game Night', '2026-11-28', { time: null, location: null }),
  event('review', 'CP312 Final Review', '2026-12-03'),
  event('social', 'Holiday Social', '2026-12-10'),
];

/** "Coming up" as a visitor's browser gets it. */
async function renderComingUp(next: readonly ClubEvent[]): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ComingUp, {
    props: { events: [past, ...next], upcoming: next, today: '2026-11-23' },
  });
  return new JSDOM(html).window.document.body;
}

describe('ComingUp', () => {
  it('shows the next three events as tickets, soonest first', async () => {
    const page = await renderComingUp(upcoming);
    const tickets = getAllByRole(getByRole(page, 'list', { name: 'Next events' }), 'heading');
    const titles = tickets.map((ticket) => ticket.textContent);
    expect(titles).toEqual(['Study n Chill', 'Game Night', 'CP312 Final Review']);
  });

  it('stamps only the soonest ticket "Next up"; the others are tagged "Upcoming"', async () => {
    const page = await renderComingUp(upcoming);
    const next = page.querySelector<HTMLElement>('#event-study');
    if (!next) throw new Error('The first ticket is missing.');
    expect(getAllByText(next, 'Next up').length).toBeGreaterThan(0);
    expect(queryAllByText(next, 'Upcoming')).toEqual([]);
    expect(getAllByText(page, 'Upcoming').length).toBeGreaterThanOrEqual(2);
  });

  it('says TBA when the time or room is not known yet', async () => {
    const page = await renderComingUp(upcoming);
    expect(getByText(page, 'Time TBA')).toBeDefined();
    expect(getByText(page, 'Location TBA')).toBeDefined();
  });

  it('links each ticketed day on the calendar to its ticket', async () => {
    const page = await renderComingUp(upcoming);
    const day = getByRole(page, 'link', { name: '26: Study n Chill' });
    expect(day.getAttribute('href')).toBe('#event-study');
    expect(page.querySelector('#event-study')).not.toBeNull();
  });

  it('marks past events on the calendar for screen readers', async () => {
    expect(getByText(await renderComingUp(upcoming), /Meet the Professionals \(past event\)/)).toBeDefined();
  });

  it('shows a note instead of tickets when nothing is coming up', async () => {
    const page = await renderComingUp([]);
    expect(queryByRole(page, 'list', { name: 'Next events' })).toBeNull();
    expect(getByText(page, 'Nothing on the calendar yet.')).toBeDefined();
  });
});
