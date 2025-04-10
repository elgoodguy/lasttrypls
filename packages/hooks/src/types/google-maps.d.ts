declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: any) => any;
          AutocompleteService: any;
          PlacesService: new (attributionNode: Element) => any;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
          removeListener: (listener: any) => void;
        };
        Geocoder: new () => any;
      };
    };
    initMap?: () => void;
  }
}

export interface GoogleMapsGeocoderAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleMapsPlaceResult {
  address_components?: GoogleMapsGeocoderAddressComponent[];
  formatted_address?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id?: string;
  name?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PlaceResult {
  street_address: string;
  city: string;
  neighborhood: string | null;
  postal_code: string;
  latitude: number;
  longitude: number;
  google_place_id: string;
} 