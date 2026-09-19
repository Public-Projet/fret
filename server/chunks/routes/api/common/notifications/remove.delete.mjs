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

const remove_delete = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  const role = query.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  return proxyToBackend(event, `/${role}/notifications/${id}`, {
    method: "DELETE"
  });
});

export { remove_delete as default };
//# sourceMappingURL=remove.delete.mjs.map
