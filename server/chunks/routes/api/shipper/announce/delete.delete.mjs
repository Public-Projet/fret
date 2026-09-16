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

const delete_delete = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  return proxyToBackend(event, `/shipper/announcement/${id}`, {
    method: "DELETE"
  });
});

export { delete_delete as default };
//# sourceMappingURL=delete.delete.mjs.map
