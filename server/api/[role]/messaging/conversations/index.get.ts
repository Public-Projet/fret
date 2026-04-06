export default defineEventHandler(async (event) => {
  const role = getRouterParam(event, 'role');
  return proxyToBackend(event, `/${role}/messaging/conversations`);
});
