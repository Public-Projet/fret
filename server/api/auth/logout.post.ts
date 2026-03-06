export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body?.role;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  const endpoint = role === 'shipper'
    ? '/shipper/auth/logout'
    : '/carrier/auth/logout';

  return proxyToBackend(event, endpoint, {
    method: 'POST',
  });
});
