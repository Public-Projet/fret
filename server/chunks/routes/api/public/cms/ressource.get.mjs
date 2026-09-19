import { d as defineEventHandler, g as getQuery, c as createError } from '../../../../nitro/nitro.mjs';
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

const ressource_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const resource = query.resource;
  if (!resource) {
    throw createError({ statusCode: 400, statusMessage: "Resource parameter is required" });
  }
  const allowed = ["partners", "testimonials", "team", "faq-category", "faq", "safety", "help", "social-links"];
  if (!allowed.includes(resource)) {
    throw createError({ statusCode: 400, statusMessage: `Resource '${resource}' non autoris\xE9e` });
  }
  return proxyToBackend(event, `/public/cms/${resource}`);
});

export { ressource_get as default };
//# sourceMappingURL=ressource.get.mjs.map
