import { defineStore } from 'pinia';
import type { UserRole } from '~/types';

// Interface pour le profil utilisateur
export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  phone?: string;
  role: UserRole;
  bio?: string;
  photoUrl?: string;
  status: 'pending' | 'active' | 'suspended';
}

// Interface pour les données de mise à jour du profil
export interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
}

// Interface pour les données de mise à jour du mot de passe
export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Interface pour les données de mise à jour de l'email
export interface UpdateEmailData {
  newEmail: string;
  password: string;
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    fullName: (state) => {
      if (!state.profile) return '';
      return `${state.profile.firstname} ${state.profile.lastname}`;
    },
    isProfileComplete: (state) => {
      if (!state.profile) return false;
      return !!(state.profile.phone && state.profile.bio);
    },
  },

  actions: {
    /**
     * Récupérer le profil utilisateur
     */
    async fetchProfile(role: UserRole) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/me' : '/carrier/me';

      try {
        const response = await api.get<{ message: string; user: UserProfile }>(endpoint);

        if (response.success && response.data?.user) {
          this.profile = response.data.user;
          return { success: true, profile: this.profile };
        } else {
          const errorMessage = this.extractErrorMessage(response.error);
          this.error = errorMessage;
          return { success: false, error: errorMessage };
        }
      } catch (e) {
        const errorMessage = 'Erreur lors de la récupération du profil';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Mettre à jour le profil
     */
    async updateProfile(role: UserRole, data: UpdateProfileData) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/update-profile' : '/carrier/update-profile';

      try {
        const response = await api.patch<{ message: string; user: UserProfile }>(endpoint, data);

        if (response.success && response.data?.user) {
          this.profile = response.data.user;
          return { success: true, message: response.data.message, profile: this.profile };
        } else {
          const errorMessage = this.extractErrorMessage(response.error);
          this.error = errorMessage;
          return { success: false, error: errorMessage };
        }
      } catch (e) {
        const errorMessage = 'Erreur lors de la mise à jour du profil';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Mettre à jour le mot de passe
     */
    async updatePassword(role: UserRole, data: UpdatePasswordData) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/update-password' : '/carrier/update-password';

      try {
        const response = await api.patch<{ message: string }>(endpoint, data);

        if (response.success && response.data) {
          return { success: true, message: response.data.message };
        } else {
          const errorMessage = this.extractErrorMessage(response.error);
          this.error = errorMessage;
          return { success: false, error: errorMessage };
        }
      } catch (e) {
        const errorMessage = 'Erreur lors de la mise à jour du mot de passe';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Mettre à jour l'email
     */
    async updateEmail(role: UserRole, data: UpdateEmailData) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/update-email' : '/carrier/update-email';

      try {
        const response = await api.patch<{ message: string }>(endpoint, data);

        if (response.success && response.data) {
          return { success: true, message: response.data.message };
        } else {
          const errorMessage = this.extractErrorMessage(response.error);
          this.error = errorMessage;
          return { success: false, error: errorMessage };
        }
      } catch (e) {
        const errorMessage = 'Erreur lors de la mise à jour de l\'email';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Réinitialiser le store
     */
    reset() {
      this.profile = null;
      this.isLoading = false;
      this.error = null;
    },

    /**
     * Extraire le message d'erreur de la réponse
     */
    extractErrorMessage(error: any): string {
      if (!error) return 'Une erreur est survenue';

      if (error.data) {
        const errorData = error.data as Record<string, unknown>;

        // Chercher dans les différentes structures d'erreur
        const errorKeys = ['badCombo', 'invalidPhoneFormat', 'passwordFormatInvalid', 'notFound', 'invalidEmail'];
        for (const key of errorKeys) {
          if (errorData[key] && typeof errorData[key] === 'object') {
            return (errorData[key] as { message?: string }).message || 'Une erreur est survenue';
          }
        }

        if (errorData.message && typeof errorData.message === 'string') {
          return errorData.message;
        }
      }

      if (error.message && !error.message.startsWith('Erreur HTTP')) {
        return error.message;
      }

      return 'Une erreur est survenue';
    },
  },
});
