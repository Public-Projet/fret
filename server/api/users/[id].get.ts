export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const role = query.role as string;

  if (!role || !['carriers', 'shippers'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'role doit être "carriers" ou "shippers"' });
  }

  return proxyToBackend(event, `/public/${role}/${id}`);
});
