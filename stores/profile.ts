import { defineStore } from 'pinia';
import { useAPI } from '~/composables/useAPI';
import type { UserRole } from '~/types';
import type { Availability } from './availability';

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
  kycDocuments?: {
    id: string;
    type: string;
    name: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: number;
    url: string;
  }[];
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected';
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

// Interface pour les véhicules
export interface Vehicle {
  id: string;
  type: 'truck' | 'van' | 'pickup' | 'semi' | 'other';
  licensePlate: string;
  brand?: string;
  model?: string;
  capacity?: number;
  volume?: number;
  status: 'available' | 'in_transit' | 'maintenance';
  availability?: Availability | null;
  history?: Availability[];
}

export interface AddVehicleData {
  type: string;
  licensePlate: string;
  brand?: string;
  model?: string;
  capacity?: number;
  volume?: number;
}

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

  // ... existing getters ...
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
    // ... existing profile actions ...
    /**
     * Récupérer le profil utilisateur
     */
    async fetchProfile(role: UserRole, requestOptions: RequestInit & { skipAuthRedirect?: boolean } = {}) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/me' : '/carrier/me';

      try {
        const response = await api.get<{ message: string; user: UserProfile }>(endpoint, requestOptions);

        if (response.success && response.data?.user) {
          this.profile = response.data.user;
          // Si c'est un transporteur, charger aussi ses véhicules
          if (role === 'carrier') {
            await this.fetchVehicles(requestOptions);
          }
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

    // ... updatedProfile, updatedPassword, updateEmail actions (unchanged logic, just kept in file) ...
    async updateProfile(role: UserRole, data: UpdateProfileData, requestOptions: RequestInit & { skipAuthRedirect?: boolean } = {}) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/update-profile' : '/carrier/update-profile';

      try {
        const response = await api.patch<{ message: string; user: UserProfile }>(endpoint, data, requestOptions);

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

    async updatePassword(role: UserRole, data: UpdatePasswordData, requestOptions: RequestInit & { skipAuthRedirect?: boolean } = {}) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/update-password' : '/carrier/update-password';

      try {
        const response = await api.patch<{ message: string }>(endpoint, data, requestOptions);

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

    async updateEmail(role: UserRole, data: UpdateEmailData, requestOptions: RequestInit & { skipAuthRedirect?: boolean } = {}) {
      this.isLoading = true;
      this.error = null;

      const api = useAPI();
      const endpoint = role === 'shipper' ? '/shipper/update-email' : '/carrier/update-email';

      try {
        const response = await api.patch<{ message: string }>(endpoint, {
          email: data.newEmail,
          password: data.password
        }, requestOptions);

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
     * Récupérer les véhicules
     */
    async fetchVehicles(requestOptions: RequestInit & { skipAuthRedirect?: boolean } = {}) {
      this.vehiclesLoading = true;
      const api = useAPI();

      try {
        const response = await api.get<{ vehicles: Vehicle[] }>('/carrier/vehicles', requestOptions);
        if (response.success && response.data?.vehicles) {
          this.vehicles = response.data.vehicles;
          return { success: true, vehicles: this.vehicles };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors du chargement des véhicules' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Ajouter un véhicule
     */
    async addVehicle(data: AddVehicleData) {
      this.vehiclesLoading = true;
      const api = useAPI();

      try {
        const response = await api.post<{ message: string; vehicle: Vehicle }>('/carrier/vehicle', data);
        if (response.success && response.data?.vehicle) {
          this.vehicles.push(response.data.vehicle);
          return { success: true, message: response.data.message };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors de l\'ajout du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Supprimer un véhicule
     */
    async deleteVehicle(id: string) {
      const api = useAPI();
      try {
        const response = await api.del<{ message: string }>(`/carrier/vehicle/${id}`);
        if (response.success) {
          this.vehicles = this.vehicles.filter(v => v.id !== id);
          return { success: true, message: response.data?.message || 'Véhicule supprimé' };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors de la suppression' };
      }
    },

    /**
     * Récupérer un véhicule spécifique
     */
    async fetchVehicle(id: string) {
      this.vehiclesLoading = true;
      const api = useAPI();

      try {
        const response = await api.get<{ vehicle: Vehicle; availability: Availability | null; history: Availability[] }>(`/carrier/vehicle/${id}`);
        if (response.success && response.data) {
          return {
            success: true,
            vehicle: {
              ...response.data.vehicle,
              availability: response.data.availability,
              history: response.data.history
            }
          };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors du chargement du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Envoyer un document KYC
     */
    async uploadKycDocument(type: string, file: File) {
      this.isLoading = true;
      this.error = null;
      const api = useAPI();

      try {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('document', file);

        const response = await api.post<{ message: string; document: any }>('/carrier/kyc', formData);

        if (response.success && response.data) {
          // Refresh profile to get updated kycDocuments
          await this.fetchProfile('carrier');
          return { success: true, message: response.data.message };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors de l\'envoi du document' };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Mettre à jour un véhicule
     */
    async updateVehicle(id: string, data: Partial<AddVehicleData>) {
      this.vehiclesLoading = true;
      const api = useAPI();

      try {
        const response = await api.patch<{ message: string; vehicle: Vehicle }>(`/carrier/vehicle/${id}`, data);
        if (response.success && response.data?.vehicle) {
          // Update local state
          const index = this.vehicles.findIndex(v => v.id === id);
          if (index !== -1) {
            this.vehicles[index] = response.data.vehicle;
          }
          return { success: true, message: response.data.message };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors de la mise à jour du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    /**
     * Mettre à jour le statut d'un véhicule
     */
    async updateVehicleStatus(id: string, status: 'available' | 'in_transit' | 'maintenance') {
      const api = useAPI(); // Don't block UI with global loading for status toggle

      try {
        const response = await api.patch<{ message: string; vehicle: Vehicle }>(`/carrier/vehicle/${id}/status`, { status });
        if (response.success && response.data?.vehicle) {
          // Update local state
          const index = this.vehicles.findIndex(v => v.id === id);
          if (index !== -1) {
            this.vehicles[index] = response.data.vehicle;
          }
          return { success: true, message: response.data.message, vehicle: response.data.vehicle };
        } else {
          return { success: false, error: this.extractErrorMessage(response.error) };
        }
      } catch (e) {
        return { success: false, error: 'Erreur lors de la mise à jour du statut' };
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

      if (error.data) {
        const errorData = error.data as Record<string, unknown>;

        // Chercher dans les différentes structures d'erreur
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
