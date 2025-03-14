
import { useState, useEffect } from 'react';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LocationOption } from '@/types';
import { cn } from '@/lib/utils';

const predefinedLocations: LocationOption[] = [
  {
    value: 'mecca',
    label: 'Mecca, Saudi Arabia',
    location: {
      city: 'Mecca',
      country: 'Saudi Arabia',
      latitude: 21.3891,
      longitude: 39.8579,
    },
  },
  {
    value: 'medina',
    label: 'Medina, Saudi Arabia',
    location: {
      city: 'Medina',
      country: 'Saudi Arabia',
      latitude: 24.5247,
      longitude: 39.5692,
    },
  },
  {
    value: 'istanbul',
    label: 'Istanbul, Turkey',
    location: {
      city: 'Istanbul',
      country: 'Turkey',
      latitude: 41.0082,
      longitude: 28.9784,
    },
  },
  {
    value: 'cairo',
    label: 'Cairo, Egypt',
    location: {
      city: 'Cairo',
      country: 'Egypt',
      latitude: 30.0444,
      longitude: 31.2357,
    },
  },
  {
    value: 'dubai',
    label: 'Dubai, UAE',
    location: {
      city: 'Dubai',
      country: 'UAE',
      latitude: 25.2048,
      longitude: 55.2708,
    },
  },
  {
    value: 'kualalumpur',
    label: 'Kuala Lumpur, Malaysia',
    location: {
      city: 'Kuala Lumpur',
      country: 'Malaysia',
      latitude: 3.1390,
      longitude: 101.6869,
    },
  },
  {
    value: 'london',
    label: 'London, UK',
    location: {
      city: 'London',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
    },
  },
  {
    value: 'newyork',
    label: 'New York, USA',
    location: {
      city: 'New York',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
];

interface LocationSelectorProps {
  onLocationChange: (location: LocationOption) => void;
}

const LocationSelector = ({ onLocationChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(predefinedLocations[0]);
  const [userLocation, setUserLocation] = useState<LocationOption | null>(null);

  useEffect(() => {
    // Get user's current location if they allow it
    if (navigator.geolocation) {
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
              setSelectedLocation(userLocationOption);
              onLocationChange(userLocationOption);
            }
          } catch (error) {
            console.error('Error getting location details:', error);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [onLocationChange]);

  const handleLocationSelect = (locationValue: string) => {
    // Find the selected location from either predefined or user's current location
    let location: LocationOption;
    
    if (locationValue === 'current' && userLocation) {
      location = userLocation;
    } else {
      location = predefinedLocations.find(loc => loc.value === locationValue) || predefinedLocations[0];
    }
    
    setSelectedLocation(location);
    onLocationChange(location);
    setOpen(false);
  };

  const allLocations = userLocation 
    ? [userLocation, ...predefinedLocations] 
    : predefinedLocations;

  return (
    <div className="w-full max-w-md mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border border-prayer-border"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-prayer-dark" />
              <span>{selectedLocation.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search location..." />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {allLocations.map((location) => (
                  <CommandItem
                    key={location.value}
                    value={location.value}
                    onSelect={handleLocationSelect}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-prayer-dark" />
                    <span>{location.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedLocation.value === location.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSelector;
