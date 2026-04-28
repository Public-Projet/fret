import { getCookie, setResponseHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path as string;

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    });
  }

  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;
  const token = getCookie(event, 'auth_token');

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText
      });
    }

    let contentType = response.headers.get('content-type');
    if (!contentType) {
      contentType = path.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';
    }

    setResponseHeader(event, 'Content-Type', contentType);
    setResponseHeader(event, 'Content-Disposition', 'inline; filename="preview"');

    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération du fichier.'
    });
  }
});
