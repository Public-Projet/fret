import { getHeader, getCookie, proxyRequest } from 'h3';
import type { H3Event } from 'h3';

// Utilitaire serveur pour proxifier les appels vers le backend externe.
interface ProxyOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, any> | null;
  query?: Record<string, string>;
}

// Récupère le token JWT depuis le header Authorization de la requête entrante
function getTokenFromEvent(event: H3Event): string | null {
  const authorization = getHeader(event, 'authorization');
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  const token = getCookie(event, 'auth_token');
  return token || null;
}
// Proxy une requête vers le backend externe
export async function proxyToBackend<T = unknown>(
  event: H3Event,
  path: string,
  options: ProxyOptions = {}
): Promise<T> {
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;

  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API base URL not configured',
    });
  }

  const token = getTokenFromEvent(event);
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await $fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ?? undefined,
      query: options.query,
    });

    return response as T;
  } catch (error: any) {
    const statusCode = error?.response?.status || error?.statusCode || 500;
    const data = error?.response?._data || error?.data || { message: 'Erreur serveur' };

    throw createError({
      statusCode,
      statusMessage: data?.message || `Erreur backend ${statusCode}`,
      message: data?.message || (typeof data === 'string' ? data : `Erreur backend ${statusCode}`),
      data,
    });
  }
}

// Proxy un flux binaire (PDF, image, etc.) vers le backend externe.
export async function proxyBinaryToBackend(
  event: H3Event,
  path: string
) {
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;

  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API base URL not configured',
    });
  }

  const url = `${baseUrl}${path}`;
  return proxyRequest(event, url);
}
