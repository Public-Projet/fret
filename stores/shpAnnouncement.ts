import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus, Offer } from '~/types';

interface AnnouncementState {
  announcements: Announcement[];
  offers: Offer[];
  currentAnnouncement: Announcement | null;
  filters: AnnouncementFilters;
  loading: boolean;
}

export const useShpAnnouncementStore = defineStore('shpAnnouncement', {
  state: (): AnnouncementState => ({
    announcements: [],
    offers: [],
    currentAnnouncement: null,
    filters: {},
    loading: false,
  }),

  getters: {
    // Récupérer toutes les annonces
    allAnnouncements: (state) => state.announcements,

    // Récupérer les annonces filtrées
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

    // Récupérer les annonces d'un utilisateur
    userAnnouncements: (state) => (userId: string) => {
      return state.announcements.filter(a => a.userId === userId);
    },

    // Récupérer les annonces par statut
    announcementsByStatus: (state) => (status: AnnouncementStatus) => {
      return state.announcements.filter(a => a.status === status);
    },
  },

  actions: {
    // Créer une nouvelle annonce
    async shpCreateAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      this.loading = true;
      try {
        const newAnnouncement = await $fetch<Announcement>('/api/shipper/announce/create', {
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

    // Charger les annonces
    async fetchShpAnnouncements() {
      this.loading = true;
      try {
        const response = await $fetch<Announcement[]>('/api/shipper/announce/list-mine');
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

    // Mettre à jour une annonce
    async updateShpAnnouncement(id: string, updates: Partial<Announcement>) {
      this.loading = true;
      try {
        const updated = await $fetch<Announcement>(`/api/shipper/announce/update`, {
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

    // Changer le statut d'une annonce
    async updateStatus(id: string, status: AnnouncementStatus) {
      return this.updateShpAnnouncement(id, { status });
    },

    // Supprimer une annonce
    async deleteShpAnnouncement(id: string) {
      this.loading = true;
      try {
        await ($fetch as any)(`/api/shipper/announce/delete`, { method: 'DELETE' });
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

    // Lister les offres d'une annonce
    async fetchShpOffersForAnnouncement(announcementId: string) {
      this.loading = true;
      try {
        const token = useCookie('auth_token').value;
        const res = await $fetch<any[]>(`/api/shipper/announce/offer-list`, {
          params: { announcementId },
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res)) {
          const otherOffers = this.offers.filter((o: Offer) => String(o.announcementId || (o as any).announcement?.id || (o as any).announcement) !== String(announcementId));
          this.offers = [...otherOffers, ...res];
        }
      } catch (e) {
        console.error('Failed to fetch offers for announcement', e);
      } finally {
        this.loading = false;
      }
    },

    // Accepter une offre
    async acceptShpOffer(offerId: string) {
      this.loading = true;
      try {
        const token = useCookie('auth_token').value;
        await $fetch(`/api/shipper/announce/offer-accept`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: { offerId },
        });

        // Mise à jour de l'état local
        const index = this.offers.findIndex(o => String(o.id) === String(offerId));
        if (index !== -1) {
          this.offers[index].status = 'accepted';
        }

        return { success: true };
      } catch (error: any) {
        console.error('Erreur lors de l\'acceptation de l\'offre:', error);
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
