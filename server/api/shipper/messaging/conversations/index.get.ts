export default defineEventHandler(async (event) => {
  return proxyToBackend(event, `/shipper/messaging/conversations?role=shipper`);
});
