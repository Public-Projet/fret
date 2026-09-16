import { d as defineEventHandler, g as getQuery, c as createError, p as proxyRequest, u as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
import { g as getTokenFromEvent } from '../../../../_/api.mjs';
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

const KycUpload_post = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl;
  const token = getTokenFromEvent(event);
  if (token) {
    event.node.req.headers["authorization"] = `Bearer ${token}`;
  }
  return proxyRequest(event, `${baseUrl}/${role}/kyc`);
});

export { KycUpload_post as default };
//# sourceMappingURL=Kyc-upload.post.mjs.map
