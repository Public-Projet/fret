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

const messages_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role;
  const id = query.id;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "LID de la conversation est requis"
    });
  }
  return proxyToBackend(event, `/${role}/messaging/${id}/messages`);
});

export { messages_get as default };
//# sourceMappingURL=messages.get.mjs.map
