import { proxyToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id as string;
  const role = body?.role as string;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID est requis' });
  }

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Le rôle est requis (shipper ou carrier)' });
  }

  const { role: _role, id: _id, ...ratingData } = body;

  // shipper rates a carrier, carrier rates a shipper
  return proxyToBackend(event, `/${role}/rate/${id}`, {
    method: 'POST',
    body: ratingData,
  });
});
