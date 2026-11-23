/**
 * What the coming-up calendar shows on each day: a coming-up event that has a ticket (in its ticket's colour),
 * or an event that has already happened. Other days are plain.
 */
import type { ClubEvent } from '../../content/events';
import type { IsoDate } from '../../lib/dates';
import {
  TICKET_ACCENTS,
  TICKET_MASCOTS,
  type TicketAccent,
  type TicketMascot,
} from './event-accents';

/**
 * A coming-up event with a ticket (its colour, its mascot sticker and its place in the list), or an event that
 * has passed.
 */
export type DayMark =
  | Readonly<{
      kind: 'ticket';
      eventId: string;
      title: string;
      accent: TicketAccent;
      mascot: TicketMascot;
      order: number;
    }>
  | Readonly<{ kind: 'past'; title: string }>;

/**
 * The marks by date. Ticketed events take the accents and mascots in order; a day with two events keeps the
 * first one's mark. Coming-up events past the shown tickets get no mark, since there is no ticket to point at.
 */
export function dayMarks(
  events: readonly ClubEvent[],
  ticketed: readonly ClubEvent[],
  today: IsoDate,
): ReadonlyMap<IsoDate, DayMark> {
  const marks = new Map<IsoDate, DayMark>();
  ticketed.forEach((event, order) => {
    if (marks.has(event.date)) return;
    const accent = TICKET_ACCENTS[order % TICKET_ACCENTS.length];
    const mascot = TICKET_MASCOTS[order % TICKET_MASCOTS.length];
    marks.set(event.date, { kind: 'ticket', eventId: event.id, title: event.title, accent, mascot, order });
  });
  for (const event of events) {
    if (event.date < today && !marks.has(event.date)) marks.set(event.date, { kind: 'past', title: event.title });
  }
  return marks;
}
