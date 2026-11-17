import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type QueryError = { message: string };

let client: SupabaseClient | null = null;

/**
 * Server-only client. The anon key stays in the server bundle for on-demand
 * pages and is never read from a `PUBLIC_` variable.
 */
export function getSupabase(): { client: SupabaseClient } | { error: QueryError } {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { error: { message: 'Events are temporarily unavailable.' } };
  }
  if (!client) client = createClient(url, key);
  return { client };
}
