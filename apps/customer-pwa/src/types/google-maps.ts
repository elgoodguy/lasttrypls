/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: any) => any;
          AutocompleteService: any;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
          removeListener: (listener: any) => void;
        };
      };
    };
    initMap?: () => void;
  }
}

export interface GoogleMapsPlaceResult extends google.maps.places.PlaceResult {
  address_components?: google.maps.GeocoderAddressComponent[];
  formatted_address?: string;
  geometry?: {
    location: google.maps.LatLng;
    viewport?: google.maps.LatLngBounds;
  };
  place_id?: string;
  types?: string[];
}

// This is needed to make the file a module
export {}; 