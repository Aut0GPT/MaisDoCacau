export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string
          category: string
          stock: number
          featured: boolean | null
          containsAlcohol: boolean | null
          ingredients: string | null
          healthBenefits: string | null
          usage: string | null
          preparation: string | null
          dietaryInfo: string | null
          origin: string | null
          awards: string | null
          weight: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image: string
          category: string
          stock: number
          featured?: boolean | null
          containsAlcohol?: boolean | null
          ingredients?: string | null
          healthBenefits?: string | null
          usage?: string | null
          preparation?: string | null
          dietaryInfo?: string | null
          origin?: string | null
          awards?: string | null
          weight?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string
          category?: string
          stock?: number
          featured?: boolean | null
          containsAlcohol?: boolean | null
          ingredients?: string | null
          healthBenefits?: string | null
          usage?: string | null
          preparation?: string | null
          dietaryInfo?: string | null
          origin?: string | null
          awards?: string | null
          weight?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          email: string | null
          created_at: string
          updated_at: string
          world_id: string | null
          profile_image: string | null
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
          world_id?: string | null
          profile_image?: string | null
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
          world_id?: string | null
          profile_image?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
          updated_at: string
          shipping_address: string | null
          payment_method: string | null
          payment_status: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          total: number
          created_at?: string
          updated_at?: string
          shipping_address?: string | null
          payment_method?: string | null
          payment_status?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          created_at?: string
          updated_at?: string
          shipping_address?: string | null
          payment_method?: string | null
          payment_status?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          title: string
          content: string
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          user_id?: string | null
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
