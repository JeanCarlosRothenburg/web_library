export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          codigo_livro: string
          title: string
          author: string
          synopsis: string
          genre: string
          language: string
          published_year: number
          pages: number
          total_copies: number
          available_copies: number
          popularity_score: number
          featured_rank: number
          cover_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          codigo_livro: string
          title: string
          author: string
          synopsis: string
          genre?: string
          language?: string
          published_year?: number
          pages?: number
          total_copies?: number
          available_copies?: number
          popularity_score?: number
          featured_rank?: number
          cover_url?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['books']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          avatar_url: string | null
          role: 'reader' | 'librarian'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string
          phone?: string
          avatar_url?: string | null
          role?: 'reader' | 'librarian'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          scheduled_for: string
          status: 'pending' | 'confirmed' | 'completed' | 'canceled'
          contact_name: string
          contact_phone: string
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheduled_for: string
          status?: 'pending' | 'confirmed' | 'completed' | 'canceled'
          contact_name: string
          contact_phone?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      appointment_items: {
        Row: {
          id: string
          appointment_id: string
          book_id: string
          book_code: string
          title_snapshot: string
          author_snapshot: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          book_id: string
          book_code: string
          title_snapshot: string
          author_snapshot: string
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['appointment_items']['Insert']>
      }
    }
    Enums: {
      appointment_status: 'pending' | 'confirmed' | 'completed' | 'canceled'
    }
  }
}

