import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string().optional(),
  street_address: z.string().min(1, 'La dirección es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  neighborhood: z.string().nullable(),
  postal_code: z.string().min(1, 'El código postal es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  google_place_id: z.string().nullable(),
  is_primary: z.boolean().optional(),
  internal_number: z.string().nullable(),
  delivery_instructions: z.string().nullable(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
