/**
 * Reading, adding, changing, importing and deleting events in Supabase, with their pictures. Rows are checked
 * and turned into `Event`s here, once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type Event, type EventFields, EventSchema } from '../types/event';
import type { ImportRows } from './csv-import';
import { UnavailableError } from './errors';
import type { PictureChange } from './images';
import { BUCKETS, removeImage, uploadImage } from './storage';
import { getSupabase } from './supabase';

type EventRow = Database['public']['Tables']['events']['Row'];

const COLUMNS = 'id, title, description, date, time, location, picture_url';

/**
 * Every event, newest first. Empty when there are none. A row that doesn't fit `Event` (say, a hand-edited
 * picture link that isn't a URL) is left out and logged, so one bad row can't hide every other event.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listEvents(): Promise<readonly Event[]> {
  const { data, error } = await getSupabase().from('events').select(COLUMNS).order('date', { ascending: false });
  if (error) throw new UnavailableError('Events could not be loaded.', { cause: error });
  return data.flatMap((row) => toEvent(row) ?? []);
}

/**
 * One event by id, or null when there is no such event (including an id that isn't a valid id at all).
 * @throws UnavailableError when Supabase cannot be reached, or the saved event has data the admin can't read.
 */
export async function getEvent(id: string): Promise<Event | null> {
  // The id comes from the URL; anything that isn't a uuid can't be an event, so don't ask Supabase.
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await getSupabase().from('events').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) throw new UnavailableError('This event could not be loaded.', { cause: error });
  if (!data) return null;
  const event = toEvent(data);
  if (!event) throw new UnavailableError("This event has saved data the admin can't read. It needs fixing in Supabase.");
  return event;
}

/**
 * Adds an event, uploading its picture first when one was chosen. If the event can't be saved, the uploaded
 * picture is deleted again so no unused file is left behind.
 * @throws UnavailableError when the picture or the event could not be saved.
 */
export async function createEvent(fields: EventFields, picture: PictureChange): Promise<void> {
  const newPictureUrl = picture.kind === 'replace' ? await uploadImage(BUCKETS.events, picture.image) : null;
  const { data, error } = await getSupabase()
    .from('events')
    .insert({ ...fields, picture_url: newPictureUrl })
    .select('id');
  // Row-level security refuses an insert by saving nothing rather than by failing, so check a row came back.
  if (error || data.length === 0) {
    if (newPictureUrl) await removeImage(BUCKETS.events, newPictureUrl);
    throw new UnavailableError(`"${fields.title}" couldn't be saved.`, { cause: error });
  }
}

/**
 * Saves only the fields given, so anything the exec didn't touch stays exactly as it was, and applies the
 * picture change. A new picture is uploaded before the row changes and the old file is deleted only after, so
 * a failure part-way never leaves the event pointing at a missing picture.
 * @throws UnavailableError when it could not be saved (Supabase down, the event is gone, or the update was refused).
 */
export async function updateEvent(event: Event, changes: Partial<EventFields>, picture: PictureChange): Promise<void> {
  const newPictureUrl = picture.kind === 'replace' ? await uploadImage(BUCKETS.events, picture.image) : null;
  const row = picture.kind === 'keep' ? changes : { ...changes, picture_url: newPictureUrl };
  const { data, error } = await getSupabase().from('events').update(row).eq('id', event.id).select('id');
  // Row-level security refuses an update by changing nothing rather than by failing, so check a row came back.
  if (error || data.length === 0) {
    if (newPictureUrl) await removeImage(BUCKETS.events, newPictureUrl);
    throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
  }
  if (picture.kind !== 'keep' && event.pictureUrl) await removeImage(BUCKETS.events, event.pictureUrl);
}

/**
 * Deletes an event, then its picture if the picture is a file in our events bucket; a picture linked from
 * anywhere else is left alone. The row goes first, so the site never shows an event whose picture is gone.
 * @throws UnavailableError when the event could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteEvent(event: Event): Promise<void> {
  const failure = `"${event.title}" couldn't be deleted.`;
  const { data, error } = await getSupabase().from('events').delete().eq('id', event.id).select('id');
  if (error) throw new UnavailableError(failure, { cause: error });
  // Row-level security refuses a delete by deleting nothing rather than by failing, so check a row came back.
  if (data.length === 0) throw new UnavailableError(failure);
  if (event.pictureUrl) await removeImage(BUCKETS.events, event.pictureUrl);
}

/**
 * Saves a checked CSV import in one go: the new events first, then every field of the changed ones (by `id`).
 * The database saves all of it or none of it, and never touches pictures or deletes anything.
 * @throws UnavailableError when nothing could be saved (Supabase down, the import refused, or a changed event gone).
 */
export async function importEvents({ added, changed }: ImportRows<EventFields>): Promise<void> {
  const { error } = await getSupabase().rpc('import_events', {
    new_rows: [...added],
    changed_rows: changed.map(({ id, fields }) => ({ id, ...fields })),
  });
  if (error) throw new UnavailableError("The import couldn't be saved, so nothing was changed.", { cause: error });
}

/**
 * Renames `picture_url`, the one column spelled differently. Older events store "no photo" as an empty
 * `picture_url` as well as null (the site treats both as no photo), so both become null. Null when the row is
 * malformed; the row's id and the problem are logged (never the row's text) so it can be fixed in Supabase.
 */
function toEvent(row: Pick<EventRow, 'id' | 'title' | 'description' | 'date' | 'time' | 'location' | 'picture_url'>): Event | null {
  const parsed = EventSchema.safeParse({ ...row, pictureUrl: row.picture_url === '' ? null : row.picture_url });
  if (parsed.success) return parsed.data;
  console.warn('events.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}
