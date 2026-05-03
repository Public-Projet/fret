export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  const body = await readBody(event);

  return proxyToBackend(event, `/carrier/announcement/${id}/offer`, {
    method: 'POST',
    body,
  });
});
