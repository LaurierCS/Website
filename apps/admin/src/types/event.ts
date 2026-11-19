/**
 * An LCS event as the admin works with it, matching today's `events` table. New fields (category, series) are
 * added here when their migration lands.
 */
import { z } from 'zod';

export const EventSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1),
  description: z.string().nullable(),
  /** The day, as `YYYY-MM-DD` in the club's time zone. */
  date: z.iso.date(),
  /** Free text such as "7:30PM", as entered today. */
  time: z.string().nullable(),
  location: z.string().nullable(),
  pictureUrl: z.url().nullable(),
});
export type Event = Readonly<z.infer<typeof EventSchema>>;

/** Whether an event is today or later. `today` is `YYYY-MM-DD` in the club's zone (`clubToday()`). */
export function isUpcoming(event: Event, today: string): boolean {
  // Both are YYYY-MM-DD, so comparing the text compares the days.
  return event.date >= today;
}
