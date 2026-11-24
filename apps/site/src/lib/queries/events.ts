/**
 * Reading the event posters from Supabase. Anyone may read the events table; this asks only for the events an
 * exec has given a kind of night and a poster in the admin.
 */
import { UnavailableError } from '../errors';
import { toEventPoster, type EventPoster } from '../posters';
import { getSupabase } from '../supabase';

const COLUMNS = 'title, kind, picture_url';

/**
 * Every event with a kind and a poster, newest first. Empty when there are none yet. A row that can't be read is
 * left out and logged, so one bad row can't hide every other poster.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listEventPosters(): Promise<readonly EventPoster[]> {
  const { data, error } = await getSupabase()
    .from('events')
    .select(COLUMNS)
    .not('kind', 'is', null)
    .not('picture_url', 'is', null)
    .order('date', { ascending: false });
  if (error) throw new UnavailableError('The event posters could not be loaded.', { cause: error });
  return data.flatMap((row) => {
    const poster = toEventPoster(row);
    if (!poster) console.warn('Left an event out of the poster rows: its title or poster link is not usable.', row);
    return poster ?? [];
  });
}
