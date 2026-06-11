import { proxyRequest } from 'h3';
import { getTokenFromEvent } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;
  const token = getTokenFromEvent(event);

  if (token) {
    event.node.req.headers['authorization'] = `Bearer ${token}`;
  }

  return proxyRequest(event, `${baseUrl}/${role}/kyc`);
});
