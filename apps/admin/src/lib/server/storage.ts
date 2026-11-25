/**
 * Pictures in Supabase Storage. v2 rows store the path inside the bucket; callers use `publicUrl` when the UI
 * needs a link.
 */
import { UnavailableError } from './errors';
import type { CheckedImage } from '../ui/images';
import { getSupabase } from './supabase';

export const BUCKETS = { events: 'event-media', team: 'team-images' } as const;
export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];

/** The public URL for a file saved at `path` in `bucket`. */
export function publicUrl(bucket: Bucket, path: string): string {
  return getSupabase().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Uploads a picture and returns its path in the bucket. `folder` is optional (`<event_id>/photos` for events).
 * @throws UnavailableError when the upload fails or is refused.
 */
export async function uploadImage(bucket: Bucket, image: CheckedImage, folder = ''): Promise<string> {
  const fileName = `${crypto.randomUUID()}.${image.extension}`;
  const path = folder ? `${folder}/${fileName}` : fileName;
  const files = getSupabase().storage.from(bucket);
  const { error } = await files.upload(path, image.file, { contentType: image.file.type });
  if (error) throw new UnavailableError("The picture couldn't be uploaded.", { cause: error });
  return path;
}

/**
 * Deletes a file at `path` in `bucket`. A path that looks like a full URL is ignored. Callers remove a picture
 * only after the row stops using it; a failure here is logged rather than thrown.
 */
export async function removeImage(bucket: Bucket, path: string): Promise<void> {
  if (!path || path.includes('://')) return;
  const { error } = await getSupabase().storage.from(bucket).remove([path]);
  if (error) console.warn('storage.image_not_removed', { bucket, path });
}