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
          username: string
          email: string | null
          profile_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          username: string
          email?: string | null
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string
          email?: string | null
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          delivery_fee: number
          created_at: string
          updated_at: string
          address: Json
          payment_method: string
          estimated_delivery: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          total: number
          delivery_fee: number
          created_at?: string
          updated_at?: string
          address: Json
          payment_method: string
          estimated_delivery?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          delivery_fee?: number
          created_at?: string
          updated_at?: string
          address?: Json
          payment_method?: string
          estimated_delivery?: string | null
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
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
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
