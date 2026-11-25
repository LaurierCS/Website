/**
 * Reading, adding, changing, importing and deleting events in Supabase v2, with cover photos. Rows are checked
 * and turned into `Event`s here, once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type Event, type EventFields, EventSchema } from '../types/event';
import type { ImportRows } from './csv-import';
import { UnavailableError } from './errors';
import type { PictureChange } from './images';
import { BUCKETS, publicUrl, removeImage, uploadImage } from './storage';
import { getSupabase } from './supabase';

type EventRow = Database['v2']['Tables']['events']['Row'];
type EventInsert = Database['v2']['Tables']['events']['Insert'];
type EventUpdate = Database['v2']['Tables']['events']['Update'];
type PhotoRow = Pick<Database['v2']['Tables']['event_photos']['Row'], 'id' | 'path' | 'is_cover'>;

const COLUMNS =
  'id, title, description, date, start_time, end_time, location, category, will_stream, stream_url, event_photos(id, path, is_cover)';

const v2 = () => getSupabase().schema('v2');

/**
 * Every event, newest first. Empty when there are none. A row that doesn't fit `Event` (say, a hand-edited
 * picture link that isn't a URL) is left out and logged, so one bad row can't hide every other event.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listEvents(): Promise<readonly Event[]> {
  const { data, error } = await v2().from('events').select(COLUMNS).order('date', { ascending: false });
  if (error) throw new UnavailableError('Events could not be loaded.', { cause: error });
  return data.flatMap((row) => toEvent(row) ?? []);
}

/**
 * One event by id, or null when there is no such event (including an id that isn't a valid id at all).
 * @throws UnavailableError when Supabase cannot be reached, or the saved event has data the admin can't read.
 */
export async function getEvent(id: string): Promise<Event | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await v2().from('events').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) throw new UnavailableError('This event could not be loaded.', { cause: error });
  if (!data) return null;
  const event = toEvent(data);
  if (!event) throw new UnavailableError("This event has saved data the admin can't read. It needs fixing in Supabase.");
  return event;
}

/**
 * Adds an event, uploading its cover photo after the row exists so the file can live under `<event_id>/photos/`.
 * @throws UnavailableError when the picture or the event could not be saved.
 */
export async function createEvent(fields: EventFields, picture: PictureChange): Promise<void> {
  const { data, error } = await v2().from('events').insert(toInsert(fields)).select('id');
  if (error || data.length === 0) throw new UnavailableError(`"${fields.title}" couldn't be saved.`, { cause: error });
  const eventId = data[0]?.id;
  if (!eventId) throw new UnavailableError(`"${fields.title}" couldn't be saved.`);
  try {
    await applyCoverPhoto(eventId, picture, { coverPath: null, coverPhotoId: null });
  } catch (cause) {
    await v2().from('events').delete().eq('id', eventId);
    throw cause;
  }
}

/**
 * Saves only the fields given and applies the picture change. Cover photos upload before the old file is removed.
 * @throws UnavailableError when it could not be saved (Supabase down, the event is gone, or the update was refused).
 */
export async function updateEvent(event: Event, changes: Partial<EventFields>, picture: PictureChange): Promise<void> {
  if (Object.keys(changes).length > 0) {
    const { data, error } = await v2().from('events').update(toUpdate(changes)).eq('id', event.id).select('id');
    if (error || data.length === 0) throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
  }
  await applyCoverPhoto(event.id, picture, event);
}

/**
 * Deletes an event (its cover photo row goes with it), then the file in storage when it is ours.
 * @throws UnavailableError when the event could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteEvent(event: Event): Promise<void> {
  const failure = `"${event.title}" couldn't be deleted.`;
  const { data, error } = await v2().from('events').delete().eq('id', event.id).select('id');
  if (error) throw new UnavailableError(failure, { cause: error });
  if (data.length === 0) throw new UnavailableError(failure);
  if (event.coverPath) await removeImage(BUCKETS.events, event.coverPath);
}

/**
 * Saves a checked CSV import: new events first, then every field of the changed ones (by `id`).
 * @throws UnavailableError when nothing could be saved (Supabase down, the import refused, or a changed event gone).
 */
export async function importEvents({ added, changed }: ImportRows<EventFields>): Promise<void> {
  const db = v2();
  if (added.length > 0) {
    const { error } = await db.from('events').insert(added.map((fields) => toInsert(fields)));
    if (error) throw new UnavailableError("The import couldn't be saved, so nothing was changed.", { cause: error });
  }
  if (changed.length === 0) return;
  for (const { id, fields } of changed) {
    const { data, error } = await db.from('events').update(toUpdate(fields)).eq('id', id).select('id');
    if (error) throw new UnavailableError("The import couldn't be saved, so nothing was changed.", { cause: error });
    if (data.length === 0) throw new UnavailableError("The import couldn't be saved, so nothing was changed.");
  }
}

async function applyCoverPhoto(
  eventId: string,
  picture: PictureChange,
  current: Readonly<Pick<Event, 'coverPath' | 'coverPhotoId'>>,
): Promise<void> {
  if (picture.kind === 'keep') return;
  const folder = `${eventId}/photos`;
  if (picture.kind === 'replace') {
    const path = await uploadImage(BUCKETS.events, picture.image, folder);
    const { error } = current.coverPhotoId
      ? await v2().from('event_photos').update({ path, is_cover: true }).eq('id', current.coverPhotoId)
      : await v2().from('event_photos').insert({ event_id: eventId, path, is_cover: true, sort_order: 0 });
    if (error) {
      await removeImage(BUCKETS.events, path);
      throw new UnavailableError("The picture couldn't be saved.", { cause: error });
    }
    if (current.coverPath) await removeImage(BUCKETS.events, current.coverPath);
    return;
  }
  if (current.coverPhotoId) {
    const { error } = await v2().from('event_photos').delete().eq('id', current.coverPhotoId);
    if (error) throw new UnavailableError("The picture couldn't be removed.", { cause: error });
  }
  if (current.coverPath) await removeImage(BUCKETS.events, current.coverPath);
}

function toInsert(fields: EventFields): EventInsert {
  return {
    title: fields.title,
    date: fields.date,
    description: fields.description,
    location: fields.location,
    category: fields.category,
    start_time: fields.startTime,
    end_time: fields.endTime,
    will_stream: fields.willStream,
    stream_url: fields.streamUrl,
  };
}

function toUpdate(fields: Partial<EventFields>): EventUpdate {
  return {
    title: fields.title,
    date: fields.date,
    description: fields.description,
    location: fields.location,
    category: fields.category,
    start_time: fields.startTime,
    end_time: fields.endTime,
    will_stream: fields.willStream,
    stream_url: fields.streamUrl,
  };
}

type EventRowWithPhotos = Pick<
  EventRow,
  'id' | 'title' | 'description' | 'date' | 'start_time' | 'end_time' | 'location' | 'category' | 'will_stream' | 'stream_url'
> & { event_photos: readonly PhotoRow[] | null };

function toEvent(row: EventRowWithPhotos): Event | null {
  const cover = (row.event_photos ?? []).find((photo) => photo.is_cover) ?? row.event_photos?.[0];
  const coverPath = cover?.path ?? null;
  const parsed = EventSchema.safeParse({
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    category: row.category,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    willStream: row.will_stream,
    streamUrl: row.stream_url === '' ? null : row.stream_url,
    coverPath,
    coverPhotoId: cover?.id ?? null,
    pictureUrl: coverPath ? publicUrl(BUCKETS.events, coverPath) : null,
  });
  if (parsed.success) return parsed.data;
  console.warn('events.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}