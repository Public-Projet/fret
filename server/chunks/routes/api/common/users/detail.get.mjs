import { d as defineEventHandler, g as getQuery, c as createError } from '../../../../nitro/nitro.mjs';
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

const detail_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  const role = query.role;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID est requis" });
  }
  if (!role || !["carriers", "shippers"].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'role doit \xEAtre "carriers" ou "shippers"' });
  }
  return proxyToBackend(event, `/public/${role}/${id}`);
});

export { detail_get as default };
//# sourceMappingURL=detail.get.mjs.map
