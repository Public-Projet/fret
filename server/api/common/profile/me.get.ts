export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  const endpoint = role === 'shipper' ? '/shipper/me' : '/carrier/me';

  return proxyToBackend(event, endpoint);
});
