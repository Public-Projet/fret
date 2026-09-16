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

const forgotPassword_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role, email } = body;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'adresse email est requise"
    });
  }
  const endpoint = role === "shipper" ? "/shipper/auth/forgot-password" : "/carrier/auth/forgot-password";
  return proxyToBackend(event, endpoint, {
    method: "POST",
    body: { email }
  });
});

export { forgotPassword_post as default };
//# sourceMappingURL=forgot-password.post.mjs.map
