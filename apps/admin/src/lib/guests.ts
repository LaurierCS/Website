/**
 * Reading, adding, changing, and deleting guests in Supabase v2, with their photos. Rows are checked
 * and turned into `Guest`s here, once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type Guest, type GuestFields, GuestSchema } from '../types/guest';
import { UnavailableError } from './errors';
import type { PictureChange } from './images';
import { BUCKETS, publicUrl, removeImage, uploadImage } from './storage';
import { getSupabase } from './supabase';

type GuestRow = Database['v2']['Tables']['guests']['Row'];

const COLUMNS = 'id, name, title, picture_path, link_url';

const v2 = () => getSupabase().schema('v2');

/**
 * Every guest, sorted by name. Empty when there are none. A row that doesn't fit `Guest` is left out and logged,
 * so one bad row can't hide every other guest.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listGuests(): Promise<readonly Guest[]> {
  const { data, error } = await v2().from('guests').select(COLUMNS).order('name') as any;
  if (error) throw new UnavailableError('Guests could not be loaded.', { cause: error });
  return data.flatMap((row: any) => toGuest(row) ?? []);
}

/**
 * One guest by id, or null when there is no such guest (including an id that isn't a valid id at all).
 * @throws UnavailableError when Supabase cannot be reached, or the saved guest has data the admin can't read.
 */
export async function getGuest(id: string): Promise<Guest | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await v2().from('guests').select(COLUMNS).eq('id', id).maybeSingle() as any;
  if (error) throw new UnavailableError('This guest could not be loaded.', { cause: error });
  if (!data) return null;
  const guest = toGuest(data);
  if (!guest) throw new UnavailableError("This guest has saved data the admin can't read. It needs fixing in Supabase.");
  return guest;
}

/**
 * Adds a guest, uploading their photo first when one was chosen. If the guest can't be saved, the uploaded
 * photo is deleted again so no unused file is left behind.
 * @throws UnavailableError when the photo or the guest could not be saved.
 */
export async function createGuest(fields: GuestFields, picture: PictureChange): Promise<void> {
  const newPhotoPath = picture.kind === 'replace' ? await uploadImage(BUCKETS.team, picture.image) : null;
  const { data, error } = await v2()
    .from('guests')
    .insert({ name: fields.name, title: fields.title ?? null, link_url: fields.linkUrl ?? null, picture_path: newPhotoPath })
    .select('id');
  if (error || data.length === 0) {
    if (newPhotoPath) await removeImage(BUCKETS.team, newPhotoPath);
    throw new UnavailableError(`${fields.name} couldn't be saved.`, { cause: error });
  }
}

/**
 * Saves the fields an exec changed on a guest, and their photo change; the rest stay as they were.
 * @throws UnavailableError when it could not be saved (Supabase down, the guest is gone, or the update was refused).
 */
export async function updateGuest(guest: Guest, changes: Partial<GuestFields>, picture: PictureChange): Promise<void> {
  const newPhotoPath = picture.kind === 'replace' ? await uploadImage(BUCKETS.team, picture.image) : null;
  const row =
    picture.kind === 'keep'
      ? {
          name: changes.name,
          title: changes.title ?? null,
          link_url: changes.linkUrl ?? null,
        }
      : {
          name: changes.name,
          title: changes.title ?? null,
          link_url: changes.linkUrl ?? null,
          picture_path: picture.kind === 'remove' ? null : newPhotoPath,
        };
  const { data, error } = await v2().from('guests').update(row).eq('id', guest.id).select('id');
  if (error || data.length === 0) {
    if (newPhotoPath) await removeImage(BUCKETS.team, newPhotoPath);
    throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
  }
  if (picture.kind !== 'keep' && guest.picturePath) await removeImage(BUCKETS.team, guest.picturePath);
}

/**
 * Deletes a guest, then their photo if it is a file in our team bucket.
 * @throws UnavailableError when the guest could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteGuest(guest: Guest): Promise<void> {
  const { data, error } = await v2().from('guests').delete().eq('id', guest.id).select('id');
  if (error || data.length === 0) {
    throw new UnavailableError(`${guest.name} couldn't be deleted.`, { cause: error });
  }
  if (guest.picturePath) await removeImage(BUCKETS.team, guest.picturePath);
}

function toGuest(row: GuestRow): Guest | null {
  const parsed = GuestSchema.safeParse({
    id: row.id,
    name: row.name,
    title: row.title,
    picturePath: row.picture_path,
    pictureUrl: row.picture_path ? publicUrl(BUCKETS.team, row.picture_path) : null,
    linkUrl: row.link_url === '' ? null : row.link_url,
  });
  if (parsed.success) return parsed.data;
  console.warn('guests.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}
