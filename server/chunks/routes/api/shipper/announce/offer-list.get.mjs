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

const offerList_get = defineEventHandler(async (event) => {
  const { announcementId } = getQuery(event);
  return proxyToBackend(event, `/shipper/announcement/${announcementId}/offers`);
});

export { offerList_get as default };
//# sourceMappingURL=offer-list.get.mjs.map
