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

const createOffer_post = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  const body = await readBody(event);
  return proxyToBackend(event, `/carrier/announcement/${id}/offer`, {
    method: "POST",
    body
  });
});

export { createOffer_post as default };
//# sourceMappingURL=create-offer.post.mjs.map
