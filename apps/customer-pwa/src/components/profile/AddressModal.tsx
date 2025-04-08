import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { AddressForm } from './AddressForm';
import { Address } from '@repo/api-client';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import AutocompleteInput from '../common/AutocompleteInput';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Label } from "@repo/ui/components/ui/label";
import { cn } from "@repo/ui/lib/utils";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, addressId?: string) => void;
  isLoading: boolean;
  addressToEdit?: Address | null;
  isForceModal?: boolean;
}

type PrefilledAddressData = Partial<Address>;

const AddressModalContent: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  addressToEdit,
  isForceModal = false,
}) => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const geocoding = useMapsLibrary('geocoding');
  const places = useMapsLibrary('places');

  const [step, setStep] = useState<'initial' | 'form'>('initial');
  const [prefilledData, setPrefilledData] = useState<PrefilledAddressData | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [autocompleteValue, setAutocompleteValue] = useState<string>('');
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  useEffect(() => {
    console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
    console.log('Geocoding Library:', geocoding ? 'Loaded' : 'Not loaded');
    console.log('Places Library:', places ? 'Loaded' : 'Not loaded');
    
    if (geocoding && places) {
      setLibrariesLoaded(true);
    }
  }, [GOOGLE_MAPS_API_KEY, geocoding, places]);

  useEffect(() => {
    if (isOpen) {
      if (addressToEdit) {
        setPrefilledData(addressToEdit);
        setStep('form');
      } else {
        setStep('initial');
        setPrefilledData(null);
        setGeocodingError(null);
        setAutocompleteValue('');
      }
    }
  }, [isOpen, addressToEdit]);

  const handleUseCurrentLocation = () => {
    console.log('Current location button clicked');
    console.log('Geocoding available:', !!geocoding);
    console.log('Geolocation available:', !!navigator.geolocation);

    if (!navigator.geolocation) {
      toast.error("La geolocalización no está soportada en tu navegador");
      return;
    }

    if (!geocoding) {
      toast.error("El servicio de geocodificación no está disponible");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const geocoder = new geocoding.Geocoder();
          const response = await geocoder.geocode({ location: { lat, lng } });

          if (response.results && response.results.length > 0) {
            const place = response.results[0];

            const getAddressComponent = (type: string): string => {
              const component = place.address_components?.find(c => c.types.includes(type));
              return component ? component.long_name : '';
            };

            const streetNumber = getAddressComponent('street_number');
            const route = getAddressComponent('route');
            const neighborhood = getAddressComponent('sublocality_level_1') || getAddressComponent('sublocality');
            const city = getAddressComponent('locality');
            const postalCode = getAddressComponent('postal_code');
            const country = getAddressComponent('country');

            const data: PrefilledAddressData = {
              street_address: `${route} ${streetNumber}`.trim(),
              neighborhood: neighborhood || null,
              city,
              postal_code: postalCode,
              country: country || 'MX',
              latitude: lat,
              longitude: lng,
              google_place_id: place.place_id || null,
              is_primary: true,
            };

            setPrefilledData(data);
            setAutocompleteValue(place.formatted_address || '');
            setStep('form');
          } else {
            setGeocodingError("No se pudieron encontrar detalles de la dirección para tu ubicación.");
          }
        } catch (error: any) {
          console.error("Error en geocodificación inversa:", error);
          setGeocodingError("Error al buscar los detalles de la dirección: " + (error?.message || 'Error desconocido'));
        } finally {
          setIsGeocoding(false);
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        let message = "No se pudo obtener tu ubicación.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Permiso de ubicación denegado. Por favor, actívalo en la configuración de tu navegador.";
        }
        setGeocodingError(message);
        setIsGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult | null) => {
    console.log('Place selected:', place ? 'Yes' : 'No');
    if (place && place.address_components) {
      const getAddressComponent = (type: string): string => {
        const component = place.address_components?.find(c => c.types.includes(type));
        return component ? component.long_name : '';
      };

      const streetNumber = getAddressComponent('street_number');
      const route = getAddressComponent('route');
      const neighborhood = getAddressComponent('sublocality_level_1') || getAddressComponent('sublocality');
      const city = getAddressComponent('locality');
      const postalCode = getAddressComponent('postal_code');
      const country = getAddressComponent('country');

      const data: PrefilledAddressData = {
        street_address: `${route} ${streetNumber}`.trim(),
        neighborhood: neighborhood || null,
        city,
        postal_code: postalCode,
        country: country || 'MX',
        latitude: place.geometry?.location?.lat() || null,
        longitude: place.geometry?.location?.lng() || null,
        google_place_id: place.place_id || null,
        is_primary: true,
      };

      setPrefilledData(data);
      setAutocompleteValue(place.formatted_address || '');
      setStep('form');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isForceModal) {
      onClose();
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="error-message">
          <DialogHeader>
            <DialogTitle>Error de Configuración</DialogTitle>
          </DialogHeader>
          <p id="error-message" className="text-red-500 py-4">
            La clave de API de Google Maps no está configurada. Las funciones de dirección no están disponibles.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!librariesLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="loading-message">
          <DialogHeader>
            <DialogTitle>Cargando...</DialogTitle>
          </DialogHeader>
          <p id="loading-message" className="text-muted-foreground py-4">
            Cargando servicios de Google Maps...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "sm:max-w-[600px]",
          isForceModal && "[&_button[aria-label='Close']]:hidden"
        )}
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{addressToEdit ? 'Editar Dirección' : 'Agregar Dirección'}</DialogTitle>
          <DialogDescription id="dialog-description">
            {!addressToEdit && step === 'initial' && '¿Cómo quieres ingresar tu dirección?'}
            {!addressToEdit && step === 'form' && 'Por favor revisa y completa los detalles de tu dirección.'}
            {addressToEdit && 'Actualiza los detalles de tu dirección de entrega.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!addressToEdit && step === 'initial' && (
            <div className="space-y-4">
              {geocodingError && (
                <p className="text-red-500 text-sm">{geocodingError}</p>
              )}
              
              <Button
                variant="outline"
                className="w-full h-auto py-4 justify-start"
                onClick={handleUseCurrentLocation}
                disabled={isGeocoding || !geocoding}
              >
                <MapPin className="mr-2 h-4 w-4 shrink-0" />
                <span className="text-left">
                  {isGeocoding ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                </span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Buscar dirección manualmente</Label>
                <AutocompleteInput
                  onPlaceSelect={handlePlaceSelected}
                  isGoogleMapsLoaded={!!geocoding}
                  disabled={isLoading}
                  initialValue=""
                  placeholder="Empieza a escribir tu dirección"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {step === 'form' && (
            <AddressForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              isGoogleMapsLoaded={!!geocoding}
              initialData={addressToEdit || prefilledData}
              initialAutocompleteValue={autocompleteValue}
              onBack={!addressToEdit ? () => setStep('initial') : undefined}
            />
          )}
        </div>

        {isForceModal && step === 'initial' && (
          <DialogFooter className="text-center text-xs text-muted-foreground">
            Necesitas agregar una dirección para continuar usando la aplicación.
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const AddressModal: React.FC<AddressModalProps> = (props) => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_MAPS_API_KEY) {
    return <AddressModalContent {...props} />;
  }

  return (
    <APIProvider 
      apiKey={GOOGLE_MAPS_API_KEY} 
      libraries={['places', 'geocoding']}
    >
      <AddressModalContent {...props} />
    </APIProvider>
  );
}; 