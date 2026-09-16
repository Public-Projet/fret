import { d as defineEventHandler, g as getQuery } from '../../nitro/nitro.mjs';
import { City } from 'country-state-city';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import 'consola';
import 'node:url';

const cities_get = defineEventHandler((event) => {
  const query = getQuery(event);
  const countryCode = query.countryCode;
  if (!countryCode) {
    return [];
  }
  return City.getCitiesOfCountry(countryCode) || [];
});

export { cities_get as default };
//# sourceMappingURL=cities.get.mjs.map
