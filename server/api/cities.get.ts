import { City } from 'country-state-city';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const countryCode = query.countryCode as string;
  if (!countryCode) {
    return [];
  }
  return City.getCitiesOfCountry(countryCode) || [];
});
