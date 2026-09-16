import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { Country } from 'country-state-city';
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

const countries_get = defineEventHandler(() => {
  return Country.getAllCountries().map((c) => ({
    name: c.name,
    isoCode: c.isoCode
  }));
});

export { countries_get as default };
//# sourceMappingURL=countries.get.mjs.map
