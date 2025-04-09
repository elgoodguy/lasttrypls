import { useEffect, useState } from 'react';
import { Button } from '@repo/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui';
import { AutocompleteInput } from '@/components/common/AutocompleteInput';
import { useGoogleMapsScript } from '@/hooks/useGoogleMapsScript';
import { AddressForm } from './AddressForm';
import { Address } from '@repo/api-client';

type PrefilledAddressData = {
  id?: string;
  street_address: string;
  neighborhood: string | null;
  city: string;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  is_primary: boolean;
  internal_number: string | null;
  delivery_instructions: string | null;
};

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, addressId?: string) => void;
  isLoading?: boolean;
  isForceModal?: boolean;
  addressToEdit?: Address | null;
}

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  isForceModal = false,
  addressToEdit = null,
}: AddressModalProps) {
  const [step, setStep] = useState<'initial' | 'form'>('initial');
  const [prefilledData, setPrefilledData] = useState<PrefilledAddressData | null>(null);
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const { isLoaded, loadError } = useGoogleMapsScript();

  useEffect(() => {
    if (isOpen) {
      if (addressToEdit) {
        setPrefilledData(addressToEdit);
        setAutocompleteValue(addressToEdit.street_address || '');
        setStep('form');
      } else {
        setStep('initial');
        setPrefilledData(null);
        setAutocompleteValue('');
      }
    }
  }, [isOpen, addressToEdit]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada en tu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        try {
          const geocoder = new google.maps.Geocoder();
          const result = await geocoder.geocode({
            location: { lat, lng },
          });

          if (result.results[0]) {
            const place = result.results[0];
            const getComponent = (type: string): string => {
              const component = place.address_components?.find(c => c.types.includes(type));
              return component ? component.long_name : '';
            };

            const streetNumber = getComponent('street_number');
            const route = getComponent('route');
            const neighborhood = getComponent('sublocality_level_1') || getComponent('sublocality');
            const city = getComponent('locality');
            const postalCode = getComponent('postal_code');
            const country = getComponent('country');

            const data: PrefilledAddressData = {
              street_address: `${route} ${streetNumber}`.trim(),
              neighborhood: neighborhood || null,
              city: city || '',
              postal_code: postalCode || '',
              country: country || 'MX',
              latitude: lat,
              longitude: lng,
              google_place_id: place.place_id || null,
              is_primary: true,
              internal_number: null,
              delivery_instructions: null,
            };

            setPrefilledData(data);
            setAutocompleteValue(place.formatted_address || '');
            setStep('form');
          }
        } catch (error) {
          console.error('Error al obtener la dirección:', error);
          alert('No se pudo obtener la dirección de tu ubicación actual');
        }
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
        alert('No se pudo obtener tu ubicación actual');
      }
    );
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.address_components) {
      console.warn('Place has no address components:', place);
      return;
    }

    const getComponent = (type: string): string => {
      const component = place.address_components?.find(c => c.types.includes(type));
      return component ? component.long_name : '';
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const neighborhood = getComponent('sublocality') || getComponent('sublocality_level_1');
    const city = getComponent('locality');
    const postalCode = getComponent('postal_code');
    const country = getComponent('country');

    const data: PrefilledAddressData = {
      street_address: `${route} ${streetNumber}`.trim(),
      neighborhood: neighborhood || null,
      city: city || '',
      postal_code: postalCode || '',
      country: country || 'MX',
      latitude: place.geometry?.location?.lat() || null,
      longitude: place.geometry?.location?.lng() || null,
      google_place_id: place.place_id || null,
      is_primary: true,
      internal_number: null,
      delivery_instructions: null,
    };

    setPrefilledData(data);
    setAutocompleteValue(place.formatted_address || '');
    setStep('form');
  };

  const handleBack = () => {
    if (!addressToEdit && !isForceModal) {
      setStep('initial');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={isForceModal ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {step === 'initial' && !addressToEdit && (
            <>
              <DialogTitle>Selecciona tu dirección</DialogTitle>
              <DialogDescription>Elige cómo quieres ingresar tu dirección</DialogDescription>
            </>
          )}
        </DialogHeader>

        {step === 'initial' && !addressToEdit ? (
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              onClick={handleUseCurrentLocation}
              disabled={!isLoaded || !!loadError}
              className="w-full"
            >
              Usar mi ubicación actual
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O</span>
              </div>
            </div>

            <AutocompleteInput
              onPlaceSelected={handlePlaceSelected}
              placeholder="Buscar dirección manualmente"
              disabled={!isLoaded || !!loadError}
            />

            {loadError && (
              <p className="text-sm text-red-500">
                Error al cargar Google Maps. Por favor, intenta más tarde.
              </p>
            )}
          </div>
        ) : (
          <AddressForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            isGoogleMapsLoaded={isLoaded}
            initialData={prefilledData}
            onBack={addressToEdit ? undefined : handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 