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

export {}; 