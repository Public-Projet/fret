import { defineStore } from 'pinia';
import { useAPI } from '~/composables/useAPI';
import { useUserStore } from '~/stores/user';
import type { Vehicle } from '~/stores/profile';

export interface Location {
  city: string;
  country: string;
  address?: string;
  postalCode?: string;
}

export interface Availability {
  id: string;
  vehicle: Vehicle;
  origin: Location;
  destination?: Location;
  startDate: string;
  endDate: string;
  price?: number;
  status: 'active' | 'expired' | 'full' | 'prolonged';
  maxRequests?: number;
  currentRequests: number;
  createdAt: string;
  carrier?: {
    id: string;
    firstname: string;
    lastname: string;
    photoUrl?: string;
    rating?: number;
    reviewsCount?: number;
    myReview?: { score: number; comment?: string } | null;
  };
  bookings?: any[];
  myReview?: { score: number; comment?: string } | null;
}

export interface CreateAvailabilityData {
  vehicleId: string;
  origin: Location;
  destination?: Location;
  startDate: string;
  endDate: string;
  price?: number;
  maxRequests?: number;
}

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
      const api = useAPI();
      try {
        const response = await api.get<{ availabilities: Availability[] }>('/public/availabilities');
        if (response.success && response.data) {
          const userStore = useUserStore();
          this.availabilities = response.data.availabilities.map(a => {
            if (a.carrier) {
              if (a.carrier.myReview) {
                userStore.myReviews[a.carrier.id] = a.carrier.myReview;
              } else if (userStore.myReviews[a.carrier.id]) {
                a.carrier.myReview = userStore.myReviews[a.carrier.id];
              }
            }
            return a;
          });
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
      const api = useAPI();
      try {
        const response = await api.get<{ availability: Availability }>(`/public/availabilities/${id}`);
        if (response.success && response.data) {
          const avail = response.data.availability;
          const userStore = useUserStore();
          if (avail.carrier) {
            if (avail.carrier.myReview) {
              userStore.myReviews[avail.carrier.id] = avail.carrier.myReview;
            } else if (userStore.myReviews[avail.carrier.id]) {
              avail.carrier.myReview = userStore.myReviews[avail.carrier.id];
            }
          }
          return { success: true, availability: avail };
        }
        return { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    /**
     * Expéditeur: S'inscrire à une disponibilité
     */
    async enrollAvailability(id: string, negotiationData: any = {}) {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.post(`/shipper/availabilities/${id}/enroll`, {
          notes: negotiationData.message,
          proposedPrice: negotiationData.price,
          proposedOrigin: negotiationData.origin,
          proposedDestination: negotiationData.destination,
        });
        if (response.success) {
          return { success: true };
        }
        return { success: false, error: this.extractErrorMessage(response.error) };
      } catch (err) {
        return { success: false, error: 'Erreur technique lors de l\'inscription' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Expéditeur: Liste de mes inscriptions
     */
    async fetchShipperEnrollments() {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.get<{ enrollments: any[] }>('/shipper/enrollments');
        if (response.success && response.data) {
          this.enrollments = response.data.enrollments;
        }
      } catch (err) {
        console.error('Failed to fetch shipper enrollments', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchAvailabilities() {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.get<{ availabilities: Availability[] }>('/carrier/availability');
        if (response.success && response.data) {
          const userStore = useUserStore();
          this.availabilities = response.data.availabilities.map(a => {
            if (a.carrier) {
              if (a.carrier.myReview) {
                userStore.myReviews[a.carrier.id] = a.carrier.myReview;
              } else if (userStore.myReviews[a.carrier.id]) {
                a.carrier.myReview = userStore.myReviews[a.carrier.id];
              }
            }
            return a;
          });
        }
      } catch (err) {
        console.error('Failed to fetch availabilities', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchAvailability(id: string) {
      const api = useAPI();
      try {
        const response = await api.get<{ availability: Availability }>(`/carrier/availability/${id}`);
        if (response.success && response.data) {
          const avail = response.data.availability;
          const userStore = useUserStore();
          if (avail.carrier) {
            if (avail.carrier.myReview) {
              userStore.myReviews[avail.carrier.id] = avail.carrier.myReview;
            } else if (userStore.myReviews[avail.carrier.id]) {
              avail.carrier.myReview = userStore.myReviews[avail.carrier.id];
            }
          }
          return { success: true, availability: avail };
        }
        return { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async updateAvailability(id: string, data: Partial<CreateAvailabilityData> & { status?: string }) {
      const api = useAPI();
      try {
        const response = await api.patch<{ availability: Availability }>(`/carrier/availability/${id}`, data);
        if (response.success && response.data?.availability) {
          // Update list if exists
          const index = this.availabilities.findIndex(a => a.id === id);
          if (index !== -1) {
            this.availabilities[index] = response.data.availability;
          }
          return { success: true, availability: response.data.availability };
        }
        return { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async addAvailability(data: CreateAvailabilityData) {
      const api = useAPI();
      try {
        const response = await api.post<{ availability: Availability }>('/carrier/availability', data);
        if (response.success && response.data?.availability) {
          this.availabilities.unshift(response.data.availability);
          return { success: true };
        }
        return { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async deleteAvailability(id: string) {
      const api = useAPI();
      try {
        const response = await api.del(`/carrier/availability/${id}`);
        if (response.success) {
          this.availabilities = this.availabilities.filter(a => a.id !== id);
          return { success: true };
        }
        return { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async acceptBooking(bookingId: string) {
      const api = useAPI();
      try {
        const response = await api.post(`/carrier/booking/${bookingId}/accept`);
        return response.success ? { success: true } : { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async rejectBooking(bookingId: string) {
      const api = useAPI();
      try {
        const response = await api.post(`/carrier/booking/${bookingId}/reject`);
        return response.success ? { success: true } : { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async counterBooking(bookingId: string, role: 'shipper' | 'carrier', data: any) {
      const api = useAPI();
      const endpoint = role === 'shipper' ? `/shipper/booking/${bookingId}/counter` : `/carrier/booking/${bookingId}/counter`;
      try {
        const response = await api.post(endpoint, data);
        return response.success ? { success: true } : { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    extractErrorMessage(error: any): string {
      if (error?.data?.message) return error.data.message;
      if (error?.message) return error.message;
      return 'Une erreur est survenue';
    }
  }
});
