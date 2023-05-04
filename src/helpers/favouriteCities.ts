import { City } from '../helpers/types';

export function cityIsInFavourites(city: City, favourites: City[]) {
  return favourites.some(({ id }) => id === city.id);
}

export function removeCityFromFavourites(city: City, favourites: City[]) {
  return favourites.filter(({ id }) => id !== city.id);
}
