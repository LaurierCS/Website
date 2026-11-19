/** The events, one row each, in the order given. */
import { clubToday } from '../../lib/dates';
import type { Event } from '../../types/event';
import { EventRow } from './EventRow';

export function EventList({ events }: { events: readonly Event[] }) {
  const today = clubToday();
  return (
    <ul className="grid gap-3">
      {events.map((event) => (
        <EventRow key={event.id} event={event} today={today} />
      ))}
    </ul>
  );
}
