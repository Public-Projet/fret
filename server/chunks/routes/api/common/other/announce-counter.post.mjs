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

const announceCounter_post = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  const body = await readBody(event);
  const role = (body == null ? void 0 : body.role) || "shipper";
  body == null ? true : delete body.role;
  const endpoint = role === "shipper" ? `/shipper/announcement/${id}/counter` : `/carrier/announcement/${id}/counter`;
  return proxyToBackend(event, endpoint, {
    method: "POST",
    body
  });
});

export { announceCounter_post as default };
//# sourceMappingURL=announce-counter.post.mjs.map
