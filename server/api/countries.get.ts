import { Country } from 'country-state-city';

export default defineEventHandler(() => {
  return Country.getAllCountries().map(c => ({
    name: c.name,
    isoCode: c.isoCode,
  }));
});
