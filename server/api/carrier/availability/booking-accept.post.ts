export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/carrier/availability/${id}/accept`, {
    method: 'POST',
  });
});
