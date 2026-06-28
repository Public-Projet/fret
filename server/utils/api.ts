import { getHeader, getCookie, proxyRequest, deleteCookie } from 'h3';
import type { H3Event } from 'h3';
import { decryptToken, isEncryptedToken } from '~/server/utils/crypto';

// Utilitaire serveur pour proxifier les appels vers le backend externe.
interface ProxyOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, any> | null;
  query?: Record<string, string>;
}

// Récupère et déchiffre le token JWT depuis la requête entrante.
export function getTokenFromEvent(event: H3Event): string | null {
  const authorization = getHeader(event, 'authorization');
  if (authorization?.startsWith('Bearer ')) {
    const val = authorization.slice(7);
    if (val && val !== 'undefined' && val !== 'null') {
      // Déchiffrer si c'est un token chiffré (format iv.tag.data)
      if (isEncryptedToken(val)) {
        return decryptToken(val);
      }
      return val;
    }
  }

  const rawCookie = getCookie(event, 'auth_token');
  if (!rawCookie) return null;

  // Déchiffrer le cookie si nécessaire
  if (isEncryptedToken(rawCookie)) {
    return decryptToken(rawCookie);
  }

  return rawCookie;
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

    if (statusCode === 401) {
      deleteCookie(event, 'auth_token', { path: '/' });
      deleteCookie(event, 'auth_role', { path: '/' });
    }

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
  path: string,
  options: { query?: Record<string, any> } = {}
) {
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl as string;

  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API base URL not configured',
    });
  }

  let url = `${baseUrl}${path}`;

  // Appendre les query params si présents
  if (options.query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Injecter le token JWT déchiffré dans les headers avant de proxifier.
  // proxyRequest relaie les headers bruts du navigateur, mais le token est
  // stocké dans un cookie chiffré que le backend ne sait pas déchiffrer.
  const token = getTokenFromEvent(event);
  if (token) {
    event.node.req.headers['authorization'] = `Bearer ${token}`;
  }

  return proxyRequest(event, url);
}
