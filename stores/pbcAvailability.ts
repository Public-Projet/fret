import { defineStore } from 'pinia';
import { extractErrorMessage } from '~/utils/error';
import type { StoreAvailability as Availability, StoreLocation as Location, CreateAvailabilityData, } from '~/types';
export type { Availability, Location, CreateAvailabilityData };

export const usePbcAvailabilityStore = defineStore('pbcAvailability', {
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
    // Liste publique des disponibilités
    async fetchPbcAvailabilities() {
      this.loading = true;
      try {
        const response = await $fetch<{ availabilities: Availability[] }>('/api/public/availability/list');
        if (response?.availabilities) {
          this.availabilities = response.availabilities;
        }
      } catch (err) {
        console.error('Failed to fetch public availabilities', err);
      } finally {
        this.loading = false;
      }
    },

    // Détails d'une disponibilité
    async fetchPbcMineAvailability(id: string) {
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/public/availability/mine`, {
          query: { id }
        });
        if (response?.availability) {
          return { success: true, availability: response.availability };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      }
    },
  }
});
