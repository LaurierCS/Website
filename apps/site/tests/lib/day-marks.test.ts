import { describe, expect, it } from 'vitest';
import { dayMarks } from '../../src/components/events/day-marks';
import type { ClubEvent } from '../../src/content/events';

const event = (id: string, date: string): ClubEvent => ({
  id,
  title: `Title of ${id}`,
  date,
  time: '18:00',
  location: null,
  photoUrl: null,
});

describe('dayMarks', () => {
  const past = event('past', '2026-11-12');
  const first = event('first', '2026-11-26');
  const second = event('second', '2026-11-28');
  const unshown = event('unshown', '2026-12-10');
  const marks = dayMarks([past, first, second, unshown], [first, second], '2026-11-23');

  it("gives ticketed days their ticket's colour and mascot in order: pink and Doug, then yellow and Coco", () => {
    expect(marks.get('2026-11-26')).toEqual({
      kind: 'ticket',
      eventId: 'first',
      title: 'Title of first',
      accent: 'pink',
      mascot: 'doug',
      order: 0,
    });
    expect(marks.get('2026-11-28')).toMatchObject({ kind: 'ticket', accent: 'yellow', mascot: 'coco', order: 1 });
  });

  it('marks events that have passed, and leaves coming-up events without a ticket unmarked', () => {
    expect(marks.get('2026-11-12')).toEqual({ kind: 'past', title: 'Title of past' });
    expect(marks.has('2026-12-10')).toBe(false);
  });

  it('keeps the first ticket when two events share a day', () => {
    const same = event('same-day', '2026-11-26');
    const shared = dayMarks([first, same], [first, same], '2026-11-23');
    expect(shared.get('2026-11-26')).toMatchObject({ eventId: 'first' });
  });
});
