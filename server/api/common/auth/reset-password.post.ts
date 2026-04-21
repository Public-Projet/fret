export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role, token, password } = body;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  if (!token || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le token et le nouveau mot de passe sont requis',
    });
  }

  const endpoint = role === 'shipper'
    ? '/shipper/auth/reset-password'
    : '/carrier/auth/reset-password';

  return proxyToBackend(event, endpoint, {
    method: 'POST',
    body: { token, password },
  });
});
