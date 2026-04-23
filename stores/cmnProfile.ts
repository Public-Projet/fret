import { defineStore } from 'pinia';
import { useCarVehiclesStore } from './carVehicles';
import type { UserRole, UserProfile, UpdateProfileData, UpdatePasswordData, UpdateEmailData, } from '~/types';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useCmnProfileStore = defineStore('cmnProfile', {
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
    // Récupérer le profil utilisateur
    async fetchProfile(role: UserRole, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string; user: UserProfile }>('/api/common/profile/me', {
          query: { role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.user) {
          const authStore = useCmnAuthStore();
          this.profile = response.user;

          // Synchronisation avec l'authStore pour le header
          authStore.updateProfile({
            firstName: response.user.firstname,
            lastName: response.user.lastname,
            avatar: response.user.photoUrl
          });

          if (role === 'carrier') {
            const vehicleStore = useCarVehiclesStore();
            await vehicleStore.fetchCarVehicles();
          }
          return { success: true, profile: this.profile };
        } else {
          this.error = 'Profil non trouvé';
          return { success: false, error: 'Profil non trouvé' };
        }
      } catch (e: any) {
        const errorMessage = e?.data?.message || 'Erreur lors de la récupération du profil';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    // Mettre à jour le profil
    async updateProfile(role: UserRole, data: UpdateProfileData, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string; user: UserProfile }>('/api/common/profile/update-profile', {
          method: 'PATCH',
          body: { ...data, role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.user) {
          const authStore = useCmnAuthStore();
          this.profile = response.user;

          // Mise à jour de l'authStore pour synchroniser le header
          authStore.updateProfile({
            firstName: response.user.firstname,
            lastName: response.user.lastname,
            avatar: response.user.photoUrl
          });

          return { success: true, message: response.message, profile: this.profile };
        } else {
          const errorMessage = 'Erreur de mise à jour';
          this.error = errorMessage;
          return { success: false, error: errorMessage };
        }
      } catch (e: any) {
        const errorMessage = this.extractErrorMessage(e) || 'Erreur lors de la mise à jour du profil';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    // Mettre à jour l'email
    async updateEmail(role: UserRole, data: UpdateEmailData, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string }>('/api/common/profile/email', {
          method: 'PATCH',
          body: {
            email: data.newEmail,
            password: data.password,
            role,
          },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.message) {
          return { success: true, message: response.message };
        }
        return { success: false, error: 'Erreur de mise à jour' };
      } catch (e: any) {
        const errorMessage = this.extractErrorMessage(e) || 'Erreur lors de la mise à jour de l\'email';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    // Mettre à jour le mot de passe
    async updatePassword(role: UserRole, data: UpdatePasswordData, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string }>('/api/common/profile/password', {
          method: 'PATCH',
          body: { ...data, role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.message) {
          return { success: true, message: response.message };
        }
        return { success: false, error: 'Erreur de mise à jour' };
      } catch (e: any) {
        const errorMessage = this.extractErrorMessage(e) || 'Erreur lors de la mise à jour du mot de passe';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        this.isLoading = false;
      }
    },

    // Soumettre ses documents de KYC
    async uploadKycDocument(type: string, file: File, role: UserRole = 'carrier') {
      this.isLoading = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('document', file);
        formData.append('role', role);

        const response = await $fetch<{ message: string; document: any }>('/api/common/profile/kyc-upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.message) {
          await this.fetchProfile(role);
          return { success: true, message: response.message };
        }
        return { success: false, error: 'Erreur envoi document' };
      } catch (e: any) {
        return { success: false, error: this.extractErrorMessage(e) || 'Erreur lors de l\'envoi du document' };
      } finally {
        this.isLoading = false;
      }
    },

    // Récupérer les métadonnées d'un document KYC
    async fetchKycDocument(role: UserRole, docId: string) {
      this.isLoading = true;

      try {
        const response = await $fetch<{ document: any }>(`/api/common/profile/kyc-document`, {
          query: { role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.document) {
          return { success: true, document: response.document };
        }
        return { success: false, error: 'Document non trouvé' };
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Erreur lors de la récupération du document' };
      } finally {
        this.isLoading = false;
      }
    },

    // Supprimer le compte
    async deleteAccount(role: UserRole, data: { password: string; confirmation: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string }>('/api/common/profile/delete-account', {
          method: 'DELETE',
          body: { ...data, role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.message) {
          return { success: true, message: response.message };
        }
        return { success: false, error: 'Erreur lors de la suppression' };
      } catch (e: any) {
        const errorMessage = this.extractErrorMessage(e) || 'Erreur lors de la suppression du compte';
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

      // Erreur $fetch (error.data contient les données d'erreur)
      const errorData = error?.data?.data || error?.data;

      if (errorData && typeof errorData === 'object') {
        const errorKeys = ['badCombo', 'invalidPhoneFormat', 'passwordFormatInvalid', 'notFound', 'invalidEmail', 'emailAlreadyInUse', 'licensePlateAlreadyInUse'];
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
