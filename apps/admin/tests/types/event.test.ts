import { type Event, withStatuses } from '../../src/types/event';

function event(title: string, date: string): Event {
  return { id: crypto.randomUUID(), title, description: null, date, time: null, location: null, pictureUrl: null };
}

/** Titles with their statuses, for readable expectations. */
function statuses(events: readonly Event[], today: string) {
  return withStatuses(events, today).map(({ event: { title }, status }) => [title, status]);
}

describe('withStatuses', () => {
  it('marks the soonest event still to come as next up, later ones as upcoming and earlier ones as past', () => {
    const events = [event('Final review', '2026-12-03'), event('Hack Night', '2026-11-26'), event('Midterm review', '2026-11-18')];

    expect(statuses(events, '2026-11-20')).toEqual([
      ['Final review', 'upcoming'],
      ['Hack Night', 'next-up'],
      ['Midterm review', 'past'],
    ]);
  });

  it('counts an event today as next up, not past', () => {
    expect(statuses([event('Hack Night', '2026-11-20')], '2026-11-20')).toEqual([['Hack Night', 'next-up']]);
  });

  it('gives next up to the first of two events on the same day', () => {
    const events = [event('Workshop', '2026-11-26'), event('Social', '2026-11-26')];

    expect(statuses(events, '2026-11-20')).toEqual([
      ['Workshop', 'next-up'],
      ['Social', 'upcoming'],
    ]);
  });

  it('has no next up when every event has happened', () => {
    expect(statuses([event('Club Fair', '2026-09-16')], '2026-11-20')).toEqual([['Club Fair', 'past']]);
  });
});
