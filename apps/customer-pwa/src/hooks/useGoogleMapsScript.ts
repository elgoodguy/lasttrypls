import { useEffect, useState } from 'react';

interface GoogleMapsScriptState {
  isLoaded: boolean;
  loadError: Error | null;
}

// Agregar tipos globales para TypeScript
declare global {
  interface Window {
    google: any;
  }
}

let scriptPromise: Promise<void> | null = null;

export function useGoogleMapsScript() {
  const [state, setState] = useState<GoogleMapsScriptState>({
    isLoaded: false,
    loadError: null,
  });

  useEffect(() => {
    // Si ya está cargado o hay un error, no hacer nada
    if (window.google?.maps || state.loadError) {
      setState(prev => ({ ...prev, isLoaded: !!window.google?.maps }));
      return;
    }

    // Si ya existe una promesa de carga, esperar a que se resuelva
    if (scriptPromise) {
      scriptPromise
        .then(() => setState({ isLoaded: true, loadError: null }))
        .catch(error => setState({ isLoaded: false, loadError: error }));
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setState({
        isLoaded: false,
        loadError: new Error('Google Maps API key not found'),
      });
      return;
    }

    // Crear una nueva promesa para cargar el script
    scriptPromise = new Promise((resolve, reject) => {
      // Si ya existe el script, resolver inmediatamente
      if (document.getElementById('google-maps-script')) {
        resolve();
        return;
      }

      // Crear y cargar el script
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
        const error = new Error('Failed to load Google Maps script');
        setState({ isLoaded: false, loadError: error });
        scriptPromise = null;
        reject(error);
      };

      document.head.appendChild(script);
    });

    return () => {
      // No eliminamos el script al desmontar para evitar recargas innecesarias
    };
  }, [state.loadError]);

  return state;
} 