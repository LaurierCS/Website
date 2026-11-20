/**
 * Reading, adding, changing and deleting events in Supabase. Rows are checked and turned into `Event`s here,
 * once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type Event, type EventFields, EventSchema } from '../types/event';
import { UnavailableError } from './errors';
import { getSupabase } from './supabase';

type EventRow = Database['public']['Tables']['events']['Row'];

const COLUMNS = 'id, title, description, date, time, location, picture_url';

/** The storage bucket that holds event pictures uploaded through LCS tools. */
const EVENTS_BUCKET = 'events-images';

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
 * Adds an event with no picture yet.
 * @throws UnavailableError when it could not be saved (Supabase down, or the insert was refused).
 */
export async function createEvent(fields: EventFields): Promise<void> {
  const failure = `"${fields.title}" couldn't be saved.`;
  const { data, error } = await getSupabase().from('events').insert(fields).select('id');
  if (error) throw new UnavailableError(failure, { cause: error });
  if (data.length === 0) throw new UnavailableError(failure);
}

/**
 * Saves only the fields given, so anything the exec didn't touch stays exactly as it was.
 * @throws UnavailableError when it could not be saved (Supabase down, the event is gone, or the update was refused).
 */
export async function updateEvent(id: string, changes: Partial<EventFields>): Promise<void> {
  const failure = "Your changes couldn't be saved.";
  const { data, error } = await getSupabase().from('events').update(changes).eq('id', id).select('id');
  if (error) throw new UnavailableError(failure, { cause: error });
  // Row-level security refuses an update by changing nothing rather than by failing, so check a row came back.
  if (data.length === 0) throw new UnavailableError(failure);
}

/**
 * Deletes an event, then its picture if the picture is a file in our `events-images` bucket. A picture linked
 * from anywhere else is left alone. The row goes first, so the site never shows an event whose picture is gone.
 * If the picture can't be removed after that, the event is still deleted; the leftover file is logged.
 * @throws UnavailableError when the event could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteEvent(event: Event): Promise<void> {
  const supabase = getSupabase();
  const failure = `"${event.title}" couldn't be deleted.`;
  const { data, error } = await supabase.from('events').delete().eq('id', event.id).select('id');
  if (error) throw new UnavailableError(failure, { cause: error });
  // Row-level security refuses a delete by deleting nothing rather than by failing, so check a row came back.
  if (data.length === 0) throw new UnavailableError(failure);

  const imagePath = event.pictureUrl && pathInEventsBucket(event.pictureUrl);
  if (!imagePath) return;
  const removed = await supabase.storage.from(EVENTS_BUCKET).remove([imagePath]);
  if (removed.error) console.warn('events.image_not_removed', { id: event.id, path: imagePath });
}

/** The file's path inside our events bucket, or null when the URL points somewhere else. */
function pathInEventsBucket(url: string): string | null {
  const bucketUrl = getSupabase().storage.from(EVENTS_BUCKET).getPublicUrl('').data.publicUrl;
  if (!url.startsWith(bucketUrl)) return null;
  // Public URLs escape characters such as spaces in file names; storage wants the name as written.
  return decodeURIComponent(url.slice(bucketUrl.length));
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
