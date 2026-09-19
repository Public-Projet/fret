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

const checkout_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.plan) || !(body == null ? void 0 : body.billing)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le plan et le cycle de facturation sont requis."
    });
  }
  return proxyToBackend(event, "/subscription/checkout", {
    method: "POST",
    body
  });
});

export { checkout_post as default };
//# sourceMappingURL=checkout.post.mjs.map
