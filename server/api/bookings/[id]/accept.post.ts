export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/carrier/booking/${id}/accept`, {
    method: 'POST',
  });
});
