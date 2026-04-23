export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body?.role as string;
  const id = body?.conversationId as string;

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

  const { role: _role, conversationId: _id, ...messageData } = body;

  return proxyToBackend(event, `/${role}/messaging/conversations/${id}/messages`, {
    method: 'POST',
    body: {
      ...messageData,
      role // On s'assure que le rôle est passé au backend si nécessaire
    }
  });
});
