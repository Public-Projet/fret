export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  return proxyToBackend(event, `/shipper/availabilities/${id}/enroll`, {
    method: 'POST',
    body,
  });
});
