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

const resetPassword_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role, token, password } = body;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  if (!token || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le token et le nouveau mot de passe sont requis"
    });
  }
  const endpoint = role === "shipper" ? "/shipper/auth/reset-password" : "/carrier/auth/reset-password";
  return proxyToBackend(event, endpoint, {
    method: "POST",
    body: { token, password }
  });
});

export { resetPassword_post as default };
//# sourceMappingURL=reset-password.post.mjs.map
