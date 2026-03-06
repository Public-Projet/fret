export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body?.role;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  // Ne pas envoyer le "role" au backend
  const { role: _role, ...loginData } = body;

  const endpoint = role === 'shipper'
    ? '/shipper/auth/login'
    : '/carrier/auth/login';

  return proxyToBackend(event, endpoint, {
    method: 'POST',
    body: loginData,
  });
});
