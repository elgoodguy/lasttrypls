import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Address } from '@repo/api-client';
import AutocompleteInput from '../common/AutocompleteInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

const addressSchema = z.object({
  street_address: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  neighborhood: z.string().nullable(),
  postal_code: z.string().min(1, "El código postal es requerido"),
  country: z.string().min(1, "El país es requerido"),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  google_place_id: z.string().nullable(),
  is_primary: z.boolean().optional(),
  internal_number: z.string().nullable(),
  delivery_instructions: z.string().nullable(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
  isGoogleMapsLoaded: boolean;
  initialData?: Partial<AddressFormData> | null;
  initialAutocompleteValue?: string;
  onBack?: () => void;
}

export function AddressForm({
  onSubmit,
  isLoading = false,
  isGoogleMapsLoaded,
  initialData,
  initialAutocompleteValue = '',
  onBack
}: AddressFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street_address: initialData?.street_address || '',
      city: initialData?.city || '',
      neighborhood: initialData?.neighborhood || null,
      postal_code: initialData?.postal_code || '',
      country: initialData?.country || 'MX',
      latitude: initialData?.latitude || null,
      longitude: initialData?.longitude || null,
      google_place_id: initialData?.google_place_id || null,
      is_primary: initialData?.is_primary || false,
      internal_number: initialData?.internal_number || null,
      delivery_instructions: initialData?.delivery_instructions || null,
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      )}

      {initialAutocompleteValue && (
        <div className="mb-4">
          <Label>Ubicación seleccionada</Label>
          <p className="text-sm text-muted-foreground border p-2 rounded">
            {initialAutocompleteValue}
          </p>
        </div>
      )}

      <div>
        <Label>Dirección</Label>
        <Input {...form.register('street_address')} disabled={isLoading} />
        {form.formState.errors.street_address && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.street_address.message}</p>
        )}
      </div>

      <div>
        <Label>Número interior (opcional)</Label>
        <Input {...form.register('internal_number')} disabled={isLoading} />
      </div>

      <div>
        <Label>Ciudad</Label>
        <Input {...form.register('city')} disabled={isLoading} />
        {form.formState.errors.city && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
        )}
      </div>

      <div>
        <Label>Colonia</Label>
        <Input {...form.register('neighborhood')} disabled={isLoading} />
      </div>

      <div>
        <Label>Código Postal</Label>
        <Input {...form.register('postal_code')} disabled={isLoading} />
        {form.formState.errors.postal_code && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.postal_code.message}</p>
        )}
      </div>

      <div>
        <Label>País</Label>
        <Input {...form.register('country')} disabled={isLoading} />
        {form.formState.errors.country && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.country.message}</p>
        )}
      </div>

      <div>
        <Label>Instrucciones de entrega (opcional)</Label>
        <Input {...form.register('delivery_instructions')} disabled={isLoading} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Guardando...' : (initialData ? 'Actualizar Dirección' : 'Confirmar Dirección')}
      </Button>
    </form>
  );
} 