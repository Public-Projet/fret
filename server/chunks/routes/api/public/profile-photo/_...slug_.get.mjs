import { d as defineEventHandler, f as getRouterParam, u as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

const ____slug__get = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") || "";
  useRuntimeConfig();
  console.log(`[PhotoProxy] Catch-all slug: ${slug}`);
  const backendUrl = `/api/v1/public/profile-photo/${slug}`;
  console.log(`[PhotoProxy] Target backend path: ${backendUrl}`);
  return proxyBinaryToBackend(event, backendUrl);
});

export { ____slug__get as default };
//# sourceMappingURL=_...slug_.get.mjs.map
