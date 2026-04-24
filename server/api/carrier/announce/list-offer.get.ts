export default defineEventHandler(async (event) => {
  return proxyToBackend(event, '/carrier/announcement');
});
