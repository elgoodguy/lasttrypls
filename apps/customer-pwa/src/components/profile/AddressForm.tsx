import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Address } from '@repo/api-client';

type AddressInput = Omit<Address, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

interface AddressFormProps {
  onSubmit: (data: AddressInput, addressId?: string) => void;
  initialData?: Address | null;
  isLoading: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AddressInput>({
    defaultValues: {
      street_address: '',
      internal_number: '',
      neighborhood: '',
      postal_code: '',
      city: '',
      country: 'MX',
      delivery_instructions: '',
      is_primary: false,
      google_place_id: null,
      latitude: null,
      longitude: null,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        internal_number: initialData.internal_number || '',
        neighborhood: initialData.neighborhood || '',
        delivery_instructions: initialData.delivery_instructions || '',
        google_place_id: initialData.google_place_id || null,
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
      });
    } else {
      reset({
        street_address: '',
        internal_number: '',
        neighborhood: '',
        postal_code: '',
        city: '',
        country: 'MX',
        delivery_instructions: '',
        is_primary: false,
        google_place_id: null,
        latitude: null,
        longitude: null,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: AddressInput) => {
    onSubmit(data, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="street_address">Street Address *</Label>
        <Input
          id="street_address"
          {...register('street_address', { required: 'Street address is required' })}
          disabled={isLoading}
        />
        {errors.street_address && (
          <p className="text-red-500 text-sm">{errors.street_address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="internal_number">Apt / Suite #</Label>
          <Input
            id="internal_number"
            {...register('internal_number')}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            {...register('neighborhood')}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="postal_code">Postal Code *</Label>
          <Input
            id="postal_code"
            {...register('postal_code', { required: 'Postal code is required' })}
            disabled={isLoading}
          />
          {errors.postal_code && (
            <p className="text-red-500 text-sm">{errors.postal_code.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register('city', { required: 'City is required' })}
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            {...register('country', { required: 'Country is required' })}
            disabled={isLoading}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="delivery_instructions">Delivery Instructions</Label>
        <Textarea
          id="delivery_instructions"
          {...register('delivery_instructions')}
          placeholder="E.g., leave at front door, gate code #1234"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="is_primary"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="is_primary"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          )}
        />
        <Label
          htmlFor="is_primary"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Set as primary delivery address
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : (initialData ? 'Update Address' : 'Add Address')}
      </Button>
    </form>
  );
}; 