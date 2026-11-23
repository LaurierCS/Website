/**
 * Which events the home page shows: what is coming up, and which months the calendar can show.
 */
import type { ClubEvent } from '../content/events';
import { addMonths, monthOf, type IsoDate, type YearMonth } from './dates';

/** Events on or after `today`, soonest first (same day: earliest time first, unknown times last). */
export function upcomingEvents(events: readonly ClubEvent[], today: IsoDate): readonly ClubEvent[] {
  return events
    .filter((event) => event.date >= today)
    .toSorted((a, b) => a.date.localeCompare(b.date) || (a.time ?? '99').localeCompare(b.time ?? '99'));
}

/**
 * The months the calendar can step through: from this month to the month of the last upcoming event, so the
 * arrows never lead to a stretch of empty months. Just this month when nothing is coming up.
 */
export function calendarMonths(today: IsoDate, upcoming: readonly ClubEvent[]): readonly YearMonth[] {
  const first = monthOf(today);
  const last = upcoming.length > 0 ? monthOf(upcoming[upcoming.length - 1].date) : first;
  const count = (last.year - first.year) * 12 + (last.month - first.month) + 1;
  return Array.from({ length: count }, (_, index) => addMonths(first, index));
}
