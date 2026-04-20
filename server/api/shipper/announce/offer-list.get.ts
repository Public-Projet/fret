export default defineEventHandler(async (event) => {
  const { announcementId } = getQuery(event);
  return proxyToBackend(event, `/shipper/announcement/${announcementId}/offers`);
});
