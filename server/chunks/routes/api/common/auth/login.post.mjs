import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { p as proxyToBackend, e as encryptToken } from '../../../../_/api.mjs';
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

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body == null ? void 0 : body.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  const { role: _role, ...loginData } = body;
  const endpoint = role === "shipper" ? "/shipper/auth/login" : "/carrier/auth/login";
  const response = await proxyToBackend(event, endpoint, {
    method: "POST",
    body: loginData
  });
  return {
    ...response,
    token: encryptToken(response.token)
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
