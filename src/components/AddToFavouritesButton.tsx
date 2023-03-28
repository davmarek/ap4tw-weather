import {
  cityIsInFavourites,
  removeCityFromFavourites,
} from '../helpers/favouriteCities';
import { City } from '../helpers/types';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useLocalStorage } from 'usehooks-ts';
import toast from 'react-hot-toast';

interface AddToFavouritesButtonProps {
  city: City;
}
export default function AddToFavouritesButton({
  city,
}: AddToFavouritesButtonProps) {
  const [favouriteCities, setFavouriteCities] = useLocalStorage<City[]>(
    'favouriteCities',
    []
  );

  function handleAddToFavourite() {
    if (!city) {
      toast.error('Select city first');
      return;
    }

    if (cityIsInFavourites(city, favouriteCities)) {
      toast.error(`${city.name} is already in your favourites`);
      return;
    }

    setFavouriteCities([...favouriteCities, city]);
    toast.success(`Added to favourites`);
  }

  function handleRemoveFromFavourite() {
    if (!city) {
      toast.error('Select city first');
      return;
    }

    if (!cityIsInFavourites(city, favouriteCities)) {
      toast.error(`${city.name} isn't in your favourites`);
      return;
    }

    setFavouriteCities(removeCityFromFavourites(city, favouriteCities));
    toast.success(`Removed from favourites`, { icon: '🔥' });
  }

  return (
    <div className="cursor-pointer">
      {cityIsInFavourites(city, favouriteCities) ? (
        <StarIconSolid
          className="h-6 w-6 text-yellow-300"
          onClick={handleRemoveFromFavourite}
        />
      ) : (
        <StarIconOutline
          className="h-6 w-6 text-yellow-500"
          onClick={handleAddToFavourite}
        />
      )}
    </div>
  );
}
