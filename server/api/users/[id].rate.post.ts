export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const role = body?.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Le rôle est requis (shipper ou carrier)' });
  }

  const { role: _role, ...ratingData } = body;

  // shipper rates a carrier, carrier rates a shipper
  return proxyToBackend(event, `/${role}/rate/${id}`, {
    method: 'POST',
    body: ratingData,
  });
});
