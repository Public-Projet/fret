/**
 * Composable useAPI - Gestion des appels API avec cookies httpOnly
 */

import type { ApiError, ApiResponse } from '~/types/api';

export function useAPI() {
  const config = useRuntimeConfig();
  const baseURL = config.apiBaseUrl as string;

  /**
   * Effectue une requête HTTP générique
   */
  async function request<T>(
    url: string,
    options: RequestInit & { skipAuthRedirect?: boolean; responseType?: 'json' | 'blob' } = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${baseURL}${url}`;

    // Récupérer le token JWT depuis le cookie
    const tokenCookie = useCookie('auth_token');
    const token = tokenCookie.value;

    const isFormData = options.body instanceof FormData;
    const responseType = options.responseType || 'json';

    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

      // Parse la réponse
      let responseData: any = null;
      if (responseType === 'json') {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        }
      } else {
        responseData = await response.blob();
      }

      if (!response.ok) {
        // Redirection vers la page de connexion si non authentifié
        if (response.status === 401) {
          const isBadCombo = responseData && typeof responseData === 'object' && ('badCombo' in responseData);
          const skipRedirect = (options as any).skipAuthRedirect === true;

          if (!isBadCombo && !skipRedirect) {
            const router = useRouter();
            router.push('/auth/login');
          }
        }

        return {
          data: null,
          error: {
            message: (responseData?.message as string) || `Erreur HTTP ${response.status}`,
            statusCode: response.status,
            data: responseData ?? undefined,
          },
          success: false,
        };
      }

      return {
        data: responseData as T,
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
  async function get<T>(url: string, options?: RequestInit & { skipAuthRedirect?: boolean; responseType?: 'json' | 'blob' }): Promise<ApiResponse<T>> {
    return request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * Requête POST
   */
  async function post<T>(url: string, data?: object | FormData, options?: RequestInit & { skipAuthRedirect?: boolean; responseType?: 'json' | 'blob' }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  /**
   * Requête PUT
   */
  async function put<T>(url: string, data?: object, options?: RequestInit & { skipAuthRedirect?: boolean; responseType?: 'json' | 'blob' }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête PATCH
   */
  async function patch<T>(url: string, data?: object, options?: RequestInit & { skipAuthRedirect?: boolean; responseType?: 'json' | 'blob' }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête DELETE
   */
  async function del<T>(url: string, data?: object, options?: RequestInit & { skipAuthRedirect?: boolean; responseType?: 'json' | 'blob' }): Promise<ApiResponse<T>> {
    return request<T>(url, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
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

