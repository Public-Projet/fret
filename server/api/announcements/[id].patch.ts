export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  return proxyToBackend(event, `/shipper/announcement/${id}`, {
    method: 'PATCH',
    body,
  });
});
