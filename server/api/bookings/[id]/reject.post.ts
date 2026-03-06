export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/carrier/booking/${id}/reject`, {
    method: 'POST',
  });
});
