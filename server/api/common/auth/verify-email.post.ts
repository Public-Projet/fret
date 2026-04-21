export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role, token } = body;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le token est requis',
    });
  }

  const endpoint = role === 'shipper'
    ? '/shipper/auth/verify-email'
    : '/carrier/auth/verify-email';

  return proxyToBackend(event, endpoint, {
    method: 'POST',
    body: { token },
  });
});
