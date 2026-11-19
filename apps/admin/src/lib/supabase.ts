/**
 * The one Supabase client for the whole admin, typed by the generated database types. Only files in `lib/`
 * use it; pages and components go through `lib/` functions.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { loadConfig } from './config';

let client: SupabaseClient<Database> | null = null;

/**
 * The shared client, created on first use rather than on import, so a missing `.env` shows the setup page
 * instead of crashing the app before it renders.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    const config = loadConfig();
    client = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey);
  }
  return client;
}
