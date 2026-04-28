import { proxyRequest, getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path as string;

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    });
  }

  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;
  const token = getCookie(event, 'auth_token');

  if (token) {
    event.node.req.headers['authorization'] = `Bearer ${token}`;
  }

  const url = `${baseUrl}${path}`;
  return proxyRequest(event, url);
});
