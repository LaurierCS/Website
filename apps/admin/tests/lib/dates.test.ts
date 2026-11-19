import { clubToday } from '../../src/lib/dates';

describe('clubToday', () => {
  it("is still the club's day late in the evening, when UTC has moved on", () => {
    // 9:30pm Tuesday in Toronto is 2:30am Wednesday in UTC.
    expect(clubToday(new Date('2026-11-18T02:30:00Z'))).toBe('2026-11-17');
  });

  it('turns over at midnight in Toronto', () => {
    expect(clubToday(new Date('2026-11-18T05:00:00Z'))).toBe('2026-11-18');
  });
});
