export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const role = query.role as string;
  const id = query.id as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'LID de la conversation est requis',
    });
  }

  return proxyToBackend(event, `/${role}/messaging/${id}/messages`);
});
