
import { useState, useEffect } from 'react';
import { LocationOption } from '@/types';

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LocationOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location if they allow it
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Try to get city and country from coordinates using reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            
            if (response.ok) {
              const data = await response.json();
              const city = data.address.city || data.address.town || data.address.village || 'Unknown';
              const country = data.address.country || 'Unknown';
              
              const userLocationOption: LocationOption = {
                value: 'current',
                label: `${city}, ${country}`,
                location: {
                  city,
                  country,
                  latitude,
                  longitude,
                },
              };
              
              setUserLocation(userLocationOption);
            }
          } catch (error) {
            console.error('Error getting location details:', error);
            setError('Failed to get location details');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Failed to get user location');
          setLoading(false);
        }
      );
    }
  }, []);

  return { userLocation, loading, error };
}
