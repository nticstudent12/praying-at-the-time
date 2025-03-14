
import { formatTime } from '@/hooks/usePrayerTimes';
import { cn } from '@/lib/utils';

interface PrayerCardProps {
  name: string;
  arabicName: string;
  time: string;
  isActive: boolean;
  index: number;
}

const PrayerCard = ({ name, arabicName, time, isActive, index }: PrayerCardProps) => {
  return (
    <div 
      className={cn(
        "prayer-card flex flex-col items-center justify-between p-5 rounded-lg border bg-white shadow-sm",
        "hover:shadow-md transition-all duration-300",
        "animate-slide-up",
        isActive && "border-prayer-highlight bg-prayer-light ring-1 ring-prayer-dark",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-prayer-text">{name}</h3>
          <p className="text-sm text-prayer-dark font-medium">{arabicName}</p>
        </div>
        {isActive && (
          <span className="text-xs font-medium bg-prayer-highlight text-white px-2 py-1 rounded-full animate-pulse-slow">
            Current
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-prayer-text w-full text-left">
        {formatTime(time)}
      </p>
    </div>
  );
};

export default PrayerCard;
