import { d as defineEventHandler, g as getQuery, c as createError } from '../../../../nitro/nitro.mjs';
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

const kycDownload_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path;
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "Path is required"
    });
  }
  return proxyBinaryToBackend(event, path);
});

export { kycDownload_get as default };
//# sourceMappingURL=kyc-download.get.mjs.map
