export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  return proxyToBackend(event, `/carrier/announcement/${id}/offer`, {
    method: 'POST',
    body,
  });
});
