import { useState } from 'react';
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = (): Promise<Location | null> => {
    return new Promise((resolve) => {
      setIsLoading(true);

      if (!navigator.geolocation) {
        toast.error('La geolocalización no está soportada en tu navegador');
        setIsLoading(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setIsLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error('Por favor permite el acceso a tu ubicación');
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error('La información de ubicación no está disponible');
              break;
            case error.TIMEOUT:
              toast.error('Se agotó el tiempo para obtener tu ubicación');
              break;
            default:
              toast.error('Ocurrió un error al obtener tu ubicación');
          }
          resolve(null);
        }
      );
    });
  };

  return {
    getCurrentLocation,
    isLoading
  };
} 