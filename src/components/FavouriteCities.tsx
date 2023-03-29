import { useLocalStorage } from 'usehooks-ts';
import { removeCityFromFavourites } from '../helpers/favouriteCities';
import { City } from '../helpers/types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface FavouriteCitiesProps {
  onCitySelect: (city: City) => void;
}

export default function FavouriteCities({
  onCitySelect,
}: FavouriteCitiesProps) {
  const [favouriteCities, setFavouriteCities] = useLocalStorage<City[]>(
    'favouriteCities',
    []
  );

  function handleCitySelect(city: City) {
    onCitySelect(city);
  }

  function handleCityRemove(city: City) {
    if (
      confirm(`Do you really want to remove ${city?.name} from favourites?`)
    ) {
      setFavouriteCities(removeCityFromFavourites(city, favouriteCities));
    }
  }

  if (favouriteCities.length <= 0) return null;

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold">Favourite Cities</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
        {favouriteCities.map((city, key) => (
          <div
            key={key}
            className="group grid cursor-pointer grid-cols-[1fr_auto] overflow-clip rounded-md bg-slate-800 transition-colors"
          >
            <h3
              className="flex w-full items-center px-4 py-3 hover:bg-slate-700"
              onClick={() => handleCitySelect(city)}
            >
              {city.name}
            </h3>
            <div
              className="flex items-center p-3 text-slate-600 hover:bg-slate-700 hover:text-red-700 md:invisible md:group-hover:visible"
              onClick={() => handleCityRemove(city)}
            >
              <TrashIcon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
