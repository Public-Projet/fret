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

const list_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const queryString = new URLSearchParams(query).toString();
  const path = `/public/announcements${queryString ? `?${queryString}` : ""}`;
  return proxyToBackend(event, path);
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
