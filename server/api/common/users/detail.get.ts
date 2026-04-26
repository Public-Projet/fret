import { proxyToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  const role = query.role as string;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID est requis' });
  }

  if (!role || !['carriers', 'shippers'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'role doit être "carriers" ou "shippers"' });
  }

  return proxyToBackend(event, `/public/${role}/${id}`);
});
