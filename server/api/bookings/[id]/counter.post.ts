export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  const role = body?.role || 'carrier';
  delete body?.role;

  const endpoint = role === 'shipper'
    ? `/shipper/availabilities/${id}/counter`
    : `/carrier/booking/${id}/counter`;

  return proxyToBackend(event, endpoint, {
    method: 'POST',
    body,
  });
});
