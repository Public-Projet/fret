import { proxyBinaryToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path as string;

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    });
  }

  return proxyBinaryToBackend(event, path);
});
