export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role as string;

  if (!role || !['carriers', 'shippers'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'role doit être "carriers" ou "shippers"' });
  }

  // Forward query params (page, limit, search)
  const { role: _role, ...params } = query;

  return proxyToBackend(event, `/public/${role}`, { query: params as Record<string, string> });
});
