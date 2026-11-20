/**
 * An LCS event as the admin works with it, matching today's `events` table. New fields (category, series) are
 * added here when their migration lands.
 */
import { z } from 'zod';

export const EventSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, 'Give the event a title.'),
  description: z.string().nullable(),
  /** The day, as `YYYY-MM-DD` in the club's time zone. */
  date: z.iso.date('Pick the day of the event.'),
  /** Free text such as "7:30PM", as entered today. */
  time: z.string().nullable(),
  location: z.string().nullable(),
  pictureUrl: z.url().nullable(),
});
export type Event = Readonly<z.infer<typeof EventSchema>>;

/** The parts of an event an exec types in. Their names match the `events` columns, so they are saved as they are. */
export type EventFields = Pick<Event, 'title' | 'date' | 'time' | 'location' | 'description'>;

/** Whether an event is today or later. `today` is `YYYY-MM-DD` in the club's zone (`clubToday()`). */
export function isUpcoming(event: Event, today: string): boolean {
  // Both are YYYY-MM-DD, so comparing the text compares the days.
  return event.date >= today;
}
