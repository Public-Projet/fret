export default defineEventHandler(async (event) => {
  return proxyToBackend(event, '/shipper/availability/list');
});
