export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  return proxyToBackend(event, `/public/cms/help/article/${slug}`);
});
