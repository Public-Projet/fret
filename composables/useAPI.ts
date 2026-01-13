/**
 * Composable useAPI - Gestion des appels API avec cookies httpOnly
 */

import type { ApiError, ApiResponse } from '~/types/api';

export function useAPI() {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseAPI as string;

  /**
   * Effectue une requête HTTP générique
   */
  async function request<T>(
    url: string,
    options: RequestInit & { skipAuthRedirect?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${baseURL}${url}`;

    // Récupérer le token JWT depuis le cookie
    const tokenCookie = useCookie('auth_token');
    const token = tokenCookie.value;

    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(fullUrl, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      });

      // Parse la réponse JSON
      let responseData: T | null = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      }

      if (!response.ok) {
        // Gestion des erreurs HTTP
        const errorData = responseData as Record<string, unknown> | null;

        // Redirection vers login si non authentifié (mais pas pour badCombo qui est une erreur de mot de passe incorrect)
        if (response.status === 401) {
          const errorData = responseData as Record<string, unknown> | null;
          const isBadCombo = errorData && ('badCombo' in errorData);

          // Check custom option to skip redirect
          const skipRedirect = (options as any).skipAuthRedirect === true;

          if (!isBadCombo && !skipRedirect) {
            const router = useRouter();
            router.push('/auth/login');
          }
        }

        return {
          data: null,
          error: {
            message: (errorData?.message as string) || `Erreur HTTP ${response.status}`,
            statusCode: response.status,
            data: errorData ?? undefined,
          },
          success: false,
        };
      }

      return {
        data: responseData,
        error: null,
        success: true,
      };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: {
          message: error.message || 'Erreur réseau',
          statusCode: 0,
        },
        success: false,
      };
    }
  }

  /**
   * Requête GET
   */
  async function get<T>(url: string, options?: RequestInit & { skipAuthRedirect?: boolean }): Promise<ApiResponse<T>> {
    return request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * Requête POST
   */
  async function post<T>(url: string, data?: object, options?: RequestInit & { skipAuthRedirect?: boolean }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête PUT
   */
  async function put<T>(url: string, data?: object, options?: RequestInit & { skipAuthRedirect?: boolean }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête PATCH
   */
  async function patch<T>(url: string, data?: object, options?: RequestInit & { skipAuthRedirect?: boolean }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête DELETE
   */
  async function del<T>(url: string, options?: RequestInit & { skipAuthRedirect?: boolean }): Promise<ApiResponse<T>> {
    return request<T>(url, { ...options, method: 'DELETE' });
  }

  return {
    request,
    get,
    post,
    put,
    patch,
    del,
  };
}

