import { d as defineEventHandler, u as useRuntimeConfig, p as proxyRequest } from '../../../nitro/nitro.mjs';
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

const _____ = defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const baseUrl = (config.apiBaseUrl || "http://localhost:1337/api/v1").replace(/\/api\/v1\/?$/, "");
  const targetUrl = `${baseUrl}${event.path}`;
  return proxyRequest(event, targetUrl);
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
