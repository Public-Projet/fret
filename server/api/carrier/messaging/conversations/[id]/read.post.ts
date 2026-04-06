export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/carrier/messaging/conversations/${id}/read`, {
    method: 'POST',
    body: { role: 'carrier' }
  });
});
