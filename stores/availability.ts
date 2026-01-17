import { defineStore } from 'pinia';
import { useAPI } from '~/composables/useAPI';
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
  status: 'active' | 'expired' | 'full';
  maxRequests?: number;
  currentRequests: number;
  createdAt: string;
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
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchAvailabilities() {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.get<{ availabilities: Availability[] }>('/carrier/availability');
        if (response.success && response.data) {
          this.availabilities = response.data.availabilities;
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
          return { success: true, availability: response.data.availability };
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
    }
  }
});
