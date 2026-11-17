import { getSupabase, type Event } from '../supabase';

/**
 * Fetch all events, ordered by date ascending
 */
export async function getEvents(): Promise<Event[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

/**
 * Fetch an event by ID
 */
export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || null;
  } catch (err) {
    console.error(`Error fetching event ${id}:`, err);
    return null;
  }
}

/**
 * Fetch upcoming events (from today onwards)
 */
export async function getUpcomingEvents(limit = 5): Promise<Event[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching upcoming events:', err);
    return [];
  }
}

/**
 * Fetch the next event only
 */
export async function getNextEvent(): Promise<Event | null> {
  const upcoming = await getUpcomingEvents(1);
  return upcoming[0] || null;
}

/**
 * Fetch past events (before today)
 */
export async function getPastEvents(): Promise<Event[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .lt('date', today)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching past events:', err);
    return [];
  }
}
