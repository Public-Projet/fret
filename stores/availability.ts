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

    async fetchAvailabilities() {
      this.loading = true;
      try {
        const response = await $fetch<{ availabilities: Availability[] }>('/api/availabilities/mine');
        if (response?.availabilities) {
          this.availabilities = response.availabilities;
        }
      } catch (err) {
        console.error('Failed to fetch availabilities', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchAvailability(id: string) {
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/availabilities/mine/${id}`);
        if (response?.availability) {
          return { success: true, availability: response.availability };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async updateAvailability(id: string, data: Partial<CreateAvailabilityData> & { status?: string }) {
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/availabilities/${id}`, {
          method: 'PATCH',
          body: data,
        });
        if (response?.availability) {
          const index = this.availabilities.findIndex(a => a.id === id);
          if (index !== -1) {
            this.availabilities[index] = response.availability;
          }
          return { success: true, availability: response.availability };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async addAvailability(data: CreateAvailabilityData) {
      try {
        const response = await $fetch<{ availability: Availability }>('/api/availabilities', {
          method: 'POST',
          body: data,
        });
        if (response?.availability) {
          this.availabilities.unshift(response.availability);
          return { success: true };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async deleteAvailability(id: string) {
      try {
        await $fetch(`/api/availabilities/${id}`, { method: 'DELETE' });
        this.availabilities = this.availabilities.filter(a => a.id !== id);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async acceptBooking(bookingId: string) {
      try {
        await $fetch(`/api/bookings/${bookingId}/accept`, { method: 'POST' });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async rejectBooking(bookingId: string) {
      try {
        await $fetch(`/api/bookings/${bookingId}/reject`, { method: 'POST' });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async counterBooking(bookingId: string, role: 'shipper' | 'carrier', data: any) {
      try {
        await $fetch(`/api/bookings/${bookingId}/counter`, {
          method: 'POST',
          body: { ...data, role },
        });
        return { success: true };
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
