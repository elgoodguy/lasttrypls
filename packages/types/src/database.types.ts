export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          delivery_instructions: string | null;
          google_place_id: string | null;
          id: string;
          internal_number: string | null;
          is_primary: boolean;
          latitude: number | null;
          longitude: number | null;
          neighborhood: string | null;
          postal_code: string;
          street_address: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city: string;
          country?: string;
          created_at?: string;
          delivery_instructions?: string | null;
          google_place_id?: string | null;
          id?: string;
          internal_number?: string | null;
          is_primary?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          neighborhood?: string | null;
          postal_code: string;
          street_address: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          delivery_instructions?: string | null;
          google_place_id?: string | null;
          id?: string;
          internal_number?: string | null;
          is_primary?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          neighborhood?: string | null;
          postal_code?: string;
          street_address?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      cashback_rules: {
        Row: {
          created_at: string;
          end_date: string | null;
          group_id: string | null;
          id: string;
          is_active: boolean;
          maximum_cashback_amount: number | null;
          minimum_order_amount: number | null;
          percentage: number;
          start_date: string;
          store_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          end_date?: string | null;
          group_id?: string | null;
          id?: string;
          is_active?: boolean;
          maximum_cashback_amount?: number | null;
          minimum_order_amount?: number | null;
          percentage: number;
          start_date?: string;
          store_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          group_id?: string | null;
          id?: string;
          is_active?: boolean;
          maximum_cashback_amount?: number | null;
          minimum_order_amount?: number | null;
          percentage?: number;
          start_date?: string;
          store_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cashback_rules_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cashback_rules_store_id_fkey';
            columns: ['store_id'];
            isOneToOne: false;
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          id: string;
          logo_url: string | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          preferred_language: string | null;
          preferred_theme: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          preferred_language?: string | null;
          preferred_theme?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          preferred_language?: string | null;
          preferred_theme?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      stores: {
        Row: {
          accepted_postal_codes: string[] | null;
          address_city: string;
          address_country: string;
          address_internal: string | null;
          address_neighborhood: string | null;
          address_postal_code: string;
          address_street: string;
          banner_url: string | null;
          contact_phone: string | null;
          created_at: string;
          delivery_fee: number;
          estimated_delivery_time_minutes: number | null;
          group_id: string | null;
          id: string;
          is_active: boolean;
          latitude: number;
          logo_url: string | null;
          longitude: number;
          minimum_order_amount: number | null;
          name: string;
          operating_hours: Json;
          special_hours: Json | null;
          updated_at: string;
        };
        Insert: {
          accepted_postal_codes?: string[] | null;
          address_city: string;
          address_country?: string;
          address_internal?: string | null;
          address_neighborhood?: string | null;
          address_postal_code: string;
          address_street: string;
          banner_url?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          delivery_fee?: number;
          estimated_delivery_time_minutes?: number | null;
          group_id?: string | null;
          id?: string;
          is_active?: boolean;
          latitude: number;
          logo_url?: string | null;
          longitude: number;
          minimum_order_amount?: number | null;
          name: string;
          operating_hours?: Json;
          special_hours?: Json | null;
          updated_at?: string;
        };
        Update: {
          accepted_postal_codes?: string[] | null;
          address_city?: string;
          address_country?: string;
          address_internal?: string | null;
          address_neighborhood?: string | null;
          address_postal_code?: string;
          address_street?: string;
          banner_url?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          delivery_fee?: number;
          estimated_delivery_time_minutes?: number | null;
          group_id?: string | null;
          id?: string;
          is_active?: boolean;
          latitude?: number;
          logo_url?: string | null;
          longitude?: number;
          minimum_order_amount?: number | null;
          name?: string;
          operating_hours?: Json;
          special_hours?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stores_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
