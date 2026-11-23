/**
 * An event in a CSV import, drawn as the ticket it will be: labelled new or updated, with a highlighter over
 * the values on its face that the import changes. Pictures aren't in a CSV, so a new event has none yet.
 */
import { clubToday } from '../../lib/dates';
import { type Event, type EventFields, isUpcoming, type TicketFace } from '../../types/event';
import type { ImportEntry } from '../ui/import-view';
import { importedEvent } from './event-import';
import { Ticket } from './Ticket';

// The values on a ticket's face that a CSV can change; a description is only in the details.
const FACE_FIELDS: readonly (keyof TicketFace)[] = ['title', 'date', 'time', 'location'];

export function ImportTicket({ entry }: { entry: ImportEntry<Event, EventFields> }) {
  const event = importedEvent(entry);
  const face = { ...event, pictureUrl: entry.kind === 'updated' ? entry.item.after.pictureUrl : null };
  const marked = new Set(entry.kind === 'updated' ? FACE_FIELDS.filter((key) => entry.item.cells.some((cell) => cell.column === key)) : []);
  // "Next up" depends on every other event, so an imported one is upcoming or past, like the form's preview.
  const status = isUpcoming(event, clubToday()) ? 'upcoming' : 'past';
  return <Ticket face={face} status={status} importKind={entry.kind} marked={marked} />;
}
