import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus } from '~/types';

interface AnnouncementState {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  filters: AnnouncementFilters;
  loading: boolean;
}

export const usePbcAnnouncementStore = defineStore('pbcAnnouncement', {
  state: (): AnnouncementState => ({
    announcements: [],
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
    // Charger toutes les annonces
    async fetchPublicAnnouncements(queryParams: any = {}) {
      this.loading = true;

      try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/api/public/announce/list${queryString ? `?${queryString}` : ''}`;

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

    // Charger une annonce par ID
    async getPublicAnnouncements(id: string) {
      this.loading = true;
      try {
        const response = await $fetch<Announcement>(`/api/public/announce/get`);
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

    // Mettre à jour les filtres
    setFilters(filters: AnnouncementFilters) {
      this.filters = filters;
    },

    // Réinitialiser les filtres
    resetFilters() {
      this.filters = {};
    },
  },
});
