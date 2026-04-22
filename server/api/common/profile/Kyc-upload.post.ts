export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body?.role as string;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  // For KYC, the body is FormData — we need to forward it as-is
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;
  const token = getHeader(event, 'authorization')?.slice(7) || getCookie(event, 'auth_token');

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Read raw body for FormData forwarding
  const rawBody = await readRawBody(event);
  const contentType = getHeader(event, 'content-type') || '';

  try {
    const response = await $fetch(`${baseUrl}/${role}/kyc`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': contentType,
      },
      body: rawBody,
    });

    return response;
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const data = error?.response?._data || { message: 'Erreur serveur' };
    throw createError({ statusCode, data });
  }
});
