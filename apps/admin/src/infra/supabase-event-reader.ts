/**
 * `EventReader` on the Supabase `events` table. Rows are typed by the generated `Database` types and parsed into
 * domain events once, here.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { type Event, EventSchema } from '../domain/event';
import { UnavailableError } from '../domain/errors';
import type { EventReader } from '../domain/ports';
import type { Database } from './database.types';

type EventRow = Database['public']['Tables']['events']['Row'];

const COLUMNS = 'id, title, description, date, time, location, picture_url';

export class SupabaseEventReader implements EventReader {
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async listEvents(): Promise<readonly Event[]> {
    const { data, error } = await this.client.from('events').select(COLUMNS).order('date', { ascending: false });
    if (error) throw new UnavailableError('Events could not be loaded.', { cause: error });
    return data.map(toEvent);
  }
}

/**
 * The one column whose name differs is renamed; the schema drops the rest of the row's spelling. Older events
 * store "no photo" as an empty `picture_url` as well as null (the site treats both as no photo), so both map
 * to null here.
 */
function toEvent(row: Pick<EventRow, 'id' | 'title' | 'description' | 'date' | 'time' | 'location' | 'picture_url'>): Event {
  return EventSchema.parse({ ...row, pictureUrl: row.picture_url === '' ? null : row.picture_url });
}
