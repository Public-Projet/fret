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

const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body == null ? void 0 : body.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  const { role: _role, ...registerData } = body;
  const endpoint = role === "shipper" ? "/shipper/auth/register" : "/carrier/auth/register";
  return proxyToBackend(event, endpoint, {
    method: "POST",
    body: registerData
  });
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
