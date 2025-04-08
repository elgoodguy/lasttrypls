import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

export interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  isGoogleMapsLoaded: boolean;
  initialValue?: string;
  label?: string;
}

const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ onPlaceSelect, isGoogleMapsLoaded, initialValue = '', disabled, label, className, ...props }, ref) => {
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
      <div className="grid gap-1.5">
        {label && <Label>{label}</Label>}
        <Input
          ref={inputRef}
          type="text"
          className={className}
          placeholder={disabled || !isGoogleMapsLoaded ? "Cargando Google Maps..." : props.placeholder || "Empieza a escribir una dirección"}
          disabled={disabled || !isGoogleMapsLoaded}
          defaultValue={initialValue}
          {...props}
        />
      </div>
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput; 