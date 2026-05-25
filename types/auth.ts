import type { UserRole } from './index';

// Interface utilisateur normalisée pour le frontend
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
  reviewsCount?: number;
  verified?: boolean;
  createdAt?: string;
  kycDocuments?: {
    id: string;
    type: string;
    name: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: number;
    url: string;
  }[];
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  subscriptionPlan?: 'free' | 'pro' | 'enterprise';
  subscriptionType?: 'monthly' | 'annual' | 'none';
  subscriptionStatus?: 'active' | 'inactive' | 'pending';
  subscriptionExpiresAt?: number;
}

// Interface utilisateur retournée par l'API
export interface ApiUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  status: 'pending' | 'active' | 'suspended';
  phone?: string;
  bio?: string;
  photoUrl?: string;
  rating?: number;
  reviewsCount?: number;
  kycDocuments?: any[];
  kycStatus?: string;
  subscriptionPlan?: 'free' | 'pro' | 'enterprise';
  subscriptionType?: 'monthly' | 'annual' | 'none';
  subscriptionStatus?: 'active' | 'inactive' | 'pending';
  subscriptionExpiresAt?: number;
}

// Réponse de l'API login
export interface LoginResponse {
  token: string;
  user: ApiUser;
}

// Réponse de l'API d'inscription
export interface RegisterResponse {
  message: string;
}

// État du store d'authentification
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastConnectedRole: UserRole | null;
  lastConnectedAt: string | null;
}

// Données d'inscription
export interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

// Convertit un utilisateur API vers le format frontend
export function mapApiUserToAuthUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstname,
    lastName: apiUser.lastname,
    role: apiUser.role,
    status: apiUser.status,
    phone: apiUser.phone,
    avatar: apiUser.photoUrl,
    rating: apiUser.rating,
    reviewsCount: apiUser.reviewsCount,
    kycDocuments: apiUser.kycDocuments,
    kycStatus: apiUser.kycStatus as any,
    subscriptionPlan: apiUser.subscriptionPlan,
    subscriptionType: apiUser.subscriptionType,
    subscriptionStatus: apiUser.subscriptionStatus,
    subscriptionExpiresAt: apiUser.subscriptionExpiresAt,
  };
}
