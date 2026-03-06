export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/shipper/offer/${id}/reject`, {
    method: 'POST',
  });
});
