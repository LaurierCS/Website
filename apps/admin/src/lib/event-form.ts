/**
 * The event form's values and how they turn into what is saved. The rules (a title, a real date) come from
 * `EventSchema`, so the form and the rest of the admin can't disagree about them.
 */
import { z } from 'zod';
import { type Event, type EventFields, EventSchema } from '../types/event';
import { toPickerTime, toStoredTime } from './dates';

export const EventFormSchema = z.object({
  title: EventSchema.shape.title,
  date: EventSchema.shape.date,
  /** `HH:MM` from the time picker, or empty for no time. */
  time: z.string(),
  location: z.string(),
  description: z.string(),
});
export type EventFormValues = z.input<typeof EventFormSchema>;

/** Which fields the exec changed, as React Hook Form reports them. */
export type ChangedFields = Partial<Readonly<Record<keyof EventFormValues, boolean | undefined>>>;

/** An empty form for a new event. */
export const EMPTY_EVENT_FORM: EventFormValues = { title: '', date: '', time: '', location: '', description: '' };

/** The form filled in from a saved event. A time the picker can't show (say, "TBD") is left empty here. */
export function formValuesFor(event: Event): EventFormValues {
  return {
    title: event.title,
    date: event.date,
    time: event.time ? (toPickerTime(event.time) ?? '') : '',
    location: event.location ?? '',
    description: event.description ?? '',
  };
}

/** The event's saved time when the picker can't show it (say, "TBD"), so the form can show it as written. */
export function unreadableTime(event: Event): string | null {
  return event.time && toPickerTime(event.time) === null ? event.time : null;
}

/** The form's values as they are saved: times like `7:30PM`, and empty text as no value. */
export function toEventFields(values: EventFormValues): EventFields {
  return {
    title: values.title.trim(),
    date: values.date,
    time: values.time ? toStoredTime(values.time) : null,
    location: values.location.trim() || null,
    description: values.description.trim() || null,
  };
}

/** Only the fields the exec changed, so saving an edit leaves everything else exactly as it was. */
export function changedEventFields(values: EventFormValues, changed: ChangedFields): Partial<EventFields> {
  const fields = toEventFields(values);
  return {
    ...(changed.title && { title: fields.title }),
    ...(changed.date && { date: fields.date }),
    ...(changed.time && { time: fields.time }),
    ...(changed.location && { location: fields.location }),
    ...(changed.description && { description: fields.description }),
  };
}
