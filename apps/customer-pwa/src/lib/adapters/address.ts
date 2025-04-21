import type { Address as ApiAddress } from '@repo/api-client';
import type { UiAddress } from '@/types/address';

export function apiToUiAddress(address: ApiAddress): UiAddress {
  return {
    id: address.id,
    street_address: address.street_address,
    city: address.city,
    neighborhood: address.neighborhood,
    postal_code: address.postal_code,
    country: address.country,
    latitude: address.latitude,
    longitude: address.longitude,
    google_place_id: address.google_place_id,
    is_primary: address.is_primary,
    internal_number: address.internal_number,
    delivery_instructions: address.delivery_instructions,
  };
}

export function uiToApiAddress(address: UiAddress): Omit<ApiAddress, 'id' | 'created_at' | 'updated_at' | 'user_id'> {
  return {
    street_address: address.street_address,
    city: address.city,
    neighborhood: address.neighborhood,
    postal_code: address.postal_code,
    country: address.country,
    latitude: address.latitude,
    longitude: address.longitude,
    google_place_id: address.google_place_id,
    is_primary: address.is_primary ?? false,
    internal_number: address.internal_number,
    delivery_instructions: address.delivery_instructions,
  };
} 