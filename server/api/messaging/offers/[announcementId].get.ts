export default defineEventHandler(async (event) => {
  const announcementId = getRouterParam(event, 'announcementId');
  return proxyToBackend(event, `/shipper/announcement/${announcementId}/offers`);
});
