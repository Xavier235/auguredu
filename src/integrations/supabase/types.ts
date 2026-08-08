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
      chat_messages_v2: {
        Row: {
          attachments: Json
          content: string
          created_at: string
          id: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json
          content: string
          created_at?: string
          id?: string
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          attachments?: Json
          content?: string
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_v2_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          room: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          room?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          room?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string
          deck_name: string
          id: string
          question: string
          source_pdf_id: string | null
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          deck_name?: string
          id?: string
          question: string
          source_pdf_id?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          deck_name?: string
          id?: string
          question?: string
          source_pdf_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_source_pdf_id_fkey"
            columns: ["source_pdf_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      library_reads: {
        Row: {
          created_at: string
          department: string | null
          id: string
          item_id: string
          item_title: string
          level: string | null
          quiz_score: number
          seconds_read: number
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          item_id: string
          item_title: string
          level?: string | null
          quiz_score?: number
          seconds_read?: number
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          item_id?: string
          item_title?: string
          level?: string | null
          quiz_score?: number
          seconds_read?: number
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          href: string | null
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          kind?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          href?: string | null
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          admin_notes: string | null
          amount_naira: number
          created_at: string
          id: string
          note: string | null
          plan: string
          receipt_path: string
          reference_code: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sender_name: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount_naira: number
          created_at?: string
          id?: string
          note?: string | null
          plan: string
          receipt_path: string
          reference_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sender_name?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount_naira?: number
          created_at?: string
          id?: string
          note?: string | null
          plan?: string
          receipt_path?: string
          reference_code?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sender_name?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          created_at: string
          id: string
          mime_type: string
          page_count: number
          storage_path: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mime_type?: string
          page_count?: number
          storage_path: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mime_type?: string
          page_count?: number
          storage_path?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          aggregate_score: number
          created_at: string
          id: string
          input: Json
          jamb_score: number
          label: string | null
          result: Json
          top_course: string | null
          top_course_chance: number | null
          user_id: string
        }
        Insert: {
          aggregate_score: number
          created_at?: string
          id?: string
          input: Json
          jamb_score: number
          label?: string | null
          result: Json
          top_course?: string | null
          top_course_chance?: number | null
          user_id: string
        }
        Update: {
          aggregate_score?: number
          created_at?: string
          id?: string
          input?: Json
          jamb_score?: number
          label?: string | null
          result?: Json
          top_course?: string | null
          top_course_chance?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_verified_student: boolean
          level: string | null
          school: string | null
          subscription_expires_at: string | null
          subscription_tier: string
          updated_at: string
          verified_domain: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_verified_student?: boolean
          level?: string | null
          school?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string
          updated_at?: string
          verified_domain?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified_student?: boolean
          level?: string | null
          school?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string
          updated_at?: string
          verified_domain?: string | null
        }
        Relationships: []
      }
      study_group_members: {
        Row: {
          group_id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          capacity: number
          created_at: string
          created_by: string
          department: string
          id: string
          level: string
          meeting_place: string
          meeting_time: string
          name: string
          school: string
          topic: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          created_by: string
          department?: string
          id?: string
          level?: string
          meeting_place?: string
          meeting_time?: string
          name: string
          school?: string
          topic?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          created_by?: string
          department?: string
          id?: string
          level?: string
          meeting_place?: string
          meeting_time?: string
          name?: string
          school?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_profiles: {
        Row: {
          about: string
          availability: string
          campus_area: string
          contact_handle: string
          created_at: string
          department: string
          discoverable: boolean
          hostel: string
          level: string
          school: string
          study_style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string
          availability?: string
          campus_area?: string
          contact_handle?: string
          created_at?: string
          department?: string
          discoverable?: boolean
          hostel?: string
          level?: string
          school?: string
          study_style?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string
          availability?: string
          campus_area?: string
          contact_handle?: string
          created_at?: string
          department?: string
          discoverable?: boolean
          hostel?: string
          level?: string
          school?: string
          study_style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage_counters: {
        Row: {
          count: number
          day: string
          feature: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          day?: string
          feature: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          day?: string
          feature?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          level: number
          show_on_leaderboard: boolean
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          level?: number
          show_on_leaderboard?: boolean
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          level?: number
          show_on_leaderboard?: boolean
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          meta: Json
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          meta?: Json
          points: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          meta?: Json
          points?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_quota: {
        Args: { _feature: string; _limit: number }
        Returns: {
          allowed: boolean
          day_limit: number
          new_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      my_usage_today: {
        Args: never
        Returns: {
          count: number
          feature: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
