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

const updateVehicle_patch = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body == null ? void 0 : body.id;
  return proxyToBackend(event, `/carrier/vehicle/${id}`, {
    method: "PATCH",
    body
  });
});

export { updateVehicle_patch as default };
//# sourceMappingURL=update-vehicle.patch.mjs.map
