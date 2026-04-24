import { defineStore } from 'pinia';
import { extractErrorMessage } from '~/utils/error';
import type { Vehicle, AddVehicleData, StoreAvailability as Availability, } from '~/types';

interface ProfileState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  vehiclesLoading: boolean;
}

export const useCarVehiclesStore = defineStore('carVehicles', {
  state: (): ProfileState => ({
    vehicles: [],
    isLoading: false,
    error: null,
    vehiclesLoading: false,
  }),

  getters: {
    vehicleCount: (state) => state.vehicles.length,
  },

  actions: {
    // Ajouter un vehicule
    async addCarVehicle(data: AddVehicleData) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ message: string; vehicle: Vehicle }>('/api/carrier/vehicles/add', {
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
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors de l\'ajout du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    // Lister les véhicules
    async fetchCarVehicles(_requestOptions: any = {}) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ vehicles: Vehicle[] }>('/api/carrier/vehicles/list', {
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

    // Obtenir les détails d'un véhicule
    async fetchCarVehicle(id: string) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ vehicle: Vehicle; availability: Availability | null; history: Availability[] }>(`/api/carrier/vehicles/mine`, {
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

    // Mettre à jour un véhicule
    async updateCarVehicleDetail(id: string, data: Partial<AddVehicleData>) {
      this.vehiclesLoading = true;

      try {
        const response = await $fetch<{ message: string; vehicle: Vehicle }>(`/api/carrier/vehicles/update-vehicle`, {
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
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors de la mise à jour du véhicule' };
      } finally {
        this.vehiclesLoading = false;
      }
    },

    // Mettre à jour le status d'un véhicule
    async updateCarVehicleStatus(id: string, status: 'available' | 'in_transit' | 'maintenance') {
      try {
        const response = await $fetch<{ message: string; vehicle: Vehicle }>(`/api/carrier/vehicles/update-status`, {
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
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors de la mise à jour du statut' };
      }
    },

    // Supprimer un véhicule
    async deleteCarVehicle(id: string) {
      try {
        const response = await $fetch<{ message: string }>(`/api/carrier/vehicles/remove`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        this.vehicles = this.vehicles.filter(v => v.id !== id);
        return { success: true, message: response?.message || 'Véhicule supprimé' };
      } catch (e: any) {
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors de la suppression' };
      }
    },

    /**
     * Réinitialiser le store
     */
    reset() {
      this.vehicles = [];
      this.isLoading = false;
      this.error = null;
    },
  },
});
