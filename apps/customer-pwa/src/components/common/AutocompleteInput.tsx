import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';

interface AutocompleteInputProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    label?: string;
    placeholder?: string;
    initialValue?: string;
    disabled?: boolean;
    className?: string;
    country?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    onPlaceSelect,
    label = "Search Address",
    placeholder = "Start typing your address...",
    initialValue = '',
    disabled = false,
    className,
    country = 'mx',
}) => {
    const [inputValue, setInputValue] = useState<string>(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options: google.maps.places.AutocompleteOptions = {
            fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id'],
            types: ['address'],
            componentRestrictions: country ? { country } : undefined,
        };

        const ac = new places.Autocomplete(inputRef.current, options);
        setAutocomplete(ac);

        return () => {
            if (ac) {
                google.maps.event.clearInstanceListeners(ac);
            }
        };
    }, [places, country]);

    useEffect(() => {
        if (!autocomplete) return;

        const placeChangedListener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            onPlaceSelect(place.address_components ? place : null);
            if(place.formatted_address) {
                setInputValue(place.formatted_address);
            }
        });

        return () => {
            if (placeChangedListener) {
                google.maps.event.removeListener(placeChangedListener);
            }
        };
    }, [autocomplete, onPlaceSelect]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div className={`grid gap-1.5 ${className}`}>
            {label && <Label htmlFor="autocomplete-address">{label}</Label>}
            <Input
                ref={inputRef}
                id="autocomplete-address"
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                disabled={disabled || !places}
            />
            {!places && <p className="text-xs text-muted-foreground">Loading autocomplete...</p>}
        </div>
    );
}; 