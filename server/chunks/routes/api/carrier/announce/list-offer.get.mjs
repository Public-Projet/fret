import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
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

const listOffer_get = defineEventHandler(async (event) => {
  return proxyToBackend(event, "/carrier/announcement");
});

export { listOffer_get as default };
//# sourceMappingURL=list-offer.get.mjs.map
