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
      store_products: {
        Row: {
          store_id: string
          product_id: string
          is_available_in_store: boolean
          price_override: number | null
          created_at: string
        }
        Insert: {
          store_id: string
          product_id: string
          is_available_in_store?: boolean
          price_override?: number | null
          created_at?: string
        }
        Update: {
          store_id?: string
          product_id?: string
          is_available_in_store?: boolean
          price_override?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_products_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_products_store_id_fkey"
            columns: ["store_id"]
            referencedRelation: "stores"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          compare_at_price: number | null
          image_urls: string[] | null
          is_active: boolean
          product_type: 'physical' | 'prepared'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          compare_at_price?: number | null
          image_urls?: string[] | null
          is_active?: boolean
          product_type?: 'physical' | 'prepared'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          compare_at_price?: number | null
          image_urls?: string[] | null
          is_active?: boolean
          product_type?: 'physical' | 'prepared'
          created_at?: string
          updated_at?: string
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
  }
} 