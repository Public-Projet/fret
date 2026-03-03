import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus } from '~/types';
import { useUserStore } from '~/stores/user';
import { useAPI } from '~/composables/useAPI';

interface AnnouncementState {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  filters: AnnouncementFilters;
  loading: boolean;
}

export const useAnnouncementStore = defineStore('announcement', {
  state: (): AnnouncementState => ({
    announcements: [],
    currentAnnouncement: null,
    filters: {},
    loading: false,
  }),

  getters: {
    /**
     * Récupérer toutes les annonces
     */
    allAnnouncements: (state) => state.announcements,

    /**
     * Récupérer les annonces filtrées
     */
    filteredAnnouncements: (state) => {
      let filtered = [...state.announcements];

      if (state.filters.cargoType) {
        filtered = filtered.filter(a => a.cargoType === state.filters.cargoType);
      }

      if (state.filters.status) {
        filtered = filtered.filter(a => a.status === state.filters.status);
      }

      if (state.filters.minBudget) {
        filtered = filtered.filter(a => a.budget >= state.filters.minBudget!);
      }

      if (state.filters.maxBudget) {
        filtered = filtered.filter(a => a.budget <= state.filters.maxBudget!);
      }

      if (state.filters.minDistance) {
        filtered = filtered.filter(a => (a.distance || 0) >= state.filters.minDistance!);
      }

      if (state.filters.maxDistance) {
        filtered = filtered.filter(a => (a.distance || 0) <= state.filters.maxDistance!);
      }

      if (state.filters.originCity) {
        filtered = filtered.filter(a =>
          a.origin.city.toLowerCase().includes(state.filters.originCity!.toLowerCase())
        );
      }

      if (state.filters.destinationCity) {
        filtered = filtered.filter(a =>
          a.destination.city.toLowerCase().includes(state.filters.destinationCity!.toLowerCase())
        );
      }

      return filtered;
    },

    /**
     * Récupérer les annonces d'un utilisateur
     */
    userAnnouncements: (state) => (userId: string) => {
      return state.announcements.filter(a => a.userId === userId);
    },

    /**
     * Récupérer les annonces par statut
     */
    announcementsByStatus: (state) => (status: AnnouncementStatus) => {
      return state.announcements.filter(a => a.status === status);
    },
  },

  actions: {
    /**
     * Charger toutes les annonces
     */
    async fetchAnnouncements(queryParams: any = {}) {
      this.loading = true;
      const api = useAPI();
      const userStore = useUserStore();

      try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/public/announcements${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<{ announcements: Announcement[], total: number }>(url);

        if (response.success && response.data) {
          const { announcements } = response.data;
          this.announcements = announcements.map((a) => {
            const shipperId = typeof a.shipper === 'object' && a.shipper !== null ? a.shipper.id : a.shipper;
            if (shipperId && !a.userId) a.userId = shipperId;

            if (a.shipper && typeof a.shipper === 'object' && (a.shipper as any).myReview) {
              userStore.myReviews[a.shipper.id] = (a.shipper as any).myReview;
            }

            return a;
          });
          return { success: true, total: response.data.total };
        }
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        return { success: false, error };
      } finally {
        this.loading = false;
      }
      return { success: false };
    },

    /**
     * Charger les annonces de l'utilisateur connecté (Shipper)
     */
    async fetchMyAnnouncements() {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.get<Announcement[]>('/shipper/announcement');
        if (response.success && response.data) {
          this.announcements = response.data.map((a) => {
            // Extract shipper ID correctly whether it's an object or a string
            const shipperId = typeof a.shipper === 'object' && a.shipper !== null ? a.shipper.id : a.shipper;
            if (shipperId && !a.userId) a.userId = shipperId;
            return a;
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de mes annonces:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Charger une annonce par ID
     */
    async fetchAnnouncementById(id: string) {
      this.loading = true;
      const api = useAPI();
      const userStore = useUserStore();

      try {
        const response = await api.get<Announcement>(`/public/announcements/${id}`);

        if (response.success && response.data) {
          const announcement = response.data;
          if (announcement.shipper && !announcement.userId) announcement.userId = announcement.shipper.id;

          if (announcement.shipper && (announcement.shipper as any).myReview) {
            userStore.myReviews[announcement.shipper.id] = (announcement.shipper as any).myReview;
          }

          this.currentAnnouncement = announcement;
          return { success: true, announcement };
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'annonce:', error);
      } finally {
        this.loading = false;
      }

      return { success: false, error: 'Annonce non trouvée' };
    },

    /**
     * Créer une nouvelle annonce
     */
    async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.post<Announcement>('/shipper/announcement', announcementData);
        if (response.success && response.data) {
          const newAnnouncement = response.data;
          this.announcements.unshift(newAnnouncement);
          return { success: true, announcement: newAnnouncement };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la création de l\'annonce:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Mettre à jour une annonce
     */
    async updateAnnouncement(id: string, updates: Partial<Announcement>) {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.patch<Announcement>(`/shipper/announcement/${id}`, updates);
        if (response.success && response.data) {
          const updated = response.data;
          const index = this.announcements.findIndex(a => a.id === id);
          if (index !== -1) {
            this.announcements[index] = updated;
          }
          if (this.currentAnnouncement?.id === id) {
            this.currentAnnouncement = updated;
          }
          return { success: true, announcement: updated };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'annonce:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprimer une annonce
     */
    async deleteAnnouncement(id: string) {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.del(`/shipper/announcement/${id}`);
        if (response.success) {
          this.announcements = this.announcements.filter(a => a.id !== id);
          if (this.currentAnnouncement?.id === id) {
            this.currentAnnouncement = null;
          }
          return { success: true };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'annonce:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Mettre à jour les filtres
     */
    setFilters(filters: AnnouncementFilters) {
      this.filters = filters;
    },

    /**
     * Réinitialiser les filtres
     */
    resetFilters() {
      this.filters = {};
    },

    /**
     * Changer le statut d'une annonce
     */
    async updateStatus(id: string, status: AnnouncementStatus) {
      return this.updateAnnouncement(id, { status });
    },

    /**
     * Transporteur: Faire une offre sur une annonce
     */
    async createOffer(announcementId: string, negotiationData: any) {
      this.loading = true;
      const api = useAPI();
      try {
        const response = await api.post(`/carrier/announcement/${announcementId}/offer`, {
          price: negotiationData.price,
          message: negotiationData.message,
          proposedOrigin: negotiationData.origin,
          proposedDestination: negotiationData.destination,
        });
        if (response.success) {
          return { success: true };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la création de l\'offre:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    async acceptOffer(offerId: string) {
      const api = useAPI();
      try {
        const response = await api.post(`/shipper/offer/${offerId}/accept`);
        return response.success ? { success: true } : { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },

    async rejectOffer(offerId: string) {
      const api = useAPI();
      try {
        const response = await api.post(`/shipper/offer/${offerId}/reject`);
        return response.success ? { success: true } : { success: false, error: response.error };
      } catch (err) {
        return { success: false, error: 'Erreur technique' };
      }
    },
  },
});
