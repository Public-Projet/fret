export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyToBackend(event, '/carrier/vehicle', {
    method: 'POST',
    body,
  });
});
