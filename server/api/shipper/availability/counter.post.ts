export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id;
  
  // Clean up body for backend
  delete body?.id;
  delete body?.role;

  return proxyToBackend(event, `/shipper/availability/${id}/counter`, {
    method: 'POST',
    body,
  });
});
