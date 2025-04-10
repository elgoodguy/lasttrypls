import { useEffect, useState } from 'react';

interface GoogleMapsScriptState {
  isLoaded: boolean;
  loadError: Error | null;
}

let scriptPromise: Promise<void> | null = null;

export function useGoogleMapsScript() {
  const [state, setState] = useState<GoogleMapsScriptState>({
    isLoaded: false,
    loadError: null,
  });

  useEffect(() => {
    // If already loaded or there's an error, do nothing
    if (window.google?.maps || state.loadError) {
      setState(prev => ({ ...prev, isLoaded: !!window.google?.maps }));
      return;
    }

    // If there's already a loading promise, wait for it to resolve
    if (scriptPromise) {
      scriptPromise
        .then(() => setState({ isLoaded: true, loadError: null }))
        .catch(error => setState({ isLoaded: false, loadError: error }));
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key not found. Please check your environment variables.');
      setState({
        isLoaded: false,
        loadError: new Error('No se encontró la clave de API de Google Maps. Por favor, contacta al soporte.'),
      });
      return;
    }

    // Create a new promise to load the script
    scriptPromise = new Promise((resolve, reject) => {
      try {
        // If script already exists, resolve immediately
        if (document.getElementById('google-maps-script')) {
          resolve();
          return;
        }

        // Create and load the script
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
        script.async = true;
        script.setAttribute('loading', 'async');

        script.onload = () => {
          setState({ isLoaded: true, loadError: null });
          resolve();
        };

        script.onerror = () => {
          const error = new Error('Error al cargar Google Maps. Por favor, intenta de nuevo más tarde.');
          setState({ isLoaded: false, loadError: error });
          scriptPromise = null;
          reject(error);
        };

        document.head.appendChild(script);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido al cargar Google Maps');
        setState({ isLoaded: false, loadError: err });
        scriptPromise = null;
        reject(err);
      }
    });

    return () => {
      // Don't remove the script on unmount to avoid unnecessary reloads
    };
  }, [state.loadError]);

  return state;
} 