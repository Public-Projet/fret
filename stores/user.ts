import { defineStore } from 'pinia';
import { useAPI } from '~/composables/useAPI';

export interface PublicUser {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  photoUrl?: string;
  bio?: string;
  rating: number;
  reviewsCount: number;
  kycStatus: string;
  role: 'carrier' | 'shipper';
}

export const useUserStore = defineStore('user', {
  state: () => ({
    carriers: [] as PublicUser[],
    shippers: [] as PublicUser[],
    currentUserProfile: null as PublicUser | null,
    loading: false,
    error: null as string | null,
    totalCarriers: 0,
    totalShippers: 0
  }),

  actions: {
    async fetchPublicCarriers(params: { page?: number; limit?: number; search?: string } = {}) {
      this.loading = true;
      const api = useAPI();
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);

      const result = await api.get<{ carriers: PublicUser[]; total: number }>(`/public/carriers?${query.toString()}`);
      this.loading = false;
      if (result.success && result.data) {
        this.carriers = result.data.carriers;
        this.totalCarriers = result.data.total;
      }
      return result;
    },

    async fetchPublicShippers(params: { page?: number; limit?: number; search?: string } = {}) {
      this.loading = true;
      const api = useAPI();
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);

      const result = await api.get<{ shippers: PublicUser[]; total: number }>(`/public/shippers?${query.toString()}`);
      this.loading = false;
      if (result.success && result.data) {
        this.shippers = result.data.shippers;
        this.totalShippers = result.data.total;
      }
      return result;
    },

    async fetchPublicProfile(id: string, role: 'carrier' | 'shipper') {
      this.loading = true;
      const api = useAPI();
      const endpoint = role === 'carrier' ? `/public/carriers/${id}` : `/public/shippers/${id}`;
      const result = await api.get<{ carrier?: PublicUser; shipper?: PublicUser }>(endpoint);
      this.loading = false;
      if (result.success && result.data) {
        this.currentUserProfile = role === 'carrier' ? (result.data.carrier || null) : (result.data.shipper || null);
      }
      return result;
    },

    async rateCarrier(carrierId: string, score: number, comment?: string) {
      const api = useAPI();
      const result = await api.post<{ rating: number; reviewsCount: number }>(`/shipper/rate/${carrierId}`, { score, comment });
      return result;
    },

    async rateShipper(shipperId: string, score: number, comment?: string) {
      const api = useAPI();
      const result = await api.post<{ rating: number; reviewsCount: number }>(`/carrier/rate/${shipperId}`, { score, comment });
      return result;
    }
  }
});
