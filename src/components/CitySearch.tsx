import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { City } from '../helpers/types';
import CitySearchResult from './CitySearchResult';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [searchCityQuery, setCitySearchQuery] = useState('');
  const [displayResults, setDisplayResults] = useState(true);

  // when user types something in the <input>
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setCitySearchQuery(e.target.value);
    setDisplayResults(true);
  }

  // when user clicks some city
  function handleCitySelect(city: City) {
    setCitySearchQuery(searchCityQuery.trim());
    setDisplayResults(false);
    onCitySelect(city);
  }

  const { data, isLoading, isError } = useQuery(
    ['cities', searchCityQuery.trim()],
    async () => {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?count=8&name=${searchCityQuery.trim()}`
      );

      return await res.json();
    },
    { staleTime: 60_000 * 2, enabled: searchCityQuery.trim().length > 0 }
  );

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold">Search</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="w-full rounded-md border border-slate-700 bg-slate-800 p-2"
          value={searchCityQuery}
          onChange={handleInputChange}
          onFocus={handleInputChange}
          placeholder="Search for city..."
        />
        {isError && <div>Error loading data</div>}
        {isLoading && searchCityQuery.length > 0 && <div>Loading data</div>}
        {displayResults && !isError && !isLoading && !!data && (
          <div className="overflow-clip rounded-md">
            {!!data?.results &&
              data.results?.length > 0 &&
              data.results.map((city: City, key: number) => (
                <CitySearchResult
                  key={key}
                  city={city}
                  onClick={() => handleCitySelect(city)}
                />
              ))}
            {!data?.results && searchCityQuery.length > 0 && (
              <div>No results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
