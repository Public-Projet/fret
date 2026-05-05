export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || '';
  const config = useRuntimeConfig();
  
  console.log(`[PhotoProxy] Catch-all slug: ${slug}`);
  const backendUrl = `/api/v1/public/profile-photo/${slug}`;
  console.log(`[PhotoProxy] Target backend path: ${backendUrl}`);
  
  return proxyBinaryToBackend(event, backendUrl);
});
