import { useState } from 'react';
import CitySearch from './components/CitySearch';
import { City } from './helpers/types';

import FavouriteCities from './components/FavouriteCities';
import WeatherDetail from './components/WeatherDetail';

function App() {
  const [city, setCity] = useState<City>();

  function handleCitySelect(newCity: City) {
    // if no city is selected
    if (!city) {
      setCity(newCity);
      return;
    }

    // if the selected city is already displayed (selected)
    if (
      newCity.id == city?.id &&
      newCity.latitude == city?.latitude &&
      newCity.longitude == city?.longitude
    ) {
      return;
    }

    setCity(newCity);
  }

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr] text-white md:grid-cols-3 md:grid-rows-1">
      <div className="col-span-1 flex h-full flex-col gap-4 bg-slate-900 px-4 py-6">
        <div className=" flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="favicon"
            className="h-8 w-8 overflow-clip rounded-md"
          />

          <h1>
            <span className="text-xl font-bold">Weather</span>{' '}
            <span className="text-xs">by David Marek</span>
          </h1>
        </div>

        <FavouriteCities onCitySelect={handleCitySelect} />

        <CitySearch onCitySelect={handleCitySelect} />
      </div>

      <div className="col-span1 h-full bg-gradient-to-br from-slate-800 to-slate-900 md:col-span-2 md:overflow-y-scroll">
        <WeatherDetail city={city} />
      </div>
    </div>
  );
}

export default App;
