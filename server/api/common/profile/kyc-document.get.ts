export default defineEventHandler(async (event) => {
  const docId = getRouterParam(event, 'docId');
  const query = getQuery(event);
  const role = query.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  return proxyToBackend(event, `/${role}/kyc-document/${docId}`);
});
