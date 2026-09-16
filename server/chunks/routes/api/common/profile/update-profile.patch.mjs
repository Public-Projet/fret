import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
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

const updateProfile_patch = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body == null ? void 0 : body.role;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  const { role: _role, ...profileData } = body;
  return proxyToBackend(event, `/${role}/update-profile`, {
    method: "PATCH",
    body: profileData
  });
});

export { updateProfile_patch as default };
//# sourceMappingURL=update-profile.patch.mjs.map
