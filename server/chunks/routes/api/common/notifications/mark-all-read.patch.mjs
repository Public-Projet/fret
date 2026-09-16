import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
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

const markAllRead_patch = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body == null ? void 0 : body.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  return proxyToBackend(event, `/${role}/notifications/mark-all-read`, {
    method: "PATCH"
  });
});

export { markAllRead_patch as default };
//# sourceMappingURL=mark-all-read.patch.mjs.map
