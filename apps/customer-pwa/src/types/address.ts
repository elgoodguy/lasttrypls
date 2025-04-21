export interface Address {
  id?: string;
  street_address: string;
  city: string;
  neighborhood: string | null;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  is_primary?: boolean;
  internal_number: string | null;
  delivery_instructions: string | null;
}

// Re-export the Address type as UiAddress for clarity
export type UiAddress = Address;

export interface DeliveryAddress extends Address {
  deliveryInstructions?: string;
} 