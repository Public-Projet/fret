export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  return proxyToBackend(event, '/subscription/verify', {
    method: 'GET',
    query: query as any,
  });
});
