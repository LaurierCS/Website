import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export async function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set');
    return null;
  }

  // Only import and create client when actually needed
  const { createClient } = await import('@supabase/supabase-js');

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

// Type definitions for database tables
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  picture_url?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  picture_url?: string;
  role?: string;
  department?: string;
  github_url?: string;
  linkedin_url?: string;
  is_public: boolean;
  created_at: string;
}

export interface EventResource {
  id: string;
  event_id: string;
  type: 'slides' | 'docs' | 'recording';
  url: string;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  photo_url: string;
  created_at: string;
}
