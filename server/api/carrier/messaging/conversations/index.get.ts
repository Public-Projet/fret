export default defineEventHandler(async (event) => {
  return proxyToBackend(event, `/carrier/messaging/conversations?role=carrier`);
});
