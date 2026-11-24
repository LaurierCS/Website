import { describe, expect, it } from 'vitest';
import {
  addMonths,
  clubToday,
  dayOfMonth,
  fullDate,
  monthGrid,
  monthName,
  monthTitle,
  posterTime,
  weekdayName,
} from '../../src/lib/dates';

describe('clubToday', () => {
  it("gives Toronto's date, not UTC's: 11pm on the 26th in Toronto is still the 26th", () => {
    expect(clubToday(new Date('2026-11-27T04:00:00Z'))).toBe('2026-11-26');
  });
});

describe('monthGrid', () => {
  it('lays November 2026 out from Sunday the 1st, with blanks after the 30th to fill the last week', () => {
    const weeks = monthGrid({ year: 2026, month: 11 });
    expect(weeks[0]?.at(0)).toBe('2026-11-01');
    expect(weeks[0]?.at(6)).toBe('2026-11-07');
    expect(weeks.at(-1)).toEqual(['2026-11-29', '2026-11-30', null, null, null, null, null]);
  });

  it('starts with blanks when the 1st is not a Sunday (December 2026 starts on a Tuesday)', () => {
    expect(monthGrid({ year: 2026, month: 12 })[0]?.slice(0, 3)).toEqual([null, null, '2026-12-01']);
  });
});

describe('addMonths', () => {
  it('rolls over the end of the year both ways', () => {
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths({ year: 2027, month: 1 }, -1)).toEqual({ year: 2026, month: 12 });
  });
});

describe('formatting', () => {
  it('names the weekday and month of a date as written, whatever the time zone', () => {
    expect(weekdayName('2026-11-26')).toBe('Thu');
    expect(monthName('2026-11-26')).toBe('Nov');
    expect(dayOfMonth('2026-12-03')).toBe(3);
    expect(fullDate('2026-11-19')).toBe('Nov 19, 2026');
    expect(monthTitle({ year: 2026, month: 11 })).toBe('November 2026');
  });

  it.each([
    ['19:00', '7:00PM'],
    ['09:30', '9:30AM'],
    ['12:00', '12:00PM'],
    ['00:15', '12:15AM'],
  ])('writes %s as %s', (time, written) => {
    expect(posterTime(time)).toBe(written);
  });
});
