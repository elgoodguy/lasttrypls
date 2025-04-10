import { useState } from 'react';
import { toast } from 'sonner';
import { PlaceResult } from './types/google-maps';

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

export const useGooglePlacesAutocomplete = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchPlaces = async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }

    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return;
    }

    try {
      setIsLoading(true);
      const service = new google.maps.places.AutocompleteService();
      const response = await service.getPlacePredictions({
        input,
        componentRestrictions: { country: 'MX' },
        types: ['address'],
      });

      setPredictions(
        response.predictions.map(prediction => ({
          place_id: prediction.place_id,
          description: prediction.description,
        }))
      );
    } catch (error) {
      console.error('Error searching places:', error);
      toast.error('Error al buscar lugares');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = (placeId: string): Promise<PlaceResult | null> => {
    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return Promise.reject(new Error('Google Maps Places API not loaded'));
    }

    return new Promise((resolve, reject) => {
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));

      placesService.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'address_components', 'geometry'],
        },
        (place, status) => {
          if (status === 'OK' && place?.address_components && place.geometry?.location) {
            const result: PlaceResult = {
              street_address: getAddressComponent(place.address_components, 'route'),
              city: getAddressComponent(place.address_components, 'locality'),
              neighborhood: getAddressComponent(place.address_components, 'sublocality'),
              postal_code: getAddressComponent(place.address_components, 'postal_code'),
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              google_place_id: placeId,
            };
            resolve(result);
          } else {
            reject(new Error('Error al obtener los detalles del lugar'));
          }
        }
      );
    });
  };

  return {
    predictions,
    isLoading,
    searchPlaces,
    getPlaceDetails,
  };
};
