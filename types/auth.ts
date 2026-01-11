import type { UserRole } from './index';

/**
 * Interface utilisateur normalisée pour le frontend (camelCase)
 */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'pending' | 'active' | 'suspended';

  company?: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  createdAt?: string;
}

/**
 * Interface utilisateur retournée par l'API (lowercase)
 */
export interface ApiUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  status: 'pending' | 'active' | 'suspended';
}

/**
 * Réponse de l'API login
 */
export interface LoginResponse {
  token: string;
  user: ApiUser;
}

/**
 * Réponse de l'API register
 */
export interface RegisterResponse {
  message: string;
}

/**
 * État du store d'authentification
 */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastConnectedRole: UserRole | null;
  lastConnectedAt: string | null;
}

/**
 * Données d'inscription
 */
export interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

/**
 * Convertit un utilisateur API vers le format frontend
 */
export function mapApiUserToAuthUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstname,
    lastName: apiUser.lastname,
    role: apiUser.role,
    status: apiUser.status,
  };
}
