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

const SHORT_DAY = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

/** An event's `YYYY-MM-DD` day where space is short, e.g. "Sat, Nov 21". Formatted in UTC, like `formatEventDay`. */
export function shortEventDay(isoDate: string): string {
  return SHORT_DAY.format(new Date(`${isoDate}T00:00:00Z`));
}

const STUB_WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });
const STUB_DAY = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' });
const STUB_MONTH = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** An event's `YYYY-MM-DD` day in the pieces a ticket stub prints: "Thu", "26" and "Nov 2026". */
export function stubDay(isoDate: string): Readonly<{ weekday: string; day: string; month: string }> {
  // Formatted in UTC for the same reason as `formatEventDay`: the day is already the club's.
  const date = new Date(`${isoDate}T00:00:00Z`);
  return { weekday: STUB_WEEKDAY.format(date), day: STUB_DAY.format(date), month: STUB_MONTH.format(date) };
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

/** A PostgreSQL `time` (`17:30:00`) as a time picker's `17:30`. */
export function dbTimeToPicker(dbTime: string): string | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(dbTime.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
}

/** A time picker's `19:30` as PostgreSQL `time`, `19:30:00`. */
export function pickerTimeToDbTime(pickerTime: string): string {
  const [hours = 0, minutes = 0] = pickerTime.split(':').map(Number);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

/** A PostgreSQL `time` written the way tickets and CSV files show it, e.g. `7:30PM`. */
export function dbTimeToStored(dbTime: string): string {
  const picker = dbTimeToPicker(dbTime);
  if (!picker) return dbTime;
  return toStoredTime(picker);
}

/** Start and end times for a ticket line; null when the start isn't set. */
export function formatEventWhen(startTime: string | null, endTime: string | null): string | null {
  if (!startTime) return null;
  const start = dbTimeToStored(startTime);
  if (!endTime) return start;
  return `${start} - ${dbTimeToStored(endTime)}`;
}
