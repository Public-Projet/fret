import { d as defineEventHandler, f as getRouterParam, r as readBody } from '../../../nitro/nitro.mjs';
import { p as proxyToBackend } from '../../../_/api.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  return proxyToBackend(event, `/admin/reports/${id}`, { method: "PATCH", body });
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
