/**
 * Dates and times shown in the admin, always in the club's time zone (Toronto), never the viewer's.
 */
const CLUB_TIME_ZONE = 'America/Toronto';

const DAY = new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
// en-CA writes dates as YYYY-MM-DD, the same shape as an event's `date`.
const ISO_DAY = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: CLUB_TIME_ZONE });

/**
 * An event's `YYYY-MM-DD` day, e.g. "Thursday, November 12, 2026". The day is already a calendar date in the club's zone,
 * so it is formatted as-is (in UTC) rather than shifted by the viewer's zone.
 */
export function formatEventDay(isoDate: string): string {
  return DAY.format(new Date(`${isoDate}T00:00:00Z`));
}

/**
 * Today as `YYYY-MM-DD` in the club's zone, to compare with an event's `date`. Late on a Tuesday evening it is
 * still Tuesday here, even though it is already Wednesday in UTC.
 */
export function clubToday(now: Date = new Date()): string {
  return ISO_DAY.format(now);
}

// How the site and the table write an event's time: "7:30PM". Older rows sometimes have a space or lower case.
const STORED_TIME = /^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?$/i;

/** A time picker's `19:30` written the way events store it, `7:30PM`. */
export function toStoredTime(pickerTime: string): string {
  const [hours = 0, minutes = 0] = pickerTime.split(':').map(Number);
  const suffix = hours < 12 ? 'AM' : 'PM';
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}${suffix}`;
}

/**
 * A stored time such as `7:30PM`, `7:30 pm` or `7PM` as a time picker's `19:30`. Null when the text isn't a
 * time (say, "TBD"), so the form can show it as written instead of guessing.
 */
export function toPickerTime(stored: string): string | null {
  const match = STORED_TIME.exec(stored.trim());
  if (!match) return null;
  const [, hourText = '', minuteText = '00', half = ''] = match;
  const hours = Number(hourText);
  const minutes = Number(minuteText);
  if (hours < 1 || hours > 12 || minutes > 59) return null;
  const hours24 = (hours % 12) + (half.toLowerCase() === 'p' ? 12 : 0);
  return `${String(hours24).padStart(2, '0')}:${minuteText}`;
}
