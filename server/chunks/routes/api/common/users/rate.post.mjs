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

const rate_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body == null ? void 0 : body.id;
  const role = body == null ? void 0 : body.role;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID est requis" });
  }
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: "Le r\xF4le est requis (shipper ou carrier)" });
  }
  const { role: _role, id: _id, ...ratingData } = body;
  return proxyToBackend(event, `/${role}/rate/${id}`, {
    method: "POST",
    body: ratingData
  });
});

export { rate_post as default };
//# sourceMappingURL=rate.post.mjs.map
