export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();
  
  const role = query.role as string;
  const userId = query.userId as string;
  const filename = query.filename as string;

  console.log(`[PhotoProxy] Serving query: role=${role}, userId=${userId}, filename=${filename}`);
  
  // Proxy vers le backend avec les mêmes paramètres de requête
  return proxyBinaryToBackend(event, '/public/profile-photo', { query });
});
