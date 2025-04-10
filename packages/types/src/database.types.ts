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
addresses: {
Row: {
city: string
country: string
created_at: string
delivery_instructions: string | null
google_place_id: string | null
id: string
internal_number: string | null
is_primary: boolean
latitude: number | null
longitude: number | null
neighborhood: string | null
postal_code: string
street_address: string
updated_at: string
user_id: string
}
Insert: {
city: string
country?: string
created_at?: string
delivery_instructions?: string | null
google_place_id?: string | null
id?: string
internal_number?: string | null
is_primary?: boolean
latitude?: number | null
longitude?: number | null
neighborhood?: string | null
postal_code: string
street_address: string
updated_at?: string
user_id: string
}
Update: {
city?: string
country?: string
created_at?: string
delivery_instructions?: string | null
google_place_id?: string | null
id?: string
internal_number?: string | null
is_primary?: boolean
latitude?: number | null
longitude?: number | null
neighborhood?: string | null
postal_code?: string
street_address?: string
updated_at?: string
user_id?: string
}
Relationships: []
}
cashback_rules: {
Row: {
created_at: string
end_date: string | null
group_id: string | null
id: string
is_active: boolean
maximum_cashback_amount: number | null
minimum_order_amount: number | null
percentage: number
start_date: string
store_id: string | null
updated_at: string
}
Insert: {
created_at?: string
end_date?: string | null
group_id?: string | null
id?: string
is_active?: boolean
maximum_cashback_amount?: number | null
minimum_order_amount?: number | null
percentage: number
start_date?: string
store_id?: string | null
updated_at?: string
}
Update: {
created_at?: string
end_date?: string | null
group_id?: string | null
id?: string
is_active?: boolean
maximum_cashback_amount?: number | null
minimum_order_amount?: number | null
percentage?: number
start_date?: string
store_id?: string | null
updated_at?: string
}
Relationships: [
{
foreignKeyName: "cashback_rules_group_id_fkey"
columns: ["group_id"]
isOneToOne: false
referencedRelation: "groups"
referencedColumns: ["id"]
},
{
foreignKeyName: "cashback_rules_store_id_fkey"
columns: ["store_id"]
isOneToOne: false
referencedRelation: "stores"
referencedColumns: ["id"]
},
]
}
groups: {
Row: {
created_at: string
id: string
logo_url: string | null
name: string
updated_at: string
}
Insert: {
created_at?: string
id?: string
logo_url?: string | null
name: string
updated_at?: string
}
Update: {
created_at?: string
id?: string
logo_url?: string | null
name?: string
updated_at?: string
}
Relationships: []
}
order_items: {
Row: {
created_at: string
id: string
item_notes: string | null
order_id: string | null
product_id: string | null
product_name: string
quantity: number
selected_options: Json | null
store_id: string | null
total_item_price: number
unit_price: number
}
Insert: {
created_at?: string
id?: string
item_notes?: string | null
order_id?: string | null
product_id?: string | null
product_name: string
quantity: number
selected_options?: Json | null
store_id?: string | null
total_item_price: number
unit_price: number
}
Update: {
created_at?: string
id?: string
item_notes?: string | null
order_id?: string | null
product_id?: string | null
product_name?: string
quantity?: number
selected_options?: Json | null
store_id?: string | null
total_item_price?: number
unit_price?: number
}
Relationships: [
{
foreignKeyName: "order_items_order_id_fkey"
columns: ["order_id"]
isOneToOne: false
referencedRelation: "orders"
referencedColumns: ["id"]
},
{
foreignKeyName: "order_items_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "products"
referencedColumns: ["id"]
},
{
foreignKeyName: "order_items_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "store_products_view"
referencedColumns: ["product_id"]
},
{
foreignKeyName: "order_items_store_id_fkey"
columns: ["store_id"]
isOneToOne: false
referencedRelation: "stores"
referencedColumns: ["id"]
},
]
}
orders: {
Row: {
cancellation_reason: string | null
cashback_discount_amount: number | null
cashback_earned_amount: number | null
contact_name: string
contact_phone: string
created_at: string
delivery_address: Json
delivery_fee_amount: number
driver_id: string | null
id: string
order_notes: string | null
order_number: string
payment_gateway_reference: string | null
payment_method: Database["public"]["Enums"]["payment_method"]
payment_status: Database["public"]["Enums"]["payment_status"] | null
promo_discount_amount: number | null
refund_option_chosen: string | null
scheduled_delivery_time: string | null
status: Database["public"]["Enums"]["order_status"] | null
store_ids: string[] | null
subtotal_amount: number
total_amount: number
updated_at: string
user_id: string | null
}
Insert: {
cancellation_reason?: string | null
cashback_discount_amount?: number | null
cashback_earned_amount?: number | null
contact_name: string
contact_phone: string
created_at?: string
delivery_address: Json
delivery_fee_amount: number
driver_id?: string | null
id?: string
order_notes?: string | null
order_number: string
payment_gateway_reference?: string | null
payment_method: Database["public"]["Enums"]["payment_method"]
payment_status?: Database["public"]["Enums"]["payment_status"] | null
promo_discount_amount?: number | null
refund_option_chosen?: string | null
scheduled_delivery_time?: string | null
status?: Database["public"]["Enums"]["order_status"] | null
store_ids?: string[] | null
subtotal_amount: number
total_amount: number
updated_at?: string
user_id?: string | null
}
Update: {
cancellation_reason?: string | null
cashback_discount_amount?: number | null
cashback_earned_amount?: number | null
contact_name?: string
contact_phone?: string
created_at?: string
delivery_address?: Json
delivery_fee_amount?: number
driver_id?: string | null
id?: string
order_notes?: string | null
order_number?: string
payment_gateway_reference?: string | null
payment_method?: Database["public"]["Enums"]["payment_method"]
payment_status?: Database["public"]["Enums"]["payment_status"] | null
promo_discount_amount?: number | null
refund_option_chosen?: string | null
scheduled_delivery_time?: string | null
status?: Database["public"]["Enums"]["order_status"] | null
store_ids?: string[] | null
subtotal_amount?: number
total_amount?: number
updated_at?: string
user_id?: string | null
}
Relationships: []
}
payments: {
Row: {
amount: number
created_at: string
currency: string | null
error_message: string | null
gateway_transaction_id: string
id: string
order_id: string | null
payment_gateway: string
payment_method_details: Json | null
status: string
updated_at: string
user_id: string | null
}
Insert: {
amount: number
created_at?: string
currency?: string | null
error_message?: string | null
gateway_transaction_id: string
id?: string
order_id?: string | null
payment_gateway: string
payment_method_details?: Json | null
status: string
updated_at?: string
user_id?: string | null
}
Update: {
amount?: number
created_at?: string
currency?: string | null
error_message?: string | null
gateway_transaction_id?: string
id?: string
order_id?: string | null
payment_gateway?: string
payment_method_details?: Json | null
status?: string
updated_at?: string
user_id?: string | null
}
Relationships: [
{
foreignKeyName: "payments_order_id_fkey"
columns: ["order_id"]
isOneToOne: false
referencedRelation: "orders"
referencedColumns: ["id"]
},
]
}
product_categories: {
Row: {
created_at: string
id: string
is_active: boolean
name: string
sort_order: number
updated_at: string
}
Insert: {
created_at?: string
id?: string
is_active?: boolean
name: string
sort_order?: number
updated_at?: string
}
Update: {
created_at?: string
id?: string
is_active?: boolean
name?: string
sort_order?: number
updated_at?: string
}
Relationships: []
}
product_categories_map: {
Row: {
category_id: string
created_at: string
product_id: string
}
Insert: {
category_id: string
created_at?: string
product_id: string
}
Update: {
category_id?: string
created_at?: string
product_id?: string
}
Relationships: [
{
foreignKeyName: "product_categories_map_category_id_fkey"
columns: ["category_id"]
isOneToOne: false
referencedRelation: "product_categories"
referencedColumns: ["id"]
},
{
foreignKeyName: "product_categories_map_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "products"
referencedColumns: ["id"]
},
{
foreignKeyName: "product_categories_map_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "store_products_view"
referencedColumns: ["product_id"]
},
]
}
product_modifier_groups: {
Row: {
created_at: string
id: string
is_required: boolean
max_selection: number | null
min_selection: number
name: string
product_id: string
selection_type: string
sort_order: number
updated_at: string
}
Insert: {
created_at?: string
id?: string
is_required?: boolean
max_selection?: number | null
min_selection?: number
name: string
product_id: string
selection_type?: string
sort_order?: number
updated_at?: string
}
Update: {
created_at?: string
id?: string
is_required?: boolean
max_selection?: number | null
min_selection?: number
name?: string
product_id?: string
selection_type?: string
sort_order?: number
updated_at?: string
}
Relationships: [
{
foreignKeyName: "product_modifier_groups_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "products"
referencedColumns: ["id"]
},
{
foreignKeyName: "product_modifier_groups_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "store_products_view"
referencedColumns: ["product_id"]
},
]
}
product_modifiers: {
Row: {
additional_price: number
created_at: string
group_id: string
id: string
is_active: boolean
name: string
sort_order: number
updated_at: string
}
Insert: {
additional_price?: number
created_at?: string
group_id: string
id?: string
is_active?: boolean
name: string
sort_order?: number
updated_at?: string
}
Update: {
additional_price?: number
created_at?: string
group_id?: string
id?: string
is_active?: boolean
name?: string
sort_order?: number
updated_at?: string
}
Relationships: [
{
foreignKeyName: "product_modifiers_group_id_fkey"
columns: ["group_id"]
isOneToOne: false
referencedRelation: "product_modifier_groups"
referencedColumns: ["id"]
},
]
}
products: {
Row: {
base_price: number
compare_at_price: number | null
created_at: string
description: string | null
id: string
image_urls: string[] | null
is_active: boolean
name: string
product_type: string
updated_at: string
}
Insert: {
base_price: number
compare_at_price?: number | null
created_at?: string
description?: string | null
id?: string
image_urls?: string[] | null
is_active?: boolean
name: string
product_type?: string
updated_at?: string
}
Update: {
base_price?: number
compare_at_price?: number | null
created_at?: string
description?: string | null
id?: string
image_urls?: string[] | null
is_active?: boolean
name?: string
product_type?: string
updated_at?: string
}
Relationships: []
}
profiles: {
Row: {
avatar_url: string | null
created_at: string
full_name: string | null
preferred_language: string | null
preferred_theme: string | null
updated_at: string
user_id: string
}
Insert: {
avatar_url?: string | null
created_at?: string
full_name?: string | null
preferred_language?: string | null
preferred_theme?: string | null
updated_at?: string
user_id: string
}
Update: {
avatar_url?: string | null
created_at?: string
full_name?: string | null
preferred_language?: string | null
preferred_theme?: string | null
updated_at?: string
user_id?: string
}
Relationships: []
}
staff_assignments: {
Row: {
created_at: string
role: Database["public"]["Enums"]["user_role"]
updated_at: string
user_id: string
}
Insert: {
created_at?: string
role?: Database["public"]["Enums"]["user_role"]
updated_at?: string
user_id: string
}
Update: {
created_at?: string
role?: Database["public"]["Enums"]["user_role"]
updated_at?: string
user_id?: string
}
Relationships: []
}
store_categories: {
Row: {
category_id: string
created_at: string
store_id: string
}
Insert: {
category_id: string
created_at?: string
store_id: string
}
Update: {
category_id?: string
created_at?: string
store_id?: string
}
Relationships: [
{
foreignKeyName: "store_categories_category_id_fkey"
columns: ["category_id"]
isOneToOne: false
referencedRelation: "product_categories"
referencedColumns: ["id"]
},
{
foreignKeyName: "store_categories_store_id_fkey"
columns: ["store_id"]
isOneToOne: false
referencedRelation: "stores"
referencedColumns: ["id"]
},
]
}
store_products: {
Row: {
created_at: string
is_available_in_store: boolean
price_override: number | null
product_id: string
store_id: string
}
Insert: {
created_at?: string
is_available_in_store?: boolean
price_override?: number | null
product_id: string
store_id: string
}
Update: {
created_at?: string
is_available_in_store?: boolean
price_override?: number | null
product_id?: string
store_id?: string
}
Relationships: [
{
foreignKeyName: "store_products_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "products"
referencedColumns: ["id"]
},
{
foreignKeyName: "store_products_product_id_fkey"
columns: ["product_id"]
isOneToOne: false
referencedRelation: "store_products_view"
referencedColumns: ["product_id"]
},
{
foreignKeyName: "store_products_store_id_fkey"
columns: ["store_id"]
isOneToOne: false
referencedRelation: "stores"
referencedColumns: ["id"]
},
]
}
stores: {
Row: {
accepted_postal_codes: string[] | null
address_city: string
address_country: string
address_internal: string | null
address_neighborhood: string | null
address_postal_code: string
address_street: string
banner_url: string | null
contact_phone: string | null
created_at: string
delivery_fee: number
estimated_delivery_time_minutes: number | null
group_id: string | null
id: string
is_active: boolean
latitude: number
logo_url: string | null
longitude: number
minimum_order_amount: number | null
name: string
operating_hours: Json
special_hours: Json | null
updated_at: string
}
Insert: {
accepted_postal_codes?: string[] | null
address_city: string
address_country?: string
address_internal?: string | null
address_neighborhood?: string | null
address_postal_code: string
address_street: string
banner_url?: string | null
contact_phone?: string | null
created_at?: string
delivery_fee?: number
estimated_delivery_time_minutes?: number | null
group_id?: string | null
id?: string
is_active?: boolean
latitude: number
logo_url?: string | null
longitude: number
minimum_order_amount?: number | null
name: string
operating_hours?: Json
special_hours?: Json | null
updated_at?: string
}
Update: {
accepted_postal_codes?: string[] | null
address_city?: string
address_country?: string
address_internal?: string | null
address_neighborhood?: string | null
address_postal_code?: string
address_street?: string
banner_url?: string | null
contact_phone?: string | null
created_at?: string
delivery_fee?: number
estimated_delivery_time_minutes?: number | null
group_id?: string | null
id?: string
is_active?: boolean
latitude?: number
logo_url?: string | null
longitude?: number
minimum_order_amount?: number | null
name?: string
operating_hours?: Json
special_hours?: Json | null
updated_at?: string
}
Relationships: [
{
foreignKeyName: "stores_group_id_fkey"
columns: ["group_id"]
isOneToOne: false
referencedRelation: "groups"
referencedColumns: ["id"]
},
]
}
}
Views: {
store_products_view: {
Row: {
base_price: number | null
compare_at_price: number | null
created_at: string | null
description: string | null
image_urls: string[] | null
is_active: boolean | null
is_available_in_store: boolean | null
name: string | null
product_id: string | null
product_type: string | null
store_id: string | null
updated_at: string | null
}
Relationships: [
{
foreignKeyName: "store_products_store_id_fkey"
columns: ["store_id"]
isOneToOne: false
referencedRelation: "stores"
referencedColumns: ["id"]
},
]
}
}
Functions: {
is_admin: {
Args: Record<PropertyKey, never>
Returns: boolean
}
is_staff: {
Args: Record<PropertyKey, never>
Returns: boolean
}
}
Enums: {
order_status:
| "pending_payment"
| "confirmed"
| "preparing"
| "ready_for_pickup"
| "out_for_delivery"
| "delivered"
| "cancelled"
| "failed"
payment_method: "card" | "cash" | "terminal"
payment_status: "pending" | "paid" | "failed" | "refunded" | "authorized"
user_role: "customer" | "admin"
}
CompositeTypes: {
[_ in never]: never
}
}
}
type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])> = 
  (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R } ? R : never;

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = 
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never;

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = 
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never;

export type Enums<T extends keyof DefaultSchema["Enums"]> = 
  DefaultSchema["Enums"][T];

export type CompositeTypes<T extends keyof DefaultSchema["CompositeTypes"]> = 
  DefaultSchema["CompositeTypes"][T];

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending_payment",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "failed",
      ],
      payment_method: ["card", "cash", "terminal"],
      payment_status: ["pending", "paid", "failed", "refunded", "authorized"],
      user_role: ["customer", "admin"],
    },
  },
} as const;