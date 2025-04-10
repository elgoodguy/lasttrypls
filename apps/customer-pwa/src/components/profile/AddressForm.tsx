import { Button } from '@repo/ui/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormData } from '@/lib/validations/address';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { useGeolocation, useGooglePlacesAutocomplete, useGoogleMapsScript } from '@repo/hooks';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Prediction {
  place_id: string;
  description: string;
}

const getAddressComponent = (
  components: google.maps.GeocoderAddressComponent[] = [],
  type: string
): string => {
  const component = components?.find(c => c.types.includes(type));
  return component?.long_name || '';
};

const getStreetAddress = (components: google.maps.GeocoderAddressComponent[] = []): string => {
  const streetNumber = getAddressComponent(components, 'street_number');
  const route = getAddressComponent(components, 'route');
  return streetNumber ? `${route} ${streetNumber}` : route;
};

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<AddressFormData>;
  isForceModal?: boolean;
}

export function AddressForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  isForceModal = false,
}: AddressFormProps) {
  const { t } = useTranslation();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { getCurrentLocation, isLoading: isLoadingLocation } = useGeolocation();
  const {
    searchPlaces,
    predictions,
    getPlaceDetails,
    isLoading: isLoadingSearch,
  } = useGooglePlacesAutocomplete();
  const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsError } = useGoogleMapsScript();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street_address: '',
      city: '',
      neighborhood: null,
      postal_code: '',
      country: 'MX',
      latitude: null,
      longitude: null,
      google_place_id: null,
      internal_number: null,
      delivery_instructions: null,
      ...defaultValues,
    },
  });

  const handleUseCurrentLocation = async () => {
    if (!isGoogleMapsLoaded) {
      toast.error('El servicio de Google Maps no está disponible');
      return;
    }

    try {
      const location = await getCurrentLocation();
      if (location) {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({
          location: { lat: location.latitude, lng: location.longitude },
        });

        if (response.results[0]) {
          const place = {
            address_components: response.results[0].address_components,
            geometry: {
              location: {
                lat: () => location.latitude,
                lng: () => location.longitude,
              },
            },
          };

          const result = {
            street_address: getStreetAddress(place.address_components),
            city: getAddressComponent(place.address_components, 'locality'),
            neighborhood: getAddressComponent(place.address_components, 'sublocality'),
            postal_code: getAddressComponent(place.address_components, 'postal_code'),
            latitude: location.latitude,
            longitude: location.longitude,
            google_place_id: response.results[0].place_id || '',
          };

          form.reset({
            ...form.getValues(),
            ...result,
          });
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error('Error al obtener la ubicación');
    }
  };

  const handleSearchSelect = async (placeId: string) => {
    const place = await getPlaceDetails(placeId);
    if (place) {
      form.reset({
        ...form.getValues(),
        street_address: place.street_address,
        city: place.city,
        neighborhood: place.neighborhood,
        postal_code: place.postal_code,
        latitude: place.latitude,
        longitude: place.longitude,
        google_place_id: place.google_place_id,
      });
      setIsSearchModalOpen(false);
    }
  };

  if (googleMapsError) {
    toast.error(t('address.googleMapsError'));
  }

  return (
    <>
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('address.searchTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={googleMapsError ? t('address.googleMapsNotAvailable') : t('address.searchPlaceholder')}
                className="w-full pl-8 p-2 border rounded-md bg-white text-foreground"
                onChange={e => searchPlaces(e.target.value)}
                disabled={!isGoogleMapsLoaded || !!googleMapsError}
              />
            </div>
            {isLoadingSearch ? (
              <div className="text-center py-4">{t('common.searching')}</div>
            ) : (
              <div className="space-y-2">
                {predictions.map((prediction: Prediction) => (
                  <button
                    key={prediction.place_id}
                    className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => handleSearchSelect(prediction.place_id)}
                  >
                    {prediction.description}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setIsSearchModalOpen(true)}
            disabled={!isGoogleMapsLoaded || !!googleMapsError}
          >
            <Search className="mr-2 h-4 w-4" />
            {t('address.searchAddress')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleUseCurrentLocation}
            disabled={isLoadingLocation || !isGoogleMapsLoaded || !!googleMapsError}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {isLoadingLocation ? t('address.gettingLocation') : t('address.useMyLocation')}
          </Button>
        </div>

        {googleMapsError && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
            {t('address.manualEntryRequired')}
          </div>
        )}

        <div className="grid gap-2">
          <label htmlFor="street_address" className="text-sm font-medium">
            {t('address.details.street')}
          </label>
          <input
            {...form.register('street_address')}
            type="text"
            id="street_address"
            placeholder={t('address.details.street')}
            className="w-full p-2 border rounded-md bg-white text-foreground"
          />
          {form.formState.errors.street_address && (
            <p className="text-sm text-red-500">
              {form.formState.errors.street_address.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="internal_number" className="text-sm font-medium">
            {t('address.details.interior')}
          </label>
          <input
            {...form.register('internal_number')}
            type="text"
            id="internal_number"
            placeholder={t('address.details.example')}
            className="w-full p-2 border rounded-md bg-white text-foreground"
          />
          {form.formState.errors.internal_number && (
            <p className="text-sm text-red-500">
              {form.formState.errors.internal_number.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="neighborhood" className="text-sm font-medium">
            {t('address.details.neighborhood')}
          </label>
          <input
            {...form.register('neighborhood')}
            type="text"
            id="neighborhood"
            placeholder={t('address.details.neighborhood')}
            className="w-full p-2 border rounded-md bg-white text-foreground"
          />
          {form.formState.errors.neighborhood && (
            <p className="text-sm text-red-500">
              {form.formState.errors.neighborhood.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="city" className="text-sm font-medium">
            {t('address.details.city')}
          </label>
          <input
            {...form.register('city')}
            type="text"
            id="city"
            placeholder={t('address.details.city')}
            className="w-full p-2 border rounded-md bg-white text-foreground"
          />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500">{form.formState.errors.city.message as string}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="postal_code" className="text-sm font-medium">
            {t('address.details.zipCode')}
          </label>
          <input
            {...form.register('postal_code')}
            type="text"
            id="postal_code"
            placeholder="66250"
            className="w-full p-2 border rounded-md bg-white text-foreground"
          />
          {form.formState.errors.postal_code && (
            <p className="text-sm text-red-500">
              {form.formState.errors.postal_code.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="delivery_instructions" className="text-sm font-medium">
            {t('address.details.instructions')}
          </label>
          <textarea
            {...form.register('delivery_instructions')}
            id="delivery_instructions"
            placeholder={t('address.details.example')}
            className="w-full p-2 border rounded-md bg-white text-foreground"
            rows={2}
          />
          {form.formState.errors.delivery_instructions && (
            <p className="text-sm text-red-500">
              {form.formState.errors.delivery_instructions.message as string}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? t('common.saving') : isForceModal ? t('common.continue') : t('address.save')}
        </Button>
      </form>
    </>
  );
}
