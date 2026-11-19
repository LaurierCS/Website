/**
 * Dates shown in the admin, always in the club's time zone (Toronto), never the viewer's.
 */
const CLUB_TIME_ZONE = 'America/Toronto';

const DAY = new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const DAY_LONG = new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: CLUB_TIME_ZONE });

/**
 * An event's `YYYY-MM-DD` day, e.g. "Thursday, November 12, 2026". The day is already a calendar date in the club's zone,
 * so it is formatted as-is (in UTC) rather than shifted by the viewer's zone.
 */
export function formatEventDay(isoDate: string): string {
  return DAY.format(new Date(`${isoDate}T00:00:00Z`));
}

/** A moment in time as a day in the club's zone, e.g. "Wednesday, November 25". */
export function formatClubDay(moment: Date): string {
  return DAY_LONG.format(moment);
}
