
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LocationSelector from '@/components/LocationSelector';
import PrayerCard from '@/components/PrayerCard';
import NextPrayer from '@/components/NextPrayer';
import { Location, LocationOption } from '@/types';
import { usePrayerTimes, getCurrentPrayer, getNextPrayer } from '@/hooks/usePrayerTimes';
import { Loader2 } from 'lucide-react';
import { predefinedLocations } from '@/data/predefinedLocations';

// Map prayer names to Arabic names
const prayerNameMap = {
  fajr: { name: 'Fajr', arabicName: 'الفجر' },
  sunrise: { name: 'Sunrise', arabicName: 'الشروق' },
  dhuhr: { name: 'Dhuhr', arabicName: 'الظهر' },
  asr: { name: 'Asr', arabicName: 'العصر' },
  maghrib: { name: 'Maghrib', arabicName: 'المغرب' },
  isha: { name: 'Isha', arabicName: 'العشاء' }
};

const Index = () => {
  // Find Constantine in predefined locations
  const constantineLocation = predefinedLocations.find(loc => loc.value === 'constantine');
  
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    constantineLocation ? constantineLocation.location : {
      city: 'Constantine',
      country: 'Algeria',
      latitude: 36.3650,
      longitude: 6.6147,
    }
  );

  const { prayerTimes, loading, error } = usePrayerTimes(selectedLocation);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string, time: string } | null>(null);

  useEffect(() => {
    if (prayerTimes) {
      setCurrentPrayer(getCurrentPrayer(prayerTimes));
      setNextPrayer(getNextPrayer(prayerTimes));
    }
  }, [prayerTimes]);

  const handleLocationChange = (location: LocationOption) => {
    setSelectedLocation(location.location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-prayer-light to-white">
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <Header />
        
        <div className="my-6">
          <LocationSelector onLocationChange={handleLocationChange} />
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-prayer animate-spin mb-4" />
            <p className="text-prayer-dark font-medium">Loading prayer times...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg my-6">
            <p className="font-medium">Error loading prayer times</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : prayerTimes ? (
          <>
            <NextPrayer nextPrayer={nextPrayer} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {Object.entries(prayerTimes)
                .filter(([key]) => key !== 'date') // Filter out the date entry
                .map(([key, value], index) => {
                  const prayerKey = key as keyof typeof prayerNameMap;
                  if (prayerNameMap[prayerKey]) {
                    const { name, arabicName } = prayerNameMap[prayerKey];
                    return (
                      <PrayerCard
                        key={key}
                        name={name}
                        arabicName={arabicName}
                        time={value}
                        isActive={currentPrayer === key}
                        index={index}
                      />
                    );
                  }
                  return null;
                })}
            </div>
            
            <div className="text-center text-prayer-dark text-sm mt-8 animate-fade-in">
              <p>Prayer times for {selectedLocation.city}, {selectedLocation.country}</p>
              <p className="mt-1">Date: {prayerTimes.date}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
