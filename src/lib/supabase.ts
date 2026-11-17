import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
