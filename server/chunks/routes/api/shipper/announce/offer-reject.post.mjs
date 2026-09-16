import { d as defineEventHandler, f as getRouterParam } from '../../../../nitro/nitro.mjs';
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

const offerReject_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return proxyToBackend(event, `/shipper/announcement/${id}/reject`, {
    method: "POST"
  });
});

export { offerReject_post as default };
//# sourceMappingURL=offer-reject.post.mjs.map
