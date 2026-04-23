import { defineStore } from 'pinia';
import type { StoreAvailability as Availability, StoreLocation as Location, CreateAvailabilityData, } from '~/types';
export type { Availability, Location, CreateAvailabilityData };

export const useAvailabilityStore = defineStore('availability', {
  state: () => ({
    availabilities: [] as Availability[],
    enrollments: [] as any[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    isEnrolled: (state) => (availabilityId: string | number) => {
      const idStr = String(availabilityId);
      return state.enrollments.some(e => String(e.availability?.id) === idStr && e.status !== 'cancelled');
    }
  },

  actions: {
    /**
     * Publique: Liste des disponibilités
     */
    async fetchPublicAvailabilities() {
      this.loading = true;
      try {
        const response = await $fetch<{ availabilities: Availability[] }>('/api/availabilities');
        if (response?.availabilities) {
          this.availabilities = response.availabilities;
        }
      } catch (err) {
        console.error('Failed to fetch public availabilities', err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Publique: Une disponibilité
     */
    async fetchPublicAvailability(id: string) {
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/availabilities/${id}`);
        if (response?.availability) {
          return { success: true, availability: response.availability };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    /**
     * Expéditeur: S'inscrire à une disponibilité
     */
    async enrollAvailability(id: string, negotiationData: any = {}) {
      this.loading = true;
      try {
        await ($fetch as any)(`/api/availabilities/${id}/enroll`, {
          method: 'POST',
          body: {
            notes: negotiationData.message,
            proposedPrice: negotiationData.price,
            proposedOrigin: negotiationData.origin,
            proposedDestination: negotiationData.destination,
          },
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique lors de l\'inscription' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Expéditeur: Liste de mes inscriptions
     */
    async fetchShipperEnrollments() {
      this.loading = true;
      try {
        const response = await $fetch<{ enrollments: any[] }>('/api/availabilities/enrollments');
        if (response?.enrollments) {
          this.enrollments = response.enrollments;
        }
      } catch (err) {
        console.error('Failed to fetch shipper enrollments', err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Expéditeur: Une disponibilité
     */
    async fetchShipperAvailabilityById(id: string) {
      try {
        const response = await $fetch<{ data: Availability }>(`/api/shipper/availabilities/${id}`);
        if (response?.data) {
          return { success: true, availability: response.data };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    extractErrorMessage(error: any): string {
      if (error?.data?.message) return error.data.message;
      if (error?.message) return error.message;
      return 'Une erreur est survenue';
    }
  }
});
