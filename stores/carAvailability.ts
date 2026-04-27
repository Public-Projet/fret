import { defineStore } from 'pinia';
import { extractErrorMessage } from '~/utils/error';
import type { StoreAvailability as Availability, StoreLocation as Location, CreateAvailabilityData, } from '~/types';
export type { Availability, Location, CreateAvailabilityData };

export const useCarAvailabilityStore = defineStore('carAvailability', {
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
    // Ajouter une disponibilité
    async addCarAvailability(data: CreateAvailabilityData) {
      try {
        const response = await $fetch<{ availability: Availability }>('/api/carrier/availability/add', {
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

    // Lister les disponibilités
    async fetchCarAvailabilities() {
      this.loading = true;
      try {
        const response = await $fetch<{ availabilities: Availability[] }>('/api/carrier/availability/list');
        if (response?.availabilities) {
          this.availabilities = response.availabilities;
        }
      } catch (err) {
        console.error('Failed to fetch availabilities', err);
      } finally {
        this.loading = false;
      }
    },

    // Obtenir une disponibilité
    async fetchCarAvailability(id: string) {
      this.loading = true;
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/carrier/availability/mine`, {
          query: { id }
        });
        if (response?.availability) {
          return { success: true, availability: response.availability };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    // Modifier une disponibilité
    async updateCarAvailability(id: string, data: Partial<CreateAvailabilityData> & { status?: string }) {
      this.loading = true;
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/carrier/availability/update`, {
          method: 'PATCH',
          body: { ...data, id },
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
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    // Supprimer une disponibilité
    async deleteCarAvailability(id: string) {
      this.loading = true;
      try {
        await $fetch(`/api/carrier/availability/remove`, {
          method: 'DELETE',
          query: { id }
        });
        this.availabilities = this.availabilities.filter(a => a.id !== id);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    // Accepter une proposition de disponibilité    
    async acceptCarBooking(bookingId: string) {
      this.loading = true;
      try {
        await $fetch(`/api/carrier/availability/booking-accept`, {
          method: 'POST',
          body: { id: bookingId }
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    // Rejeter une proposition de disponibilité    
    async rejectCarBooking(bookingId: string) {
      this.loading = true;
      try {
        await $fetch(`/api/carrier/availability/booking-reject`, {
          method: 'POST',
          body: { id: bookingId }
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: extractErrorMessage(err) || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    //  Contre proposé une proposition
    async counterCarBooking(bookingId: string, role: 'shipper' | 'carrier', data: any) {
      this.loading = true;
      try {
        await $fetch(`/api/carrier/availability/booking-counter`, {
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
