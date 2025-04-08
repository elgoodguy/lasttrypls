import React, { useEffect, useRef, useState } from 'react';

export interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  isGoogleMapsLoaded: boolean;
  initialValue?: string;
}

const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ onPlaceSelect, isGoogleMapsLoaded, initialValue = '', disabled, ...props }, ref) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (!isGoogleMapsLoaded || !inputRef.current) return;

      try {
        const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'mx' }
        });

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          onPlaceSelect(place);
        });

        setAutocomplete(autocompleteInstance);

        return () => {
          google.maps.event.clearInstanceListeners(autocompleteInstance);
        };
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    }, [isGoogleMapsLoaded, onPlaceSelect]);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!, []);

    return (
      <input
        ref={inputRef}
        type="text"
        className="w-full p-2 border rounded"
        placeholder={disabled || !isGoogleMapsLoaded ? "Loading Google Maps..." : "Start typing an address"}
        disabled={disabled || !isGoogleMapsLoaded}
        defaultValue={initialValue}
        {...props}
      />
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput; 