import { d as defineEventHandler, r as readBody } from '../../nitro/nitro.mjs';
import { p as proxyToBackend } from '../../_/api.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyToBackend(event, "/public/reviews", { method: "POST", body });
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
