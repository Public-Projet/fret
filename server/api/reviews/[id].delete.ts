export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return proxyToBackend(event, `/admin/reviews/${id}`, { method: 'DELETE' });
});
