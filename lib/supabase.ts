import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmdsiqsidbqnpoiidqoo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHNpcXNpZGJxbnBvaWlkcW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzcxMzYsImV4cCI6MjA3NDUxMzEzNn0.9XzQBnvIgM8WwhhYIBxO-zJZzktbqkr1K9dvBcBWtUM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для Supabase таблиц
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          role: 'admin' | 'editor'
          created_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          role?: 'admin' | 'editor'
          created_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          role?: 'admin' | 'editor'
          created_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      homepage_data: {
        Row: {
          id: string
          hero_title: string
          hero_subtitle: string
          hero_button_text: string
          hero_button_link: string
          hero_image: string | null
          about_image: string | null
          about_text: string
          about_description: string
          stat1_title: string
          stat1_subtitle: string
          stat2_title: string
          stat2_subtitle: string
          stat3_title: string
          stat3_subtitle: string
          reviews: any
          image_gallery: any
          faq_items: any
          contacts_phone: string
          contacts_email: string
          contacts_button_text: string
          contacts_button_link: string
          contacts_map_iframe: string | null
          currency_rates: any
          ticker_texts: any
          created_at: string
          updated_at: string
          version: number
        }
        Insert: {
          id?: string
          hero_title: string
          hero_subtitle: string
          hero_button_text: string
          hero_button_link: string
          hero_image?: string | null
          about_image?: string | null
          about_text: string
          about_description: string
          stat1_title: string
          stat1_subtitle: string
          stat2_title: string
          stat2_subtitle: string
          stat3_title: string
          stat3_subtitle: string
          reviews?: any
          image_gallery?: any
          faq_items?: any
          contacts_phone: string
          contacts_email: string
          contacts_button_text: string
          contacts_button_link: string
          contacts_map_iframe?: string | null
          currency_rates?: any
          ticker_texts?: any
          created_at?: string
          updated_at?: string
          version?: number
        }
        Update: {
          id?: string
          hero_title?: string
          hero_subtitle?: string
          hero_button_text?: string
          hero_button_link?: string
          hero_image?: string | null
          about_image?: string | null
          about_text?: string
          about_description?: string
          stat1_title?: string
          stat1_subtitle?: string
          stat2_title?: string
          stat2_subtitle?: string
          stat3_title?: string
          stat3_subtitle?: string
          reviews?: any
          image_gallery?: any
          faq_items?: any
          contacts_phone?: string
          contacts_email?: string
          contacts_button_text?: string
          contacts_button_link?: string
          contacts_map_iframe?: string | null
          currency_rates?: any
          ticker_texts?: any
          created_at?: string
          updated_at?: string
          version?: number
        }
      }
      contacts_data: {
        Row: {
          id: string
          phone: string
          email: string
          address: string
          working_hours: any
          whatsapp_numbers: any
          map_iframe: string | null
          gis_link: string | null
          gis_button_text: string | null
          created_at: string
          updated_at: string
          version: number
        }
        Insert: {
          id?: string
          phone: string
          email: string
          address: string
          working_hours?: any
          whatsapp_numbers?: any
          map_iframe?: string | null
          gis_link?: string | null
          gis_button_text?: string | null
          created_at?: string
          updated_at?: string
          version?: number
        }
        Update: {
          id?: string
          phone?: string
          email?: string
          address?: string
          working_hours?: any
          whatsapp_numbers?: any
          map_iframe?: string | null
          gis_link?: string | null
          gis_button_text?: string | null
          created_at?: string
          updated_at?: string
          version?: number
        }
      }
      news_articles: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          image: string | null
          content_image: string | null
          content_sections: any
          published: boolean
          show_on_homepage: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          image?: string | null
          content_image?: string | null
          content_sections?: any
          published?: boolean
          show_on_homepage?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          image?: string | null
          content_image?: string | null
          content_sections?: any
          published?: boolean
          show_on_homepage?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          product_name: string
          product_image: string | null
          quantity: number
          contact: string
          city: string
          status: 'new' | 'processing' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          product_name: string
          product_image?: string | null
          quantity?: number
          contact: string
          city: string
          status?: 'new' | 'processing' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          product_name?: string
          product_image?: string | null
          quantity?: number
          contact?: string
          city?: string
          status?: 'new' | 'processing' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          created_at: string
          last_accessed: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at: string
          created_at?: string
          last_accessed?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          created_at?: string
          last_accessed?: string
        }
      }
    }
    Views: {
      published_news: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          image: string | null
          content_image: string | null
          content_sections: any
          published: boolean
          show_on_homepage: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          author_username: string | null
        }
      }
      homepage_news: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          image: string | null
          content_image: string | null
          content_sections: any
          published: boolean
          show_on_homepage: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          author_username: string | null
        }
      }
      recent_orders: {
        Row: {
          id: string
          product_name: string
          product_image: string | null
          quantity: number
          contact: string
          city: string
          status: 'new' | 'processing' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          created_by_username: string | null
        }
      }
    }
    Functions: {
      get_homepage_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          hero_title: string
          hero_subtitle: string
          hero_button_text: string
          hero_button_link: string
          hero_image: string | null
          about_image: string | null
          about_text: string
          about_description: string
          stat1_title: string
          stat1_subtitle: string
          stat2_title: string
          stat2_subtitle: string
          stat3_title: string
          stat3_subtitle: string
          reviews: any
          image_gallery: any
          faq_items: any
          contacts_phone: string
          contacts_email: string
          contacts_button_text: string
          contacts_button_link: string
          contacts_map_iframe: string | null
          currency_rates: any
          ticker_texts: any
          created_at: string
          updated_at: string
          version: number
        }
      }
      get_contacts_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          phone: string
          email: string
          address: string
          working_hours: any
          whatsapp_numbers: any
          map_iframe: string | null
          gis_link: string | null
          gis_button_text: string | null
          created_at: string
          updated_at: string
          version: number
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
