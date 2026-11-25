export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          provider: string
          updated_at: string
          user_id: string
          verified_until: string
        }
        Insert: {
          provider: string
          updated_at?: string
          user_id: string
          verified_until: string
        }
        Update: {
          provider?: string
          updated_at?: string
          user_id?: string
          verified_until?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          kind: string | null
          location: string | null
          picture_url: string | null
          time: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          kind?: string | null
          location?: string | null
          picture_url?: string | null
          time?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          kind?: string | null
          location?: string | null
          picture_url?: string | null
          time?: string | null
          title?: string
        }
        Relationships: []
      }
      site_data_versions: {
        Row: {
          area: string
          version: number
        }
        Insert: {
          area: string
          version?: number
        }
        Update: {
          area?: string
          version?: number
        }
        Relationships: []
      }
      team: {
        Row: {
          created_at: string | null
          department: string | null
          github_url: string | null
          id: string
          is_public: boolean | null
          linkedin_url: string | null
          name: string
          picture_url: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          github_url?: string | null
          id?: string
          is_public?: boolean | null
          linkedin_url?: string | null
          name: string
          picture_url?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          github_url?: string | null
          id?: string
          is_public?: boolean | null
          linkedin_url?: string | null
          name?: string
          picture_url?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      import_events: {
        Args: { changed_rows: Json; new_rows: Json }
        Returns: undefined
      }
      import_team: {
        Args: { changed_rows: Json; new_rows: Json }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  v2: {
    Tables: {
      event_documents: {
        Row: {
          created_at: string
          event_id: string
          id: string
          path: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          path: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          path?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_hosts: {
        Row: {
          event_id: string
          guest_id: string | null
          id: string
          sort_order: number
          team_id: string | null
        }
        Insert: {
          event_id: string
          guest_id?: string | null
          id?: string
          sort_order?: number
          team_id?: string | null
        }
        Update: {
          event_id?: string
          guest_id?: string | null
          id?: string
          sort_order?: number
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_hosts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_hosts_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_hosts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      event_photos: {
        Row: {
          alt: string | null
          created_at: string
          event_id: string
          id: string
          is_cover: boolean
          path: string
          sort_order: number
        }
        Insert: {
          alt?: string | null
          created_at?: string
          event_id: string
          id?: string
          is_cover?: boolean
          path: string
          sort_order?: number
        }
        Update: {
          alt?: string | null
          created_at?: string
          event_id?: string
          id?: string
          is_cover?: boolean
          path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_related: {
        Row: {
          event_id: string
          related_id: string
          sort_order: number
        }
        Insert: {
          event_id: string
          related_id: string
          sort_order?: number
        }
        Update: {
          event_id?: string
          related_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_related_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_related_related_id_fkey"
            columns: ["related_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          start_time: string | null
          stream_url: string | null
          title: string
          will_stream: boolean
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          start_time?: string | null
          stream_url?: string | null
          title: string
          will_stream?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          start_time?: string | null
          stream_url?: string | null
          title?: string
          will_stream?: boolean
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          id: string
          link_url: string | null
          name: string
          picture_path: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          link_url?: string | null
          name: string
          picture_path?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          link_url?: string | null
          name?: string
          picture_path?: string | null
          title?: string | null
        }
        Relationships: []
      }
      team: {
        Row: {
          created_at: string
          department: string
          github_url: string | null
          id: string
          is_public: boolean
          linkedin_url: string | null
          name: string
          picture_path: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          department: string
          github_url?: string | null
          id?: string
          is_public?: boolean
          linkedin_url?: string | null
          name: string
          picture_path?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          github_url?: string | null
          id?: string
          is_public?: boolean
          linkedin_url?: string | null
          name?: string
          picture_path?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
  v2: {
    Enums: {},
  },
} as const
