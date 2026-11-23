/**
 * Calendar dates for the site, always in the club's time zone (Toronto), never the visitor's or UTC: an event at
 * 9pm on the 26th is on the 26th for everyone. Dates are plain `YYYY-MM-DD` strings, the same shape the events
 * table stores, so they compare and sort as text.
 */

/** A calendar date as `YYYY-MM-DD`. */
export type IsoDate = string;

/** A time of day as 24-hour `HH:MM`, the shape the events table stores. */
export type ClockTime = string;

/** A calendar month: the year and the month number, 1 to 12. */
export type YearMonth = Readonly<{ year: number; month: number }>;

export const CLUB_TIME_ZONE = 'America/Toronto';

// en-CA writes dates as YYYY-MM-DD, which is exactly the shape we store.
const CLUB_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: CLUB_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Today's date in Toronto. */
export function clubToday(now: Date = new Date()): IsoDate {
  return CLUB_DATE.format(now);
}

/** The year and month a date falls in. */
export function monthOf(date: IsoDate): YearMonth {
  const [year, month] = date.split('-').map(Number);
  return { year, month };
}

/** The month after (or with a negative `by`, before) a month. */
export function addMonths({ year, month }: YearMonth, by: number): YearMonth {
  const index = year * 12 + (month - 1) + by;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** A date as `YYYY-MM-DD`. */
export function isoDate(year: number, month: number, day: number): IsoDate {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * A month laid out as calendar weeks, Sunday first. Days from the months either side are null, so every week
 * has seven cells and the grid lines up.
 */
export function monthGrid({ year, month }: YearMonth): ReadonlyArray<ReadonlyArray<IsoDate | null>> {
  // Date.UTC keeps this pure date maths: no time zone can move a day.
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<IsoDate | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => isoDate(year, month, index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
}

// Formatting a date-only value in UTC prints the date as written, whatever the server's time zone.
const parts = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', ...options });
const WEEKDAY = parts({ weekday: 'short' });
const MONTH = parts({ month: 'short' });
const MONTH_YEAR = parts({ month: 'long', year: 'numeric' });

const asUtc = (date: IsoDate): Date => new Date(`${date}T00:00:00Z`);

/** "Thu" for 2026-11-26. */
export function weekdayName(date: IsoDate): string {
  return WEEKDAY.format(asUtc(date)).replace('.', '');
}

/** 26 for 2026-11-26. */
export function dayOfMonth(date: IsoDate): number {
  return Number(date.slice(8));
}

/** "Nov" for 2026-11-26. */
export function monthName(date: IsoDate): string {
  return MONTH.format(asUtc(date)).replace('.', '');
}

/** "November 2026". */
export function monthTitle({ year, month }: YearMonth): string {
  return MONTH_YEAR.format(asUtc(isoDate(year, month, 1)));
}

/** "7:00PM" for "19:00", the way the posters write times. */
export function posterTime(time: ClockTime): string {
  const [hours, minutes] = time.split(':').map(Number);
  const twelve = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelve}:${String(minutes).padStart(2, '0')}${hours < 12 ? 'AM' : 'PM'}`;
}
