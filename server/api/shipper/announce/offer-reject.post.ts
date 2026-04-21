export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/shipper/announcement/${id}/reject`, {
    method: 'POST',
  });
});
