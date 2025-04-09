import { useState, useEffect } from 'react';

export const useLoadGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If Google Maps is already loaded, just set the state
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already in the process of loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      existingScript.addEventListener('error', () => 
        setError(new Error('Error loading Google Maps script'))
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    const handleScriptLoad = () => {
      setIsLoaded(true);
    };

    const handleScriptError = () => {
      setError(new Error('Error loading Google Maps script'));
    };

    script.addEventListener('load', handleScriptLoad);
    script.addEventListener('error', handleScriptError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleScriptLoad);
      script.removeEventListener('error', handleScriptError);
    };
  }, []);

  return { isLoaded, error };
}; 