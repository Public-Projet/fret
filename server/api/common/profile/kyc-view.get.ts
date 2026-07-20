import { proxyBinaryToBackend } from '~/server/utils/api';
import { setResponseHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path as string;

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    });
  }

  // Force inline display for browser preview
  setResponseHeader(event, 'Content-Disposition', 'inline; filename="preview"');

  return proxyBinaryToBackend(event, path);
});

