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

    extractErrorMessage(error: any): string {
      if (error?.data?.message) return error.data.message;
      if (error?.message) return error.message;
      return 'Une erreur est survenue';
    }
  }
});
