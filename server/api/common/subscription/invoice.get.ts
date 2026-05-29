import { proxyBinaryToBackend } from '~/server/utils/api';
import { getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction ID is required',
    });
  }

  const token = getCookie(event, 'auth_token');
  if (token) {
    event.node.req.headers['authorization'] = `Bearer ${token}`;
  }

  return proxyBinaryToBackend(event, `/subscription/transactions/${id}/invoice`, { query });
});
