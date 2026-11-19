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
 * Every event, newest first. Empty when there are none.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listEvents(): Promise<readonly Event[]> {
  const { data, error } = await getSupabase().from('events').select(COLUMNS).order('date', { ascending: false });
  if (error) throw new UnavailableError('Events could not be loaded.', { cause: error });
  return data.map(toEvent);
}

/**
 * Renames `picture_url`, the one column spelled differently. Older events store "no photo" as an empty
 * `picture_url` as well as null (the site treats both as no photo), so both become null.
 */
function toEvent(row: Pick<EventRow, 'id' | 'title' | 'description' | 'date' | 'time' | 'location' | 'picture_url'>): Event {
  return EventSchema.parse({ ...row, pictureUrl: row.picture_url === '' ? null : row.picture_url });
}
