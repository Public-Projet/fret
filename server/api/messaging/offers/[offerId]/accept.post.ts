export default defineEventHandler(async (event) => {
  const offerId = getRouterParam(event, 'offerId');
  return proxyToBackend(event, `/shipper/offer/${offerId}/accept`, {
    method: 'POST',
  });
});
