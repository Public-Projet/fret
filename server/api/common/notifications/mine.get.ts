export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  const role = query.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  return proxyToBackend(event, `/${role}/notifications/${id}`);
});
