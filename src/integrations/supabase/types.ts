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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      briefing_cache: {
        Row: {
          access_level: string
          action_items: string[]
          category: string
          created_at: string
          exploit_path: string[]
          hackers_impacted: string[]
          hackers_moved_through: string[]
          hackers_obtained: string[]
          id: string
          if_one_thing: string | null
          industry: string
          original_summary: string | null
          original_title: string
          published_at: string
          rewritten_summary: string
          rewritten_title: string
          severity: string
          slug: string | null
          source_name: string
          source_url: string
          what_attackers_got: string[]
          what_it_means: string
        }
        Insert: {
          access_level?: string
          action_items?: string[]
          category?: string
          created_at?: string
          exploit_path?: string[]
          hackers_impacted?: string[]
          hackers_moved_through?: string[]
          hackers_obtained?: string[]
          id?: string
          if_one_thing?: string | null
          industry?: string
          original_summary?: string | null
          original_title: string
          published_at: string
          rewritten_summary: string
          rewritten_title: string
          severity?: string
          slug?: string | null
          source_name: string
          source_url: string
          what_attackers_got?: string[]
          what_it_means: string
        }
        Update: {
          access_level?: string
          action_items?: string[]
          category?: string
          created_at?: string
          exploit_path?: string[]
          hackers_impacted?: string[]
          hackers_moved_through?: string[]
          hackers_obtained?: string[]
          id?: string
          if_one_thing?: string | null
          industry?: string
          original_summary?: string | null
          original_title?: string
          published_at?: string
          rewritten_summary?: string
          rewritten_title?: string
          severity?: string
          slug?: string | null
          source_name?: string
          source_url?: string
          what_attackers_got?: string[]
          what_it_means?: string
        }
        Relationships: []
      }
      briefing_runs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          run_date: string
          source_count: number
          status: string
          story_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          run_date?: string
          source_count?: number
          status: string
          story_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          run_date?: string
          source_count?: number
          status?: string
          story_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email_digest_enabled: boolean
          experience_level: string | null
          id: string
          industry: string | null
          onboarding_complete: boolean
          role: string | null
          topics: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email_digest_enabled?: boolean
          experience_level?: string | null
          id?: string
          industry?: string | null
          onboarding_complete?: boolean
          role?: string | null
          topics?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email_digest_enabled?: boolean
          experience_level?: string | null
          id?: string
          industry?: string | null
          onboarding_complete?: boolean
          role?: string | null
          topics?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_briefings: {
        Row: {
          briefing_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          briefing_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          briefing_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_briefings_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefing_cache"
            referencedColumns: ["id"]
          },
        ]
      }
      story_sources: {
        Row: {
          briefing_id: string | null
          fetched_at: string
          id: string
          raw_excerpt: string | null
          raw_title: string
          source_name: string
          source_url: string
        }
        Insert: {
          briefing_id?: string | null
          fetched_at?: string
          id?: string
          raw_excerpt?: string | null
          raw_title: string
          source_name: string
          source_url: string
        }
        Update: {
          briefing_id?: string | null
          fetched_at?: string
          id?: string
          raw_excerpt?: string | null
          raw_title?: string
          source_name?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_sources_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefing_cache"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          price_id: string
          product_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id: string
          product_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string
          product_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          industry: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          industry?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
        }
        Relationships: []
      }
      weekly_recaps: {
        Row: {
          body: string
          created_at: string
          id: string
          podcast_url: string | null
          summary: string
          title: string
          week_end: string
          week_start: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          podcast_url?: string | null
          summary: string
          title: string
          week_end: string
          week_start: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          podcast_url?: string | null
          summary?: string
          title?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
} as const
