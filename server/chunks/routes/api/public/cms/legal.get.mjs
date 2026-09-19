import { d as defineEventHandler, g as getQuery } from '../../../../nitro/nitro.mjs';
import { p as proxyToBackend } from '../../../../_/api.mjs';
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
import 'crypto';

const legal_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = query.slug;
  return proxyToBackend(event, `/public/cms/legal/${slug}`);
});

export { legal_get as default };
//# sourceMappingURL=legal.get.mjs.map
