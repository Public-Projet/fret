import { defineStore } from 'pinia';
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
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/carrier/availability/mine`);
        if (response?.availability) {
          return { success: true, availability: response.availability };
        }
        return { success: false, error: 'Disponibilité non trouvée' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    // Modifier une disponibilité
    async updateCarAvailability(id: string, data: Partial<CreateAvailabilityData> & { status?: string }) {
      try {
        const response = await $fetch<{ availability: Availability }>(`/api/carrier/availability/update`, {
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

    // Supprimer une disponibilité
    async deleteCarAvailability(id: string) {
      try {
        await ($fetch as any)(`/api/carrier/availability/remove`, { method: 'DELETE' });
        this.availabilities = this.availabilities.filter(a => a.id !== id);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    // Accepter une proposition de disponibilité    
    async acceptCarBooking(bookingId: string) {
      try {
        await $fetch(`/api/carrier/availability/booking-accept`, { method: 'POST' });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    // Rejeter une proposition de disponibilité    
    async rejectCarBooking(bookingId: string) {
      try {
        await $fetch(`/api/carrier/availability/booking-reject`, { method: 'POST' });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    //  Contre proposé une proposition
    async counterCarBooking(bookingId: string, role: 'shipper' | 'carrier', data: any) {
      try {
        await $fetch(`/api/carrier/availability/booking-counter`, {
          method: 'POST',
          body: { ...data, role },
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },
























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
