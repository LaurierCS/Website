/**
 * Reading the event posters from Supabase (the `v2` schema). Anyone may read events and their photos; this asks
 * only for each event's cover photo.
 */
import { UnavailableError } from '../errors';
import { toEventPoster, type EventPoster } from '../posters';
import { BUCKETS, publicUrl } from '../storage';
import { getSupabase } from '../supabase';

// `!inner` leaves out events without a cover photo, rather than giving them an empty list.
const COLUMNS = 'title, category, event_photos!inner(path)';

/**
 * Every event with a cover photo, newest first. Empty when there are none yet. A row that can't be read is left
 * out and logged, so one bad row can't hide every other poster.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listEventPosters(): Promise<readonly EventPoster[]> {
  const { data, error } = await getSupabase()
    .schema('v2')
    .from('events')
    .select(COLUMNS)
    .eq('event_photos.is_cover', true)
    .order('date', { ascending: false });
  if (error) throw new UnavailableError('The event posters could not be loaded.', { cause: error });
  return data.flatMap((row) => {
    const poster = toEventPoster(row, (path) => publicUrl(BUCKETS.events, path));
    if (!poster) console.warn('Left an event out of the poster rows: its title or category is not usable.', row);
    return poster ?? [];
  });
}
