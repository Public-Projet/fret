import { proxyToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction ID is required',
    });
  }

  return proxyToBackend(event, `/subscription/transactions/${id}/invoice`);
});
