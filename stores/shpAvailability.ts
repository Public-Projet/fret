import { defineStore } from 'pinia';
import { extractErrorMessage } from '~/utils/error';
import type { StoreAvailability as Availability, StoreLocation as Location, CreateAvailabilityData, } from '~/types';
export type { Availability, Location, CreateAvailabilityData };

export const useShpAvailabilityStore = defineStore('shpAvailability', {
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
    // S'inscrire à une disponibilité
    async enrollShpAvailability(id: string, negotiationData: any = {}) {
      this.loading = true;
      try {
        await $fetch(`/api/shipper/availability/enroll`, {
          method: 'POST',
          body: {
            id,
            notes: negotiationData.message,
            proposedPrice: negotiationData.price,
            proposedOrigin: negotiationData.origin,
            proposedDestination: negotiationData.destination,
          },
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique lors de l\'inscription' };
      } finally {
        this.loading = false;
      }
    },

    // Liste des inscriptions
    async fetchShpEnrollments() {
      this.loading = true;
      try {
        const response = await $fetch<{ enrollments: any[] }>('/api/shipper/availability/list');
        if (response?.enrollments) {
          this.enrollments = response.enrollments;
        }
      } catch (err) {
        console.error('Failed to fetch shipper enrollments', err);
      } finally {
        this.loading = false;
      }
    },

    // Détails d'une disponibilité
    async fetchShpMineAvailability(id: string) {
      this.loading = true;
      try {
        const response = await $fetch<{ data: Availability }>(`/api/shipper/availability/mine`, {
          query: { id }
        });
        if (response?.data) {
          return { success: true, availability: response.data };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    // Contre-proposer une proposition
    async counterShpBooking(bookingId: string, data: any) {
      this.loading = true;
      try {
        await $fetch(`/api/shipper/availability/counter`, {
          method: 'POST',
          body: { ...data, id: bookingId },
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },
  }
});
