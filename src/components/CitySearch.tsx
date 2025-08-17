import { useQuery } from "@tanstack/react-query";
import { type ChangeEvent, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { City } from "../helpers/types";
import CitySearchResult from "./CitySearchResult";

interface CitySearchProps {
    // callback function, when user clicks a city
    onCitySelect: (city: City) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
    // debounced/lazy seach input (default timeout = 500ms)
    const [debouncedCityQuery, setDebouncedCityQuery] = useDebounceValue(
        "",
        500,
    );
    // helper bool for hiding city search results when user selects a city
    const [displayResults, setDisplayResults] = useState(true);

    // when user types something in the <input>
    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDebouncedCityQuery(e.target.value);
        setDisplayResults(true);
    }

    // when user clicks some city
    function handleCitySelect(city: City) {
        // trim spaces from input
        setDebouncedCityQuery(debouncedCityQuery.trim());
        // hide city search results
        setDisplayResults(false);
        // callback
        onCitySelect(city);
    }

    const { data, isPending, isError } = useQuery({
        queryKey: ["cities", debouncedCityQuery],
        queryFn: async () => {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?count=8&name=${debouncedCityQuery}`,
            );

            return await res.json();
        },
        staleTime: 60_000 * 2,
        enabled: debouncedCityQuery.length > 0,
    });

    return (
        <div>
            <h2 className="mb-1 text-lg font-semibold">Search</h2>
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    className="w-full rounded-md border border-slate-700 bg-slate-800 p-2"
                    onChange={handleInputChange}
                    onFocus={handleInputChange}
                    placeholder="Search for city..."
                />
                {isError && <div>Error loading data</div>}
                {isPending && debouncedCityQuery.length > 0 && (
                    <div>Loading data</div>
                )}
                {displayResults && !isError && !isPending && !!data && (
                    <div className="overflow-clip rounded-md">
                        {!!data?.results &&
                            data.results?.length > 0 &&
                            data.results.map((city: City) => (
                                <CitySearchResult
                                    key={city.id}
                                    city={city}
                                    onClick={() => handleCitySelect(city)}
                                />
                            ))}
                        {!data?.results && debouncedCityQuery.length > 0 && (
                            <div>No results</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
