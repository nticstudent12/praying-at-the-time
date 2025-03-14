
export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LocationOption {
  value: string;
  label: string;
  location: Location;
}
