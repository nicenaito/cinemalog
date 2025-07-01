import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      movies: {
        Row: {
          id: number
          title: string
          director: string | null
          release_year: number | null
          genre: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          director?: string | null
          release_year?: number | null
          genre?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          director?: string | null
          release_year?: number | null
          genre?: string | null
          created_at?: string
        }
      }
      places: {
        Row: {
          id: number
          name: string
          address: string | null
          place_type: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          address?: string | null
          place_type?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          address?: string | null
          place_type?: string | null
          created_at?: string
        }
      }
      records: {
        Row: {
          id: number
          user_id: string
          movie_id: number
          place_id: number | null
          watched_at: string
          memo: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          movie_id: number
          place_id?: number | null
          watched_at: string
          memo?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          movie_id?: number
          place_id?: number | null
          watched_at?: string
          memo?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      friends: {
        Row: {
          id: number
          requester_id: string
          requested_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          requester_id: string
          requested_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          requester_id?: string
          requested_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          record_id: number
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          record_id: number
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          record_id?: number
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}
