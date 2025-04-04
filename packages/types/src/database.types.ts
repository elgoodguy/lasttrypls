// Este archivo contendrá los tipos generados desde Supabase
// Se generará con el CLI de Supabase o con un script personalizado

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
      profiles: {
        Row: {
          id: string
          fullName: string | null
          avatarUrl: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          fullName?: string | null
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          fullName?: string | null
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // Ejemplo de otra tabla
      orders: {
        Row: {
          id: string
          userId: string
          status: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          status: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          status?: string
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["userId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      // Vista de ejemplo
      active_orders: {
        Row: {
          id: string
          userId: string
          status: string
          createdAt: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["userId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      // Función de ejemplo
      get_user_orders: {
        Args: { user_id: string }
        Returns: { id: string; status: string; createdAt: string }[]
      }
    }
    Enums: {
      // Los enums que hayas definido en Supabase
    }
  }
} 