import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus } from '~/types';

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

      try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/api/announcements${queryString ? `?${queryString}` : ''}`;

        const response = await $fetch<{ announcements: Announcement[], total: number }>(url);

        const { announcements } = response;
        this.announcements = announcements.map((a) => {
          const shipperId = typeof a.shipper === 'object' && a.shipper !== null ? a.shipper.id : a.shipper;
          if (shipperId && !a.userId) a.userId = shipperId;
          return a;
        });
        return { success: true, total: response.total };
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        return { success: false, error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Charger les annonces de l'utilisateur connecté (Shipper)
     */
    async fetchMyAnnouncements() {
      this.loading = true;
      try {
        const response = await $fetch<Announcement[]>('/api/announcements/mine');
        this.announcements = (Array.isArray(response) ? response : []).map((a) => {
          const shipperId = typeof a.shipper === 'object' && a.shipper !== null ? a.shipper.id : a.shipper;
          if (shipperId && !a.userId) a.userId = shipperId;
          return a;
        });
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
      try {
        const response = await $fetch<Announcement>(`/api/announcements/${id}`);
        const announcement = response;
        if (announcement.shipper && !announcement.userId) announcement.userId = announcement.shipper.id;
        this.currentAnnouncement = announcement;
        return { success: true, announcement };
      } catch (error) {
        console.error('Erreur lors du chargement de l\'annonce:', error);
        return { success: false, error: 'Annonce non trouvée' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Créer une nouvelle annonce
     */
    async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      this.loading = true;
      try {
        const newAnnouncement = await $fetch<Announcement>('/api/announcements', {
          method: 'POST',
          body: announcementData,
        });
        this.announcements.unshift(newAnnouncement);
        return { success: true, announcement: newAnnouncement };
      } catch (error: any) {
        console.error('Erreur lors de la création de l\'annonce:', error);
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Mettre à jour une annonce
     */
    async updateAnnouncement(id: string, updates: Partial<Announcement>) {
      this.loading = true;
      try {
        const updated = await $fetch<Announcement>(`/api/announcements/${id}`, {
          method: 'PATCH',
          body: updates,
        });
        const index = this.announcements.findIndex(a => a.id === id);
        if (index !== -1) {
          this.announcements[index] = updated;
        }
        if (this.currentAnnouncement?.id === id) {
          this.currentAnnouncement = updated;
        }
        return { success: true, announcement: updated };
      } catch (error: any) {
        console.error('Erreur lors de la mise à jour de l\'annonce:', error);
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprimer une annonce
     */
    async deleteAnnouncement(id: string) {
      this.loading = true;
      try {
        await $fetch(`/api/announcements/${id}`, { method: 'DELETE' });
        this.announcements = this.announcements.filter(a => a.id !== id);
        if (this.currentAnnouncement?.id === id) {
          this.currentAnnouncement = null;
        }
        return { success: true };
      } catch (error: any) {
        console.error('Erreur lors de la suppression de l\'annonce:', error);
        return { success: false, error: error?.data?.message || 'Erreur technique' };
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
      try {
        await $fetch(`/api/announcements/${announcementId}/offer`, {
          method: 'POST',
          body: {
            price: negotiationData.price,
            message: negotiationData.message,
            proposedOrigin: negotiationData.origin,
            proposedDestination: negotiationData.destination,
          },
        });
        return { success: true };
      } catch (error: any) {
        console.error('Erreur lors de la création de l\'offre:', error);
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    async acceptOffer(offerId: string) {
      try {
        await $fetch(`/api/offers/${offerId}/accept`, { method: 'POST' });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      }
    },

    async rejectOffer(offerId: string) {
      try {
        await $fetch(`/api/offers/${offerId}/reject`, { method: 'POST' });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      }
    },

    async counterOffer(offerId: string, role: 'shipper' | 'carrier', data: any) {
      try {
        await $fetch(`/api/offers/${offerId}/counter`, {
          method: 'POST',
          body: { ...data, role },
        });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      }
    },
  },
});
