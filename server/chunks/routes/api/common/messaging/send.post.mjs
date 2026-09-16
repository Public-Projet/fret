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

const send_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body == null ? void 0 : body.role;
  const id = body == null ? void 0 : body.conversationId;
  if (!role || !["shipper", "carrier"].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le r\xF4le est requis (shipper ou carrier)"
    });
  }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "LID de la conversation est requis"
    });
  }
  const { role: _role, conversationId: _id, ...messageData } = body;
  return proxyToBackend(event, `/${role}/messaging/${id}/send`, {
    method: "POST",
    body: {
      ...messageData,
      senderRole: role
    }
  });
});

export { send_post as default };
//# sourceMappingURL=send.post.mjs.map
