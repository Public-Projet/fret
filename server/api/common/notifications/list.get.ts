export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  const page = query.page || '1';
  const limit = query.limit || '20';
  const endpoint = `/${role}/notifications?page=${page}&limit=${limit}`;

  return proxyToBackend(event, endpoint);
});
