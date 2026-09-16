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

const bookingCounter_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body == null ? void 0 : body.id;
  body == null ? true : delete body.id;
  body == null ? true : delete body.role;
  return proxyToBackend(event, `/carrier/availability/${id}/counter`, {
    method: "POST",
    body
  });
});

export { bookingCounter_post as default };
//# sourceMappingURL=booking-counter.post.mjs.map
