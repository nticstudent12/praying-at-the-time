
import { useState, useEffect } from 'react';
import { PrayerTimes, Location } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function usePrayerTimes(location: Location) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.status === 'OK') {
          const timings = data.data.timings;
          
          setPrayerTimes({
            fajr: timings.Fajr,
            sunrise: timings.Sunrise,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
            date: data.data.date.readable
          });
        } else {
          throw new Error('Invalid response from prayer times API');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error fetching prayer times",
          description: errorMessage
        });
        console.error('Error fetching prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [location]);

  return { prayerTimes, loading, error };
}

export function formatTime(time: string): string {
  // Convert from 24-hour format (HH:MM) to 12-hour format with AM/PM
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function getCurrentPrayer(prayerTimes: PrayerTimes | null): string | null {
  if (!prayerTimes) return null;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const timesToCompare = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'sunrise', time: prayerTimes.sunrise },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha }
  ];
  
  // Convert all prayer times to minutes since midnight for comparison
  const prayerTimesInMinutes = timesToCompare.map(prayer => {
    const [hours, minutes] = prayer.time.split(':');
    return {
      name: prayer.name,
      minutes: parseInt(hours, 10) * 60 + parseInt(minutes, 10)
    };
  });
  
  // Sort by time
  prayerTimesInMinutes.sort((a, b) => a.minutes - b.minutes);
  
  // Find the current prayer (the latest prayer before current time)
  let currentPrayer = 'isha'; // Default to isha (last prayer of the day)
  
  for (let i = 0; i < prayerTimesInMinutes.length; i++) {
    if (currentTime < prayerTimesInMinutes[i].minutes) {
      // If we're before this prayer, the current prayer is the previous one (or isha from yesterday)
      currentPrayer = i > 0 ? prayerTimesInMinutes[i-1].name : 'isha';
      break;
    } else if (i === prayerTimesInMinutes.length - 1) {
      // If we're after the last prayer, the current prayer is the last one
      currentPrayer = prayerTimesInMinutes[i].name;
    }
  }
  
  return currentPrayer;
}

export function getNextPrayer(prayerTimes: PrayerTimes | null): { name: string, time: string } | null {
  if (!prayerTimes) return null;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayersToCheck = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha }
  ];
  
  // Convert each prayer time to minutes since midnight
  const prayerTimesInMinutes = prayersToCheck.map(prayer => {
    const [hours, minutes] = prayer.time.split(':');
    return {
      name: prayer.name,
      time: prayer.time,
      minutes: parseInt(hours, 10) * 60 + parseInt(minutes, 10)
    };
  });
  
  // Find the next prayer (first prayer after current time)
  for (const prayer of prayerTimesInMinutes) {
    if (prayer.minutes > currentTime) {
      return { name: prayer.name, time: prayer.time };
    }
  }
  
  // If no prayer is found, the next prayer is Fajr tomorrow
  return { name: 'Fajr (Tomorrow)', time: prayerTimes.fajr };
}

export function getTimeUntilNextPrayer(nextPrayer: { name: string, time: string } | null): string {
  if (!nextPrayer) return '';
  
  const now = new Date();
  const [hours, minutes] = nextPrayer.time.split(':');
  const prayerTime = new Date();
  prayerTime.setHours(parseInt(hours, 10));
  prayerTime.setMinutes(parseInt(minutes, 10));
  prayerTime.setSeconds(0);
  
  // If the prayer is tomorrow (we've passed all prayers for today)
  if (nextPrayer.name.includes('Tomorrow')) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }
  
  let diff = prayerTime.getTime() - now.getTime();
  
  // If difference is negative, add a day to get the correct time until tomorrow's prayer
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }
  
  // Convert to hours and minutes
  const hours_diff = Math.floor(diff / (1000 * 60 * 60));
  const minutes_diff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours_diff > 0) {
    return `${hours_diff}h ${minutes_diff}m`;
  } else {
    return `${minutes_diff}m`;
  }
}
