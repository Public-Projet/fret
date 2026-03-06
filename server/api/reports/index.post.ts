export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyToBackend(event, '/public/reports', { method: 'POST', body });
});
