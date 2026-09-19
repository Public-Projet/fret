import { d as defineEventHandler, g as getQuery, c as createError } from '../../../../nitro/nitro.mjs';
import { a as proxyBinaryToBackend } from '../../../../_/api.mjs';
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

const contractFile_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filename = query.filename;
  if (!filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le nom du contrat est requis"
    });
  }
  const filenameStr = filename.split("/").pop() || filename;
  return proxyBinaryToBackend(event, `/public/contracts/download/${encodeURIComponent(filenameStr)}`);
});

export { contractFile_get as default };
//# sourceMappingURL=contract-file.get.mjs.map
