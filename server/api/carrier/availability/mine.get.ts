export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  return proxyToBackend(event, `/carrier/availability/${id}`);
});
