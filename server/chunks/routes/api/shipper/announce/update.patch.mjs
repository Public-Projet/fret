import { d as defineEventHandler, g as getQuery, r as readBody } from '../../../../nitro/nitro.mjs';
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

const update_patch = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  const body = await readBody(event);
  return proxyToBackend(event, `/shipper/announcement/${id}`, {
    method: "PATCH",
    body
  });
});

export { update_patch as default };
//# sourceMappingURL=update.patch.mjs.map
