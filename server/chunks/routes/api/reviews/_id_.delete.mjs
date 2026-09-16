import { d as defineEventHandler, f as getRouterParam } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return proxyToBackend(event, `/admin/reviews/${id}`, { method: "DELETE" });
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
