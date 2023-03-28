import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { City } from './CitySearch';
import {
  WeatherAPIData,
  transformWeatherAPIData,
  getMinMaxTemperature,
} from '../helpers/weatherData';
import WeatherHourColumn from './WeatherHourColumn';

interface WeatherDetailProps {
  city: City | undefined;
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
      <div className="p-8 text-slate-400">
        Select city to display its weather
      </div>
    );

  if (isLoading)
    return (
      <div className="animate-pulse p-8 text-slate-400">
        Loading weather data...
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-red-400">Error loading weather data...</div>
    );

  const weather = transformWeatherAPIData(data);
  const dates = Array.from(weather.keys());

  const weatherToday = Array.from(weather.values())[0];
  const weatherNow = weatherToday[0];

  const { min: weatherMin, max: weatherMax } =
    getMinMaxTemperature(weatherToday);

  return (
    <div>
      <div className="top-0 z-10 px-8 pt-6 pb-4 backdrop-blur-md backdrop-brightness-75 lg:sticky">
        <h2 className=" text-4xl font-bold">{city.name}</h2>
        <div>
          {!!city.admin1 ? `${city.admin1} | ` : ''}
          {city.country}
        </div>
        <div className="text-5xl font-light">
          {`${weatherNow.temperature}°`}
          <span className="text-sm">{`${weatherMin}° | ${weatherMax}°`}</span>
        </div>
      </div>

      <div className="px-8 py-4">
        {dates.map((date, dateKey) => {
          return (
            <div className="mb-4" key={dateKey}>
              <h3 className="font-semibold">
                {new Date(date).toLocaleDateString()}
              </h3>
              <div className="overflow-x-auto">
                <div className="inline-grid grid-flow-col gap-4 pt-2 pb-4">
                  {weather.has(date) &&
                    weather
                      .get(date)
                      ?.map((hourData, hourKey) => (
                        <WeatherHourColumn
                          key={hourKey}
                          hour={hourData.hour}
                          temperature={hourData.temperature}
                          rain={hourData.rain}
                        />
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
