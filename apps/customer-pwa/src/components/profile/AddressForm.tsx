import React, { useEffect, useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Address } from '@repo/api-client';
import { AutocompleteInput } from '@/components/common/AutocompleteInput';

type AddressFormData = {
  autocomplete_search: string;
  street_address: string;
  internal_number?: string | null;
  neighborhood?: string | null;
  postal_code: string;
  city: string;
  country: string;
  delivery_instructions?: string | null;
  is_primary: boolean;
  latitude?: number | null;
  longitude?: number | null;
  google_place_id?: string | null;
};

interface AddressFormProps {
  onSubmit: (data: Omit<AddressFormData, 'autocomplete_search'>, addressId?: string) => void;
  initialData?: Address | null;
  isLoading: boolean;
}

const getAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string): string => {
  return components.find(comp => comp.types.includes(type))?.long_name || '';
};

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<AddressFormData>({
    defaultValues: {
      autocomplete_search: '',
      street_address: '',
      internal_number: '',
      neighborhood: '',
      postal_code: '',
      city: '',
      country: 'MX',
      delivery_instructions: '',
      is_primary: false,
      latitude: null,
      longitude: null,
      google_place_id: null,
      ...(initialData ? {
        ...initialData,
        autocomplete_search: `${initialData.street_address}, ${initialData.city}`
      } : {}),
    },
  });

  useEffect(() => {
    const defaultVals = {
      autocomplete_search: '', street_address: '', internal_number: '', neighborhood: '', 
      postal_code: '', city: '', country: 'MX', delivery_instructions: '', 
      is_primary: false, latitude: null, longitude: null, google_place_id: null
    };
    if (initialData) {
      reset({
        ...defaultVals,
        ...initialData,
        autocomplete_search: `${initialData.street_address}, ${initialData.city}`,
        internal_number: initialData.internal_number || '',
        neighborhood: initialData.neighborhood || '',
        delivery_instructions: initialData.delivery_instructions || '',
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        google_place_id: initialData.google_place_id || null,
      });
    } else {
      reset(defaultVals);
    }
  }, [initialData, reset]);

  const handlePlaceSelected = useCallback((place: google.maps.places.PlaceResult | null) => {
    console.log("Place selected:", place);
    if (place && place.address_components) {
      const components = place.address_components;

      const streetNumber = getAddressComponent(components, 'street_number');
      const route = getAddressComponent(components, 'route');
      const sublocality = getAddressComponent(components, 'sublocality_level_1') || getAddressComponent(components, 'sublocality');
      const locality = getAddressComponent(components, 'locality');
      const postalCode = getAddressComponent(components, 'postal_code');
      const countryCode = getAddressComponent(components, 'country');

      setValue('street_address', `${route} ${streetNumber}`.trim(), { shouldValidate: true, shouldDirty: true });
      setValue('neighborhood', sublocality, { shouldValidate: true, shouldDirty: true });
      setValue('city', locality, { shouldValidate: true, shouldDirty: true });
      setValue('postal_code', postalCode, { shouldValidate: true, shouldDirty: true });
      setValue('country', countryCode || 'MX', { shouldValidate: true, shouldDirty: true });

      setValue('latitude', place.geometry?.location?.lat() || null);
      setValue('longitude', place.geometry?.location?.lng() || null);
      setValue('google_place_id', place.place_id || null);

      setValue('autocomplete_search', place.formatted_address || '');
    } else {
      console.log("Invalid place selected or cleared");
    }
  }, [setValue]);

  const handleFormSubmit: SubmitHandler<AddressFormData> = (data) => {
    const { autocomplete_search, ...submitData } = data;
    onSubmit(submitData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <AutocompleteInput
        label="Search for Address"
        initialValue={watch('autocomplete_search')}
        {...register('autocomplete_search')}
        onPlaceSelect={handlePlaceSelected}
        disabled={isLoading}
        country="mx"
      />

      <p className="text-xs text-muted-foreground">Or fill in the details manually below:</p>
      <hr/>

      <div className="grid gap-1.5">
        <Label htmlFor="street_address">Street Address *</Label>
        <Input 
          id="street_address" 
          {...register('street_address', { required: 'Street address is required' })} 
          disabled={isLoading} 
        />
        {errors.street_address && <p className="text-red-500 text-sm">{errors.street_address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="internal_number">Apt / Suite #</Label>
          <Input id="internal_number" {...register('internal_number')} disabled={isLoading} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input id="neighborhood" {...register('neighborhood')} disabled={isLoading} />
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
          {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="city">City *</Label>
          <Input 
            id="city" 
            {...register('city', { required: 'City is required' })} 
            disabled={isLoading} 
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="country">Country *</Label>
          <Input 
            id="country" 
            {...register('country', { required: 'Country is required' })} 
            disabled={isLoading} 
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
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
        <Label htmlFor="is_primary" className="text-sm font-medium leading-none">
          Set as primary
        </Label>
      </div>

      <input type="hidden" {...register('latitude')} />
      <input type="hidden" {...register('longitude')} />
      <input type="hidden" {...register('google_place_id')} />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : (initialData ? 'Update Address' : 'Add Address')}
      </Button>
    </form>
  );
}; 