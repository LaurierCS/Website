import { clubToday, stubDay, toPickerTime, toStoredTime } from '../../src/lib/dates';

describe('stubDay', () => {
  it('splits a day into the weekday, the day of the month and the month with its year', () => {
    expect(stubDay('2026-11-26')).toEqual({ weekday: 'Thu', day: '26', month: 'Nov 2026' });
  });

  it('writes the first of the month without a leading zero', () => {
    expect(stubDay('2026-12-01')).toEqual({ weekday: 'Tue', day: '1', month: 'Dec 2026' });
  });
});

describe('clubToday', () => {
  it("is still the club's day late in the evening, when UTC has moved on", () => {
    // 9:30pm Tuesday in Toronto is 2:30am Wednesday in UTC.
    expect(clubToday(new Date('2026-11-18T02:30:00Z'))).toBe('2026-11-17');
  });

  it('turns over at midnight in Toronto', () => {
    expect(clubToday(new Date('2026-11-18T05:00:00Z'))).toBe('2026-11-18');
  });
});

describe('toStoredTime', () => {
  it.each([
    ['19:30', '7:30PM'],
    ['09:05', '9:05AM'],
    ['12:00', '12:00PM'],
    ['00:15', '12:15AM'],
  ])('writes %s as %s', (picker, stored) => {
    expect(toStoredTime(picker)).toBe(stored);
  });
});

describe('toPickerTime', () => {
  it.each([
    ['7:30PM', '19:30'],
    ['7:30 pm', '19:30'],
    ['7PM', '19:00'],
    ['12:15AM', '00:15'],
    ['12:00PM', '12:00'],
    ['9:05 a.m.', '09:05'],
  ])('reads %s as %s', (stored, picker) => {
    expect(toPickerTime(stored)).toBe(picker);
  });

  it.each(['TBD', '13:00PM', '7:75PM', '19:30', ''])('gives up on %j instead of guessing', (stored) => {
    expect(toPickerTime(stored)).toBeNull();
  });
});
