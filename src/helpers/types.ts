// main type of the data that the app works with
export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string | undefined;
}

// structure of the data that is fetched
export interface WeatherAPIData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
  current_weather: CurrentWeather;
}
// helper for WeatherAPIData
interface HourlyUnits {
  time: string;
  temperature_2m: string;
  rain: string;
}
// helper for WeatherAPIData
interface Hourly {
  time: string[];
  temperature_2m: number[];
  rain: number[];
}
// helper for WeatherAPIData
interface CurrentWeather {
  temperature: number;
  time: string;
}

// used when displaying row of all the temperatures
export interface WeatherHour {
  hour: string;
  temperature: number;
  rain: number;
}
