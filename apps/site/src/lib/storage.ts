/**
 * Pictures in Supabase Storage. The database stores where a picture is inside its bucket, never the full address;
 * this turns that into the address the page shows, so moving a bucket never means rewriting rows.
 */
import { getSupabase } from './supabase';

/** The buckets the site shows pictures from: event photos (and posters), and team photos. */
export const BUCKETS = { events: 'event-media', team: 'team-images' } as const;
export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];

/** The public address of the file at `path` in `bucket`. Works it out locally; nothing is fetched. */
export function publicUrl(bucket: Bucket, path: string): string {
  return getSupabase().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
