import { describe, expect, it } from 'vitest';
import type { ClubEvent } from '../../src/content/events';
import { calendarMonths, upcomingEvents } from '../../src/lib/events';

const event = (id: string, date: string, time: string | null = '18:00'): ClubEvent => ({
  id,
  title: id,
  date,
  time,
  location: null,
  photoUrl: null,
});

describe('upcomingEvents', () => {
  it('keeps today and later, soonest first, earlier times first and unknown times last on a shared day', () => {
    const events = [
      event('later', '2026-12-03'),
      event('past', '2026-11-12'),
      event('today-tba', '2026-11-23', null),
      event('today-evening', '2026-11-23', '19:00'),
      event('today-noon', '2026-11-23', '12:00'),
    ];
    expect(upcomingEvents(events, '2026-11-23').map((e) => e.id)).toEqual([
      'today-noon',
      'today-evening',
      'today-tba',
      'later',
    ]);
  });

  it('is empty when nothing is coming up', () => {
    expect(upcomingEvents([event('past', '2026-11-12')], '2026-11-23')).toEqual([]);
  });
});

describe('calendarMonths', () => {
  it('runs from this month to the month of the last upcoming event', () => {
    const upcoming = [event('a', '2026-11-26'), event('b', '2027-01-08')];
    expect(calendarMonths('2026-11-23', upcoming)).toEqual([
      { year: 2026, month: 11 },
      { year: 2026, month: 12 },
      { year: 2027, month: 1 },
    ]);
  });

  it('is just this month when nothing is coming up', () => {
    expect(calendarMonths('2026-11-23', [])).toEqual([{ year: 2026, month: 11 }]);
  });
});
