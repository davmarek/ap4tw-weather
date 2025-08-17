import { useQuery } from "@tanstack/react-query";

import { City, WeatherAPIData, WeatherHour } from "../helpers/types";
import {
    getMinMaxTemperature,
    sameDay,
    transformWeatherAPIData,
} from "../helpers/weatherData";

import AddToFavouritesButton from "./AddToFavouritesButton";
import WeatherHourColumn from "./WeatherHourColumn";

interface WeatherDetailProps {
    city: City | undefined;
}

export default function WeatherDetail({ city }: WeatherDetailProps) {
    const { data, isPending, isError } = useQuery({
        queryKey: ["weather", city?.latitude, city?.longitude],
        queryFn: async (): Promise<WeatherAPIData> => {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=${city?.latitude}&longitude=${city?.longitude}&hourly=temperature_2m,rain`,
            );
            return await res.json();
        },
        staleTime: 60_000 * 2,
        enabled: !!city,
    });

    if (!city)
        return (
            <div className="p-8 text-slate-400">
                Select city to display its weather
            </div>
        );

    if (isPending)
        return (
            <div className="animate-pulse p-8 text-slate-400">
                Loading weather data...
            </div>
        );

    if (isError)
        return (
            <div className="p-8 text-red-400">
                Error loading weather data...
            </div>
        );

    const now = new Date();

    const weather = transformWeatherAPIData(data);
    const dates = Array.from(weather.keys());

    const weatherHoursToday: WeatherHour[] = Array.from(weather.values())[0];

    const { min: weatherNowMin, max: weatherNowMax } =
        getMinMaxTemperature(weatherHoursToday);

    return (
        <div>
            {/* CURRENT WEATHER */}
            <div className="top-0 z-10 flex justify-between px-8 pb-4 pt-4 backdrop-blur-md backdrop-brightness-75 md:sticky md:pt-6">
                <div>
                    <h2 className=" text-4xl font-bold">{city.name}</h2>
                    <div>
                        {!!city.admin1 ? `${city.admin1} | ` : ""}
                        {city.country}
                    </div>
                    <div className="text-5xl font-light">
                        {`${data.current_weather.temperature}°`}
                        <span className="text-sm">{`${weatherNowMin}° | ${weatherNowMax}°`}</span>
                    </div>
                </div>
                <AddToFavouritesButton city={city} />
            </div>

            <div className="px-8 py-4">
                <h2 className="mb-1 text-lg font-bold">Forecast</h2>
                {dates.map((date, dateKey) => {
                    return (
                        <div className="mb-4" key={dateKey}>
                            <h3 className="font-semibold">
                                {new Date(date).toLocaleDateString()}
                                {sameDay(new Date(date), now) ? " (today)" : ""}
                            </h3>
                            <div className="overflow-x-auto">
                                <div className="inline-grid grid-flow-col gap-4 pb-4 pt-2">
                                    {weather.has(date) &&
                                        weather
                                            .get(date)
                                            ?.map((hourData, hourKey) => (
                                                <WeatherHourColumn
                                                    key={hourKey}
                                                    hour={hourData.hour}
                                                    temperature={
                                                        hourData.temperature
                                                    }
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
