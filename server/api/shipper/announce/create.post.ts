export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyToBackend(event, '/shipper/announcement', {
    method: 'POST',
    body,
  });
});
