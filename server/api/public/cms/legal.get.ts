export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = query.slug as string;
  return proxyToBackend(event, `/public/cms/legal/${slug}`);
});
