import { useEffect, useRef, useState } from 'react';
import { Input } from '@repo/ui';
import { useGoogleMapsScript } from '@repo/hooks';

interface AutocompleteInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  onPlaceSelected,
  placeholder = 'Ingresa una dirección',
  disabled = false,
  className = '',
  label,
}: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [internalValue, setInternalValue] = useState(value || '');
  const { isLoaded, loadError } = useGoogleMapsScript();

  // Sincronizar el valor interno con el valor externo
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  // Inicializar el Autocomplete cuando Google Maps esté cargado
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps) {
      return;
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
        componentRestrictions: { country: 'mx' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place) {
          onPlaceSelected?.(place);
          setInternalValue(place.formatted_address || '');
          onChange?.(place.formatted_address || '');
        }
      });

      autocompleteRef.current = autocomplete;

      return () => {
        if (window.google?.maps) {
          window.google.maps.event.clearInstanceListeners(autocomplete);
          autocompleteRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
    }
  }, [isLoaded, onPlaceSelected, onChange]);

  const getPlaceholder = () => {
    if (loadError) return 'Error al cargar Google Maps';
    if (!isLoaded) return 'Cargando...';
    return placeholder;
  };

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setInternalValue(newValue);
          onChange?.(newValue);
        }}
        placeholder={getPlaceholder()}
        disabled={disabled || !isLoaded || !!loadError}
        className={`w-full ${className}`}
      />
    </div>
  );
}

export default AutocompleteInput; 