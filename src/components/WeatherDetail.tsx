import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { City } from './CitySearch';
import {
  WeatherAPIData,
  transformWeatherAPIData,
} from '../helpers/weatherData';

interface WeatherDetailProps {
  city: City | undefined;
}

function sameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export default function WeatherDetail({ city }: WeatherDetailProps) {
  const now = new Date();

  const { data, isLoading, isError } = useQuery(
    ['weather', city?.latitude, city?.longitude],
    async (): Promise<WeatherAPIData> => {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${city?.latitude}&longitude=${city?.longitude}&hourly=temperature_2m,rain`
      );
      return res.data;
    },
    { staleTime: 60_000 * 2, enabled: !!city }
  );

  if (!city)
    return (
      <div className="text-slate-400">Select city to display its weather</div>
    );

  if (isLoading)
    return (
      <div className="animate-pulse text-slate-400">
        Loading weather data...
      </div>
    );

  if (isError)
    return <div className="text-red-400">Error loading weather data...</div>;

  const temperatureUnit = data.hourly_units.temperature_2m;
  const rainUnit = data.hourly_units.rain;

  const weather = transformWeatherAPIData(data);
  const dates = Array.from(weather.keys());

  return (
    <div>
      <h2 className=" text-4xl font-bold">{city.name}</h2>
      <div className="mb-2 ">{`${city.admin1} | ${city.country}`}</div>
      <div className="mb-6">
        {dates.map((date, dateKey) => {
          return (
            <div className="mb-4" key={dateKey}>
              <h3 className="font-semibold">
                {new Date(date).toLocaleDateString()}
              </h3>
              <div className="overflow-y-scroll">
                <div className=" grid grid-flow-col gap-5 pt-2 pb-4">
                  {weather.has(date) &&
                    weather.get(date)?.map((hourData, hourKey) => (
                      <div
                        className="flex w-16 flex-col items-center"
                        key={hourKey}
                      >
                        <div>{hourData.hour}</div>
                        <div>{`${hourData.temperature}${temperatureUnit}`}</div>
                        <div>{`${hourData.rain}${rainUnit}`}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
