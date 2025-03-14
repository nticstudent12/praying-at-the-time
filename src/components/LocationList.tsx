
import { Check, MapPin } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { LocationOption } from '@/types';
import { cn } from '@/lib/utils';

interface LocationListProps {
  locations: LocationOption[];
  selectedLocation: LocationOption;
  onSelect: (locationValue: string) => void;
}

const LocationList = ({ locations, selectedLocation, onSelect }: LocationListProps) => {
  return (
    <Command>
      <CommandInput placeholder="Search location..." />
      <CommandList>
        <CommandEmpty>No location found.</CommandEmpty>
        <CommandGroup>
          {locations.map((location) => (
            <CommandItem
              key={location.value}
              value={location.value}
              onSelect={onSelect}
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
  );
};

export default LocationList;
