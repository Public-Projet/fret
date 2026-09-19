import { d as defineEventHandler, r as readBody } from '../../../../nitro/nitro.mjs';
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

const bookingReject_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body == null ? void 0 : body.id;
  return proxyToBackend(event, `/carrier/availability/${id}/reject`, {
    method: "POST"
  });
});

export { bookingReject_post as default };
//# sourceMappingURL=booking-reject.post.mjs.map
