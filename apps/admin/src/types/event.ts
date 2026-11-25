/**
 * An LCS event as the admin works with it, matching the v2 `events` table and its cover photo.
 */
import { z } from 'zod';

export const EVENT_CATEGORIES = ['review', 'social', 'career', 'workshop', 'hackathon', 'meet_the_pros'] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EventSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, 'Give the event a title.'),
  description: z.string().nullable(),
  /** The day, as `YYYY-MM-DD` in the club's time zone. */
  date: z.iso.date('Pick the day of the event.'),
  category: z.enum(EVENT_CATEGORIES),
  /** PostgreSQL `time`, e.g. `17:30:00`. */
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  location: z.string().nullable(),
  willStream: z.boolean(),
  streamUrl: z.url().nullable(),
  /** Path in the `event-media` bucket for the cover photo, when there is one. */
  coverPath: z.string().nullable(),
  coverPhotoId: z.uuid().nullable(),
  pictureUrl: z.url().nullable(),
});
export type Event = Readonly<z.infer<typeof EventSchema>>;

/** The parts of an event an exec types in. Their names mirror the app's fields, then map to v2 columns in `events.ts`. */
export type EventFields = Readonly<
  Pick<Event, 'title' | 'date' | 'category' | 'startTime' | 'endTime' | 'location' | 'description' | 'willStream' | 'streamUrl'>
>;

/** What an event's ticket shows. A ticket for an event still being filled in may not have a day yet. */
export type TicketFace = Readonly<Pick<Event, 'title' | 'location' | 'pictureUrl'> & { date: string | null; time: string | null }>;

/**
 * Whether an event, saved or about to be, is today or later. `today` is `YYYY-MM-DD` in the club's zone
 * (`clubToday()`).
 */
export function isUpcoming(event: Pick<Event, 'date'>, today: string): boolean {
  // Both are YYYY-MM-DD, so comparing the text compares the days.
  return event.date >= today;
}

/** Where an event sits in time: the very next one, any other one still to come, or one that has happened. */
export const EVENT_STATUSES = ['next-up', 'upcoming', 'past'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type EventWithStatus = Readonly<{ event: Event; status: EventStatus }>;

/**
 * Each event with its status, in the order given. "Next up" is the soonest event dated today or later; when two
 * share that day, the first one given wins. `today` is `YYYY-MM-DD` in the club's zone (`clubToday()`).
 */
export function withStatuses(events: readonly Event[], today: string): readonly EventWithStatus[] {
  const nextUp = events
    .filter((event) => isUpcoming(event, today))
    // Dates are YYYY-MM-DD, so comparing the text compares the days.
    .reduce<Event | undefined>((soonest, event) => (soonest === undefined || event.date < soonest.date ? event : soonest), undefined);
  return events.map((event) => ({
    event,
    status: event === nextUp ? 'next-up' : isUpcoming(event, today) ? 'upcoming' : 'past',
  }));
}