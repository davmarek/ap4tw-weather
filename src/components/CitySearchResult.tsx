import { City } from './CitySearch';

interface CitySearchResultProps {
  city: City;
  onClick?: () => void;
}

export default function CitySearchResult({
  city: { name, country, admin1 },
  onClick,
}: CitySearchResultProps) {
  return (
    <div
      className="cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-3  hover:from-slate-700 hover:to-slate-800"
      onClick={onClick}
    >
      <div className="font-bold">{name}</div>
      <div className="text-sm">{`${admin1} | ${country}`}</div>
      <div className="grid grid-cols-3 "></div>
    </div>
  );
}
