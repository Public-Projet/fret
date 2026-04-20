export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  const path = `/public/announcements${queryString ? `?${queryString}` : ''}`;

  return proxyToBackend(event, path);
});
