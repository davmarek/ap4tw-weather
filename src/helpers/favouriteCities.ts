import { City } from '../helpers/types';

export function cityIsInFavourites(city: City, favourites: City[]) {
  for (let i = 0; i < favourites.length; i++) {
    if (city.id == favourites[i].id) {
      return true;
    }
  }
  return false;
}

export function removeCityFromFavourites(city: City, favourites: City[]) {
  let newFavourites: City[] = [];
  for (let i = 0; i < favourites.length; i++) {
    if (city.id != favourites[i].id) {
      newFavourites.push(favourites[i]);
    }
  }
  return newFavourites;
}
