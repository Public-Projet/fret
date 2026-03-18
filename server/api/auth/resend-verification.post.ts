export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { role, email } = body;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L\'adresse email est requise',
    });
  }

  const endpoint = role === 'shipper'
    ? '/shipper/auth/resend-verification'
    : '/carrier/auth/resend-verification';

  return proxyToBackend(event, endpoint, {
    method: 'POST',
    body: { email },
  });
});
