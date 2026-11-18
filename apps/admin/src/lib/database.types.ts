// Hand-written to match the current `events` and `team` tables.
// Regenerate with `supabase gen types typescript --project-id <id> > src/lib/database.types.ts`
// once you have access to the project.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string | null
          location: string | null
          picture_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time?: string | null
          location?: string | null
          picture_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string | null
          location?: string | null
          picture_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      team: {
        Row: {
          id: string
          name: string
          role: string | null
          department: string | null
          github_url: string | null
          linkedin_url: string | null
          picture_url: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          department?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          picture_url?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          department?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          picture_url?: string | null
          is_public?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
