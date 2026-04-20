export default defineEventHandler(async (event) => {
  const { offerId } = await readBody(event);
  return proxyToBackend(event, `/shipper/announcement/${offerId}/accept`, {
    method: 'POST',
  });
});
