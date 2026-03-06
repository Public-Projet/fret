import { defineStore } from 'pinia';
import type { PublicUser } from '~/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    carriers: [] as PublicUser[],
    shippers: [] as PublicUser[],
    currentUserProfile: null as PublicUser | null,
    loading: false,
    error: null as string | null,
    totalCarriers: 0,
    totalShippers: 0,
    myReviews: {} as Record<string, { score: number, comment?: string } | null>
  }),

  actions: {
    async fetchPublicCarriers(params: { page?: number; limit?: number; search?: string } = {}) {
      this.loading = true;
      try {
        const query: Record<string, string> = { role: 'carriers' };
        if (params.page) query.page = params.page.toString();
        if (params.limit) query.limit = params.limit.toString();
        if (params.search) query.search = params.search;

        const result = await $fetch<{ carriers: PublicUser[]; total: number }>('/api/users', { query });

        if (result?.carriers) {
          this.carriers = result.carriers;
          this.totalCarriers = result.total;
        }
        this.loading = false;
        return { success: true, data: result };
      } catch (err: any) {
        this.loading = false;
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async fetchPublicShippers(params: { page?: number; limit?: number; search?: string } = {}) {
      this.loading = true;
      try {
        const query: Record<string, string> = { role: 'shippers' };
        if (params.page) query.page = params.page.toString();
        if (params.limit) query.limit = params.limit.toString();
        if (params.search) query.search = params.search;

        const result = await $fetch<{ shippers: PublicUser[]; total: number }>('/api/users', { query });

        if (result?.shippers) {
          this.shippers = result.shippers;
          this.totalShippers = result.total;
        }
        this.loading = false;
        return { success: true, data: result };
      } catch (err: any) {
        this.loading = false;
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async fetchPublicProfile(id: string, role: 'carrier' | 'shipper') {
      this.loading = true;
      try {
        const pluralRole = role === 'carrier' ? 'carriers' : 'shippers';
        const result = await $fetch<{ carrier?: PublicUser; shipper?: PublicUser }>(`/api/users/${id}`, {
          query: { role: pluralRole },
        });

        if (result) {
          this.currentUserProfile = role === 'carrier' ? (result.carrier || null) : (result.shipper || null);
        }
        this.loading = false;
        return { success: true, data: result };
      } catch (err: any) {
        this.loading = false;
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async rateCarrier(carrierId: string, score: number, comment?: string) {
      try {
        const result = await $fetch<{ rating: number; reviewsCount: number }>(`/api/users/${carrierId}/rate`, {
          method: 'POST',
          body: { role: 'shipper', score, comment },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (result) {
          this.myReviews[carrierId] = { score, comment };
          return { success: true, data: result };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    },

    async rateShipper(shipperId: string, score: number, comment?: string) {
      try {
        const result = await $fetch<{ rating: number; reviewsCount: number }>(`/api/users/${shipperId}/rate`, {
          method: 'POST',
          body: { role: 'carrier', score, comment },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (result) {
          this.myReviews[shipperId] = { score, comment };
          return { success: true, data: result };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (err: any) {
        return { success: false, error: err?.data?.message || 'Erreur technique' };
      }
    }
  }
});
