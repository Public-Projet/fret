import { defineStore } from 'pinia';
import type { UserRole, UserProfile, UpdateProfileData, UpdatePasswordData, UpdateEmailData, Vehicle, AddVehicleData, StoreAvailability as Availability, } from '~/types';

interface ProfileState {
  profile: UserProfile | null;
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  vehiclesLoading: boolean;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    vehicles: [],
    isLoading: false,
    error: null,
    vehiclesLoading: false,
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
    vehicleCount: (state) => state.vehicles.length,
  },

  actions: {
    /**
     * Récupérer le profil utilisateur
     */
    async fetchProfile(role: UserRole, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string; user: UserProfile }>('/api/profile', {
          query: { role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.user) {
          this.profile = response.user;
          if (role === 'carrier') {
            await this.fetchVehicles();
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

    async updateProfile(role: UserRole, data: UpdateProfileData, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string; user: UserProfile }>('/api/profile/update', {
          method: 'PATCH',
          body: { ...data, role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.user) {
          this.profile = response.user;
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

    async updatePassword(role: UserRole, data: UpdatePasswordData, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string }>('/api/profile/password', {
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

    async updateEmail(role: UserRole, data: UpdateEmailData, _requestOptions: any = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ message: string }>('/api/profile/email', {
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

    /**
     * Récupérer les véhicules
     */
    async fetchVehicles(_requestOptions: any = {}) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ vehicles: Vehicle[] }>('/api/vehicles', {
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.vehicles) {
          this.vehicles = response.vehicles;
          return { success: true, vehicles: this.vehicles };
        }
        return { success: false, error: 'Erreur chargement véhicules' };
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Erreur lors du chargement des véhicules' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Ajouter un véhicule
     */
    async addVehicle(data: AddVehicleData) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ message: string; vehicle: Vehicle }>('/api/vehicles', {
          method: 'POST',
          body: data,
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.vehicle) {
          this.vehicles.push(response.vehicle);
          return { success: true, message: response.message };
        }
        return { success: false, error: 'Erreur ajout véhicule' };
      } catch (e: any) {
        return { success: false, error: this.extractErrorMessage(e) || 'Erreur lors de l\'ajout du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Supprimer un véhicule
     */
    async deleteVehicle(id: string) {
      try {
        const response = await $fetch<{ message: string }>(`/api/vehicles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        this.vehicles = this.vehicles.filter(v => v.id !== id);
        return { success: true, message: response?.message || 'Véhicule supprimé' };
      } catch (e: any) {
        return { success: false, error: this.extractErrorMessage(e) || 'Erreur lors de la suppression' };
      }
    },

    /**
     * Récupérer un véhicule spécifique
     */
    async fetchVehicle(id: string) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ vehicle: Vehicle; availability: Availability | null; history: Availability[] }>(`/api/vehicles/${id}`, {
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.vehicle) {
          return {
            success: true,
            vehicle: {
              ...response.vehicle,
              availability: response.availability,
              history: response.history
            }
          };
        }
        return { success: false, error: 'Véhicule non trouvé' };
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Erreur lors du chargement du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Envoyer un document KYC
     */
    async uploadKycDocument(type: string, file: File, role: UserRole = 'carrier') {
      this.isLoading = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('document', file);
        formData.append('role', role);

        const response = await $fetch<{ message: string; document: any }>('/api/kyc/upload', {
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

    /**
     * Récupérer les métadonnées d'un document KYC
     */
    async fetchKycDocument(role: UserRole, docId: string) {
      this.isLoading = true;

      try {
        const response = await $fetch<{ document: any }>(`/api/kyc/${docId}`, {
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

    async updateVehicle(id: string, data: Partial<AddVehicleData>) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ message: string; vehicle: Vehicle }>(`/api/vehicles/${id}`, {
          method: 'PATCH',
          body: data,
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.vehicle) {
          const index = this.vehicles.findIndex(v => v.id === id);
          if (index !== -1) {
            this.vehicles[index] = response.vehicle;
          }
          return { success: true, message: response.message };
        }
        return { success: false, error: 'Erreur de mise à jour' };
      } catch (e: any) {
        return { success: false, error: this.extractErrorMessage(e) || 'Erreur lors de la mise à jour du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Mettre à jour le statut d'un véhicule
     */
    async updateVehicleStatus(id: string, status: 'available' | 'in_transit' | 'maintenance') {
      try {
        const response = await $fetch<{ message: string; vehicle: Vehicle }>(`/api/vehicles/${id}/status`, {
          method: 'PATCH',
          body: { status },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.vehicle) {
          const index = this.vehicles.findIndex(v => v.id === id);
          if (index !== -1) {
            this.vehicles[index] = response.vehicle;
          }
          return { success: true, message: response.message, vehicle: response.vehicle };
        }
        return { success: false, error: 'Erreur de mise à jour' };
      } catch (e: any) {
        return { success: false, error: this.extractErrorMessage(e) || 'Erreur lors de la mise à jour du statut' };
      }
    },

    /**
     * Réinitialiser le store
     */
    reset() {
      this.profile = null;
      this.vehicles = [];
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
