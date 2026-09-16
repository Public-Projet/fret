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

const offerAccept_post = defineEventHandler(async (event) => {
  const { offerId } = await readBody(event);
  return proxyToBackend(event, `/shipper/announcement/${offerId}/accept`, {
    method: "POST"
  });
});

export { offerAccept_post as default };
//# sourceMappingURL=offer-accept.post.mjs.map
