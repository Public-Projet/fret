export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  const body = await readBody(event);

  // Le rôle détermine l'endpoint backend
  const role = body?.role || 'shipper';
  delete body?.role;

  const endpoint = role === 'shipper'
    ? `/shipper/announcement/${id}/counter`
    : `/carrier/announcement/${id}/counter`;

  return proxyToBackend(event, endpoint, {
    method: 'POST',
    body,
  });
});
