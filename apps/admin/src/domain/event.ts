/**
 * An LCS event as the admin works with it. Mirrors today's `events` table (docs/redesign.md); new fields such as
 * category and series are added here when their migration lands.
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
