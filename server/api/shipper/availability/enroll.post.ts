export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id;
  return proxyToBackend(event, `/shipper/availability/${id}/enroll`, {
    method: 'POST',
    body,
  });
});
