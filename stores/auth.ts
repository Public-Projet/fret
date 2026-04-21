import { defineStore } from 'pinia';
import type { AuthUser, AuthState } from '~/types';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    lastConnectedRole: null,
    lastConnectedAt: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    isShipper: (state) => state.user?.role === 'shipper',
    isCarrier: (state) => state.user?.role === 'carrier',
    userRole: (state) => state.user?.role,
  },

  actions: {
    // Mettre à jour le profil utilisateur (pour compatibilité)
    async updateProfile(updates: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        return { success: true, user: this.user };
      }
      return { success: false, error: 'Utilisateur non connecté' };
    },
  },
});
