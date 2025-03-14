
import { useEffect, useState } from 'react';
import { getTimeUntilNextPrayer } from '@/hooks/usePrayerTimes';
import { Clock } from 'lucide-react';

interface NextPrayerProps {
  nextPrayer: { name: string; time: string } | null;
}

const NextPrayer = ({ nextPrayer }: NextPrayerProps) => {
  const [timeUntil, setTimeUntil] = useState('');

  useEffect(() => {
    // Initial calculation
    if (nextPrayer) {
      setTimeUntil(getTimeUntilNextPrayer(nextPrayer));
    }

    // Update countdown every minute
    const interval = setInterval(() => {
      if (nextPrayer) {
        setTimeUntil(getTimeUntilNextPrayer(nextPrayer));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [nextPrayer]);

  if (!nextPrayer) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-prayer-border shadow-sm p-5 my-6 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Clock className="h-5 w-5 text-prayer-highlight mr-2" />
        <h3 className="text-lg font-semibold text-prayer-text">Next Prayer</h3>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold text-prayer-text">{nextPrayer.name}</p>
        <p className="text-xl text-prayer-dark">in {timeUntil}</p>
      </div>
    </div>
  );
};

export default NextPrayer;
