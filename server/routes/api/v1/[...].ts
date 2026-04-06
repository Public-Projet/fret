import { proxyRequest, defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);

  const baseUrl = (config.apiBaseUrl || 'http://localhost:1337/api/v1').replace(/\/api\/v1\/?$/, '');

  const targetUrl = `${baseUrl}${event.path}`;

  return proxyRequest(event, targetUrl);
});
