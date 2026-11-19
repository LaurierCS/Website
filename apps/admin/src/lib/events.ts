/**
 * Reading events from Supabase. Rows are checked and turned into `Event`s here, once, so pages get typed data.
 */
import type { Database } from '../types/database.types';
import { type Event, EventSchema } from '../types/event';
import { UnavailableError } from './errors';
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
