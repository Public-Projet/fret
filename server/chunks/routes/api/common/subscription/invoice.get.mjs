import { d as defineEventHandler, g as getQuery, c as createError, e as getCookie } from '../../../../nitro/nitro.mjs';
import { a as proxyBinaryToBackend } from '../../../../_/api.mjs';
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

const invoice_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transaction ID is required"
    });
  }
  const token = getCookie(event, "auth_token");
  if (token) {
    event.node.req.headers["authorization"] = `Bearer ${token}`;
  }
  return proxyBinaryToBackend(event, `/subscription/transactions/${id}/invoice`, { query });
});

export { invoice_get as default };
//# sourceMappingURL=invoice.get.mjs.map
