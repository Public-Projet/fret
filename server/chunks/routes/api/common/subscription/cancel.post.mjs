import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
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

const cancel_post = defineEventHandler(async (event) => {
  return proxyToBackend(event, "/subscription/cancel", {
    method: "POST"
  });
});

export { cancel_post as default };
//# sourceMappingURL=cancel.post.mjs.map
