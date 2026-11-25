/**
 * How events read in a CSV import: an event's name, every field in its details, and its lines on the print
 * order. The ticket itself is `ImportTicket`.
 */
import { shortEventDay } from '../../lib/time/dates';
import { eventTimeLabel } from '../../lib/form/event-form';
import type { Event, EventFields } from '../../types/event';
import type { FieldChange } from '../ui/FieldChanges';
import type { ImportEntry, ImportView, OrderItem } from '../ui/import-view';

type EventEntry = ImportEntry<Event, EventFields>;

/** The event as it will be once imported. */
export function importedEvent(entry: EventEntry): EventFields {
  return entry.kind === 'new' ? entry.item.fields : entry.item.after;
}

// What each column is called on the print order, in the words the ticket uses.
const ORDER_LABELS: Readonly<Record<string, string>> = { title: 'title', date: 'date', time: 'time', location: 'room', description: 'description' };

/** "→ BA201"; an emptied value reads "→ none". */
function becomes(value: string): string {
  return `→ ${value || 'none'}`;
}

function changeLines(entry: Extract<EventEntry, { kind: 'updated' }>): readonly OrderItem[] {
  return entry.item.cells.map(({ column, after }) => ({
    label: ORDER_LABELS[column] ?? column,
    // A description is too long for a receipt line; the event's details show what changed in it.
    value: column === 'description' ? 'edited' : becomes(column === 'date' ? shortEventDay(after) : after),
  }));
}

/** A field as the details show it. `before` is left out for a new event, which has nothing to compare. */
function field(label: string, before: string | undefined, after: string): FieldChange {
  return { label, before: before ?? null, after };
}

export const EVENT_IMPORT = {
  noun: { one: 'event', many: 'events' },
  piece: 'ticket',
  arrangement: 'rows',
  nameOf: (entry) => importedEvent(entry).title,
  fields: (entry) => {
    const was = entry.kind === 'updated' ? entry.item.before : undefined;
    const will = importedEvent(entry);
    return {
      short: [
        field('Title', was?.title, will.title),
        field('Date', was && shortEventDay(was.date), shortEventDay(will.date)),
        field('Time', was && (eventTimeLabel(was) ?? 'None'), eventTimeLabel(will) ?? 'None'),
        field('Room', was && (was.location ?? 'None'), will.location ?? 'None'),
      ],
      // Only an event with a description, before or after, has one to show.
      long:
        was?.description || will.description
          ? field('Description', was && (was.description ?? ''), will.description ?? '')
          : undefined,
    };
  },
  orderItems: (entry) => {
    if (entry.kind === 'updated') return changeLines(entry);
    const event = entry.item.fields;
    return [{ label: [shortEventDay(event.date), eventTimeLabel(event), event.location].filter(Boolean).join(' · '), value: '' }];
  },
} satisfies Omit<ImportView<Event, EventFields>, 'front'>;
