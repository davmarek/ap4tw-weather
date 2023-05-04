import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { City } from '../helpers/types';
import CitySearchResult from './CitySearchResult';

interface CitySearchProps {
  // callback function, when user clicks a city
  onCitySelect: (city: City) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  // realtime search input
  const [searchCityQuery, setCitySearchQuery] = useState('');
  // debounced/lazy seach input (default timeout = 500ms)
  const debouncedSearchCityQuery = useDebounce(searchCityQuery.trim());
  // helper bool for hiding city search results when user selects a city
  const [displayResults, setDisplayResults] = useState(true);

  // when user types something in the <input>
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setCitySearchQuery(e.target.value);
    setDisplayResults(true);
  }

  // when user clicks some city
  function handleCitySelect(city: City) {
    // trim spaces from input
    setCitySearchQuery(searchCityQuery.trim());
    // hide city search results
    setDisplayResults(false);
    // callback
    onCitySelect(city);
  }

  const { data, isLoading, isError } = useQuery(
    ['cities', debouncedSearchCityQuery],
    async () => {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?count=8&name=${debouncedSearchCityQuery}`
      );

      return await res.json();
    },
    { staleTime: 60_000 * 2, enabled: debouncedSearchCityQuery.length > 0 }
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
        {isLoading && debouncedSearchCityQuery.length > 0 && (
          <div>Loading data</div>
        )}
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
            {!data?.results && debouncedSearchCityQuery.length > 0 && (
              <div>No results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
