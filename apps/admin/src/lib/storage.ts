/**
 * Pictures in Supabase Storage. Files go at the bucket root as `<uuid>.<ext>`, and rows store the file's full
 * public URL, the same format the existing events and team members use.
 */
import { UnavailableError } from './errors';
import type { CheckedImage } from './images';
import { getSupabase } from './supabase';

export const BUCKETS = { events: 'events-images', team: 'team-images' } as const;
export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];

/**
 * Uploads a picture under a new random name and returns its public URL.
 * @throws UnavailableError when the upload fails or is refused.
 */
export async function uploadImage(bucket: Bucket, image: CheckedImage): Promise<string> {
  const path = `${crypto.randomUUID()}.${image.extension}`;
  const files = getSupabase().storage.from(bucket);
  const { error } = await files.upload(path, image.file, { contentType: image.file.type });
  if (error) throw new UnavailableError("The picture couldn't be uploaded.", { cause: error });
  return files.getPublicUrl(path).data.publicUrl;
}

/**
 * Deletes the file a public URL points to, when that file is in `bucket`; a URL from anywhere else is left
 * alone. Callers remove a picture only after the row stops using it, so a failure here leaves an unused file
 * behind, not a broken picture: it is logged rather than thrown.
 */
export async function removeImage(bucket: Bucket, url: string): Promise<void> {
  const files = getSupabase().storage.from(bucket);
  const bucketUrl = files.getPublicUrl('').data.publicUrl;
  if (!url.startsWith(bucketUrl)) return;
  // Public URLs escape characters such as spaces in file names; storage wants the name as written.
  const path = decodeURIComponent(url.slice(bucketUrl.length));
  const { error } = await files.remove([path]);
  if (error) console.warn('storage.image_not_removed', { bucket, path });
}
