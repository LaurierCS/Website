/**
 * Reading, adding, changing, and deleting event photos in Supabase v2. Rows are checked and turned into
 * `EventPhoto`s here, once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../../types/database.types';
import { type EventPhoto, type PhotoFields, EventPhotoSchema } from '../../types/event-photo';
import { UnavailableError } from '../server/errors';
import type { PictureChange } from '../ui/images';
import { BUCKETS, publicUrl, removeImage, uploadImage } from '../server/storage';
import { getSupabase } from '../server/supabase';

type PhotoRow = Database['v2']['Tables']['event_photos']['Row'];

const COLUMNS = 'id, event_id, path, alt, is_cover, sort_order';

const v2 = () => getSupabase().schema('v2');

/**
 * All photos for an event, in sort order. Empty when there are none. A row that doesn't fit `EventPhoto` is left out
 * and logged, so one bad row can't hide every other photo.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listPhotos(eventId: string): Promise<readonly EventPhoto[]> {
  if (!z.uuid().safeParse(eventId).success) return [];
  const { data, error } = await v2().from('event_photos').select(COLUMNS).eq('event_id', eventId).order('sort_order') as any;
  if (error) throw new UnavailableError('Photos could not be loaded.', { cause: error });
  return data.flatMap((row: any) => toEventPhoto(row) ?? []);
}

/**
 * One photo by id, or null when there is no such photo (including an id that isn't a valid id at all).
 * @throws UnavailableError when Supabase cannot be reached, or the saved photo has data the admin can't read.
 */
export async function getPhoto(id: string): Promise<EventPhoto | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await v2().from('event_photos').select(COLUMNS).eq('id', id).maybeSingle() as any;
  if (error) throw new UnavailableError('This photo could not be loaded.', { cause: error });
  if (!data) return null;
  const photo = toEventPhoto(data);
  if (!photo) throw new UnavailableError("This photo has saved data the admin can't read. It needs fixing in Supabase.");
  return photo;
}

/**
 * Adds a photo to an event, uploading the image file to `event-media/<event_id>/photos/`.
 * @throws UnavailableError when the upload or the row could not be saved.
 */
export async function addPhoto(eventId: string, picture: PictureChange): Promise<void> {
  if (!z.uuid().safeParse(eventId).success) throw new UnavailableError('Invalid event id.');
  if (picture.kind !== 'replace') throw new UnavailableError('A photo must be provided.');

  const folder = `${eventId}/photos`;
  const path = await uploadImage(BUCKETS.events, picture.image, folder);

  const { data, error } = await v2()
    .from('event_photos')
    .select(COLUMNS)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1) as any;
  if (error) {
    await removeImage(BUCKETS.events, path);
    throw new UnavailableError("The photo couldn't be saved.", { cause: error });
  }

  const nextSortOrder = data.length > 0 ? (data[0]?.sort_order ?? -1) + 1 : 0;

  const { error: insertError } = await v2()
    .from('event_photos')
    .insert({ event_id: eventId, path, sort_order: nextSortOrder, is_cover: false });
  if (insertError) {
    await removeImage(BUCKETS.events, path);
    throw new UnavailableError("The photo couldn't be saved.", { cause: insertError });
  }
}

/**
 * Updates a photo's alt text.
 * @throws UnavailableError when it could not be saved (Supabase down, the photo is gone, or the update was refused).
 */
export async function updatePhoto(photo: EventPhoto, changes: Partial<PhotoFields>): Promise<void> {
  const { data, error } = await v2().from('event_photos').update({ alt: changes.alt ?? null }).eq('id', photo.id).select('id');
  if (error || data.length === 0) throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
}

/**
 * Deletes a photo, then the file in storage.
 * @throws UnavailableError when the photo could not be deleted (Supabase down, or the delete was refused).
 */
export async function deletePhoto(photo: EventPhoto): Promise<void> {
  const { data, error } = await v2().from('event_photos').delete().eq('id', photo.id).select('id');
  if (error || data.length === 0) throw new UnavailableError("The photo couldn't be deleted.", { cause: error });
  await removeImage(BUCKETS.events, photo.path);
}

/**
 * Marks a photo as the cover for its event, unmarking the previous cover.
 * @throws UnavailableError when the update could not be saved.
 */
export async function setCover(eventId: string, photoId: string): Promise<void> {
  if (!z.uuid().safeParse(eventId).success || !z.uuid().safeParse(photoId).success) {
    throw new UnavailableError('Invalid event or photo id.');
  }

  // Unmark the current cover
  const { error: unmarkError } = await v2()
    .from('event_photos')
    .update({ is_cover: false })
    .eq('event_id', eventId)
    .eq('is_cover', true);
  if (unmarkError) throw new UnavailableError("Couldn't update the cover photo.", { cause: unmarkError });

  // Mark the new cover
  const { data, error } = await v2().from('event_photos').update({ is_cover: true }).eq('id', photoId).select('id');
  if (error || data.length === 0) throw new UnavailableError("Couldn't set the cover photo.", { cause: error });
}

/**
 * Reorders photos by sort_order. All sort orders must be valid, contiguous, and start from 0.
 * @throws UnavailableError when the reorder could not be saved.
 */
export async function reorderPhotos(photos: readonly EventPhoto[]): Promise<void> {
  if (photos.length === 0) return;

  for (let i = 0; i < photos.length; i++) {
    const { error } = await v2()
      .from('event_photos')
      .update({ sort_order: i })
      .eq('id', photos[i]!.id);
    if (error) throw new UnavailableError("The photos couldn't be reordered.", { cause: error });
  }
}

function toEventPhoto(row: PhotoRow): EventPhoto | null {
  const parsed = EventPhotoSchema.safeParse({
    id: row.id,
    eventId: row.event_id,
    path: row.path,
    pictureUrl: publicUrl(BUCKETS.events, row.path),
    alt: row.alt,
    isCover: row.is_cover,
    sortOrder: row.sort_order,
  });
  if (parsed.success) return parsed.data;
  console.warn('event_photos.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}
