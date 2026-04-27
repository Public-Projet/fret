export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id;
  return proxyToBackend(event, `/carrier/vehicle/${id}`, {
    method: 'PATCH',
    body,
  });
});
