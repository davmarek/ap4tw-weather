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
}

interface HourlyUnits {
  time: string;
  temperature_2m: string;
  rain: string;
}

interface Hourly {
  time: string[];
  temperature_2m: number[];
  rain: number[];
}

interface WeatherHour {
  hour: string;
  temperature: number;
  rain: number;
}

export function transformWeatherAPIData(
  data: WeatherAPIData
): Map<string, WeatherHour[]> {
  const now = new Date();

  const weather = new Map<string, WeatherHour[]>();

  const dates = data.hourly.time.filter((_, key) => key % 24 == 0);

  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);

    // endDate = start of the next day
    // example: date = 1.4.2023 00:00 -> endDate = 2.4.2023 00:00
    const endDate = new Date(date.valueOf() + 86_400_000);

    // if the end of this day isnt behind now
    // example:
    // now = 1.1.2023 23:59
    // endDate = 2.1.2023 00:00
    // this should include this date
    if (endDate < now) continue;

    const hours: WeatherHour[] = [];

    for (let j = i * 24; j < i * 24 + 24; j++) {
      const hourDate = new Date(data.hourly.time[j]);
      // the hour data (+ 1 hour) is in the past
      if (hourDate.valueOf() + 3_600_000 < now.valueOf()) continue;

      hours.push({
        hour: hourDate.getHours().toString(),
        temperature: data.hourly.temperature_2m[j],
        rain: data.hourly.rain[j],
      });
    }

    weather.set(dates[i], hours);
  }

  return weather;
}
