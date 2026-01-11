/**
 * Types pour l'API
 */

export interface ApiError {
  message: string;
  statusCode: number;
  data?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}
