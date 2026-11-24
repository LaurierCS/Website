/**
 * The one Supabase client for the site. Only `lib/queries/` uses it; components get typed data from there.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadConfig } from './config';

let client: SupabaseClient | null = null;

/** The shared client, created on first use. The site only reads, so it keeps no sign-in session. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const config = loadConfig();
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, { auth: { persistSession: false } });
  }
  return client;
}
