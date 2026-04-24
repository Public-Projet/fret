export default defineEventHandler(async (event) => {
  return proxyToBackend(event, '/public/availability');
});
