export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body?.plan || !body?.billing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le plan et le cycle de facturation sont requis.',
    });
  }

  return proxyToBackend(event, '/subscription/checkout', {
    method: 'POST',
    body,
  });
});
