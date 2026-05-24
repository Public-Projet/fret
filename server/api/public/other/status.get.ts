export default defineEventHandler(async (event) => {
  return proxyToBackend(event, '/public/status');
});
