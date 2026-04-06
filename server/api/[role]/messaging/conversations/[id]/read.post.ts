export default defineEventHandler(async (event) => {
  const role = getRouterParam(event, 'role');
  const id = getRouterParam(event, 'id');
  
  return proxyToBackend(event, `/${role}/messaging/conversations/${id}/read`, {
    method: 'POST',
    body: {}
  });
});
