import { d as defineEventHandler, g as getQuery } from '../../../../nitro/nitro.mjs';
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

const verify_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  return proxyToBackend(event, "/subscription/verify", {
    method: "GET",
    query
  });
});

export { verify_get as default };
//# sourceMappingURL=verify.get.mjs.map
