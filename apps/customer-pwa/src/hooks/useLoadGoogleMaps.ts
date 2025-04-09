import { useState, useEffect } from 'react';

export const useLoadGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Temporary debug log
    console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Loaded' : 'Not loaded');
    
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
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