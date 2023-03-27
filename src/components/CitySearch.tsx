import { useQuery } from '@tanstack/react-query';
import { displayValue } from '@tanstack/react-query-devtools/build/lib/utils';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import CitySearchResult from './CitySearchResult';

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string;
}

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [searchCityQuery, setCitySearchQuery] = useState('');

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setCitySearchQuery(e.target.value);
  }

  const { data, isLoading, isError } = useQuery(
    ['cities', searchCityQuery.trim()],
    async () => {
      const res = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?count=5&name=${searchCityQuery.trim()}`
      );
      return res.data;
    },
    { staleTime: 60_000 * 2, enabled: searchCityQuery.trim().length > 0 }
  );

  function handleCitySelect(city: City) {
    setCitySearchQuery(searchCityQuery.trim());
    onCitySelect(city);
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        className="w-full rounded-md border border-slate-700 bg-slate-800 p-2"
        value={searchCityQuery}
        onChange={handleInputChange}
        placeholder="Vyhledejte město..."
      />

      {isError && <div>Error loading data</div>}

      {isLoading && searchCityQuery.length > 0 && <div>Loading data</div>}

      {!isError && !isLoading && !!data && (
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
  );
}
