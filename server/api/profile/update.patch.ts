export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body?.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  const { role: _role, ...profileData } = body;

  return proxyToBackend(event, `/${role}/update-profile`, {
    method: 'PATCH',
    body: profileData,
  });
});
