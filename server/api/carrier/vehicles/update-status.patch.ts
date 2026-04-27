export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id;
  return proxyToBackend(event, `/carrier/vehicle/${id}/status`, {
    method: 'PATCH',
    body,
  });
});
