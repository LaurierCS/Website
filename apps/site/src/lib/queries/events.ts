import { getSupabase, type QueryError } from '../supabase';

export type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  picture_url: string | null;
  created_at: string;
};

const COLUMNS = 'id, title, description, date, time, location, picture_url, created_at';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getEvents(): Promise<{ events: EventRecord[]; error: QueryError | null }> {
  const sb = getSupabase();
  if ('error' in sb) return { events: [], error: sb.error };

  const { data, error } = await sb.client.from('events').select(COLUMNS).order('date', { ascending: true });
  if (error) return { events: [], error: { message: 'Could not load events.' } };
  return { events: (data ?? []) as EventRecord[], error: null };
}

export async function getEventById(
  id: string,
): Promise<{ event: EventRecord | null; error: QueryError | null }> {
  if (!UUID.test(id)) return { event: null, error: null };

  const sb = getSupabase();
  if ('error' in sb) return { event: null, error: sb.error };

  const { data, error } = await sb.client.from('events').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) return { event: null, error: { message: 'Could not load this event.' } };
  return { event: (data as EventRecord | null) ?? null, error: null };
}
