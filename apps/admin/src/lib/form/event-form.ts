/**
 * The event form's values and how they turn into what is saved. The rules (a title, a real date) come from
 * `EventSchema`, so the form and the rest of the admin can't disagree about them. Category and streaming fields
 * land in Phase 2's form UI; until then new events default to `social`.
 */
import { z } from 'zod';
import { EVENT_CATEGORIES, type Event, type EventFields, EventSchema, type EventStatus, type TicketFace } from '../../types/event';
import { dbTimeToPicker, dbTimeToStored, formatEventWhen, pickerTimeToDbTime, toPickerTime, toStoredTime } from '../time/dates';

export const EventFormSchema = z.object({
  title: EventSchema.shape.title,
  date: EventSchema.shape.date,
  /** `HH:MM` from the time picker, or empty for no start time. */
  time: z.string(),
  location: z.string(),
  description: z.string(),
});
export type EventFormValues = z.input<typeof EventFormSchema>;

/** Which fields the exec changed, as React Hook Form reports them. */
export type ChangedFields = Partial<Readonly<Record<keyof EventFormValues, boolean | undefined>>>;

/** An empty form for a new event. */
export const EMPTY_EVENT_FORM: EventFormValues = { title: '', date: '', time: '', location: '', description: '' };

/** The form filled in from a saved event. A time the picker can't show is left empty here. */
export function formValuesFor(event: Event): EventFormValues {
  return {
    title: event.title,
    date: event.date,
    time: event.startTime ? (dbTimeToPicker(event.startTime) ?? '') : '',
    location: event.location ?? '',
    description: event.description ?? '',
  };
}

/** The event's saved start time when the picker can't show it, so the form can show it as written. */
export function unreadableTime(event: Event): string | null {
  if (!event.startTime) return null;
  return dbTimeToPicker(event.startTime) === null ? dbTimeToStored(event.startTime) : null;
}

/** The form's values as they are saved: empty text as no value; category defaults until the form grows one. */
export function toEventFields(values: EventFormValues, category: Event['category'] = 'social'): EventFields {
  return {
    title: values.title.trim(),
    date: values.date,
    category,
    startTime: values.time ? pickerTimeToDbTime(values.time) : null,
    endTime: null,
    location: values.location.trim() || null,
    description: values.description.trim() || null,
    willStream: false,
    streamUrl: null,
  };
}

/**
 * The ticket for the form as it stands, so it can be seen before it is saved. `savedTime` is a saved time the
 * picker can't show (`unreadableTime`), kept while the time is left empty. `today` is `YYYY-MM-DD` in the club's zone.
 */
export function ticketPreview(
  values: EventFormValues,
  savedTime: string | null,
  pictureUrl: string | null,
  today: string,
): Readonly<{ face: TicketFace; status: EventStatus }> {
  const fields = toEventFields(values);
  const date = EventSchema.shape.date.safeParse(values.date).success ? values.date : null;
  const pickerStored = values.time ? toStoredTime(values.time) : null;
  return {
    face: {
      title: fields.title || 'Untitled event',
      date,
      time: pickerStored ?? savedTime,
      location: fields.location,
      pictureUrl,
    },
    status: date !== null && date < today ? 'past' : 'upcoming',
  };
}

/** Only the fields the exec changed, so saving an edit leaves everything else exactly as it was. */
export function changedEventFields(values: EventFormValues, changed: ChangedFields, category: Event['category']): Partial<EventFields> {
  const fields = toEventFields(values, category);
  return {
    ...(changed.title && { title: fields.title }),
    ...(changed.date && { date: fields.date }),
    ...(changed.time && { startTime: fields.startTime, endTime: fields.endTime }),
    ...(changed.location && { location: fields.location }),
    ...(changed.description && { description: fields.description }),
  };
}

/** Times shown on tickets and import views from v2's `start_time` / `end_time`. */
export function eventTimeLabel(event: Pick<Event, 'startTime' | 'endTime'>): string | null {
  return formatEventWhen(event.startTime, event.endTime);
}

/** What a ticket draws from a saved or previewed event. */
export function toTicketFace(event: Pick<Event, 'title' | 'date' | 'startTime' | 'endTime' | 'location' | 'pictureUrl'>): TicketFace {
  return {
    title: event.title,
    date: event.date,
    time: formatEventWhen(event.startTime, event.endTime),
    location: event.location,
    pictureUrl: event.pictureUrl,
  };
}

// Re-export for CSV parsing of free-text times in a spreadsheet.
export { toPickerTime };
export { EVENT_CATEGORIES };