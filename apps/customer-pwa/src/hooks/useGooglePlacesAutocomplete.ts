import { useState } from 'react';
import { toast } from 'sonner';

interface Prediction {
  place_id: string;
  description: string;
}

interface PlaceResult {
  street_address: string;
  city: string;
  neighborhood: string | null;
  postal_code: string;
  latitude: number;
  longitude: number;
  google_place_id: string;
}

// Define Google Maps types in a namespace
declare namespace google.maps {
  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  namespace places {
    class AutocompleteService {
      getPlacePredictions(request: {
        input: string;
        componentRestrictions: { country: string };
        types: string[];
      }): Promise<{
        predictions: Array<{
          place_id: string;
          description: string;
        }>;
      }>;
    }

    class PlacesService {
      constructor(attributionNode: Element);
      getDetails(
        request: {
          placeId: string;
          fields: string[];
        },
        callback: (
          place: PlaceResult | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    type PlacesServiceStatus = string;

    interface PlaceResult {
      formatted_address?: string;
      address_components?: Array<{
        long_name: string;
        short_name: string;
        types: string[];
      }>;
      geometry?: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
    }
  }

  class Geocoder {
    geocode(request: {
      location: { lat: number; lng: number };
    }): Promise<GeocoderResponse>;
  }

  interface GeocoderResponse {
    results: Array<{
      formatted_address: string;
      address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
      }>;
    }>;
  }
}

const getAddressComponent = (
  components: google.maps.places.PlaceResult['address_components'] = [],
  type: string
): string => {
  const component = components?.find((c) => c.types.includes(type));
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
        response.predictions.map((prediction) => ({
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

  const getPlaceDetails = (
    placeId: string
  ): Promise<PlaceResult | null> => {
    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded');
      return Promise.reject(new Error('Google Maps Places API not loaded'));
    }

    return new Promise((resolve, reject) => {
      const placesService = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      placesService.getDetails(
        {
          placeId,
          fields: [
            'formatted_address',
            'address_components',
            'geometry',
          ],
        },
        (place, status) => {
          if (
            status === 'OK' &&
            place?.address_components &&
            place.geometry?.location
          ) {
            const result: PlaceResult = {
              street_address: getAddressComponent(
                place.address_components,
                'route'
              ),
              city: getAddressComponent(
                place.address_components,
                'locality'
              ),
              neighborhood: getAddressComponent(
                place.address_components,
                'sublocality'
              ),
              postal_code: getAddressComponent(
                place.address_components,
                'postal_code'
              ),
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