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

const uploadPhoto_post = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  return proxyBinaryToBackend(event, `/${role}/upload-photo`);
});

export { uploadPhoto_post as default };
//# sourceMappingURL=upload-photo.post.mjs.map
