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

const me_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  const endpoint = role === "shipper" ? "/shipper/me" : "/carrier/me";
  return proxyToBackend(event, endpoint);
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
