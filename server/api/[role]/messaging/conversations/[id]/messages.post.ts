export default defineEventHandler(async (event) => {
  const role = getRouterParam(event, 'role');
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  return proxyToBackend(event, `/${role}/messaging/conversations/${id}/messages`, {
    method: 'POST',
    body
  });
});
