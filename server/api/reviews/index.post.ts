export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyToBackend(event, '/public/reviews', { method: 'POST', body });
});
