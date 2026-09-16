import { d as defineEventHandler, g as getQuery, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { a as proxyBinaryToBackend } from '../../../_/api.mjs';
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

const profilePhoto_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  useRuntimeConfig();
  const role = query.role;
  const userId = query.userId;
  const filename = query.filename;
  console.log(`[PhotoProxy] Serving query: role=${role}, userId=${userId}, filename=${filename}`);
  return proxyBinaryToBackend(event, "/public/profile-photo", { query });
});

export { profilePhoto_get as default };
//# sourceMappingURL=profile-photo.get.mjs.map
