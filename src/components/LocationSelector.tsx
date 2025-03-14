
import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LocationOption } from '@/types';
import LocationList from '@/components/LocationList';
import { predefinedLocations } from '@/data/predefinedLocations';
import { useUserLocation } from '@/hooks/useUserLocation';

interface LocationSelectorProps {
  onLocationChange: (location: LocationOption) => void;
}

const LocationSelector = ({ onLocationChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  // Find Constantine in predefined locations and set as default
  const constantineLocation = predefinedLocations.find(loc => loc.value === 'constantine') || predefinedLocations[0];
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(constantineLocation);
  const { userLocation } = useUserLocation();

  useEffect(() => {
    // Only use user location if the user specifically selects it
    if (userLocation && selectedLocation.value === 'current') {
      setSelectedLocation(userLocation);
      onLocationChange(userLocation);
    } else {
      // Set Constantine as initial location and trigger change
      onLocationChange(selectedLocation);
    }
  }, [userLocation, onLocationChange, selectedLocation]);

  const handleLocationSelect = (locationValue: string) => {
    // Find the selected location from either predefined or user's current location
    let location: LocationOption;
    
    if (locationValue === 'current' && userLocation) {
      location = userLocation;
    } else {
      location = predefinedLocations.find(loc => loc.value === locationValue) || constantineLocation;
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
          <LocationList 
            locations={allLocations} 
            selectedLocation={selectedLocation} 
            onSelect={handleLocationSelect} 
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSelector;
