import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus } from '~/types';
import { mockAnnouncements } from '~/data/mock';
import { useUserStore } from '~/stores/user';

interface AnnouncementState {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  filters: AnnouncementFilters;
  loading: boolean;
}

export const useAnnouncementStore = defineStore('announcement', {
  state: (): AnnouncementState => ({
    announcements: [...mockAnnouncements],
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
    async fetchAnnouncements() {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      const userStore = useUserStore();
      this.announcements = mockAnnouncements.map(a => {
        // Mock data usually doesn't have user object populated deeply like backend, 
        // but if it did, or if we had userId, we could sync.
        // Assuming announcement has userId
        if (a.userId && userStore.myReviews[a.userId]) {
          // In mock, we might not have a place to put myReview on the announcement object itself 
          // unless we extend the type. 
          // But let's assume the component will look up the userStore if needed?
          // Or better, let's look at how Announcement is typed.
          // It seems Announcement type in `types/index.ts` should check for user/myReview.
          // For now, let's just leave mock as is, but if we were fetching real data:
          // if (a.user?.myReview) userStore.myReviews[a.userId] = a.user.myReview;
          // else if (userStore.myReviews[a.userId]) a.user.myReview = userStore.myReviews[a.userId];
        }
        return a;
      });
      this.announcements = [...mockAnnouncements]; // Revert to mock for now if type mismatch
      this.loading = false;
    },

    /**
     * Charger une annonce par ID
     */
    async fetchAnnouncementById(id: string) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 300));

      const announcement = this.announcements.find(a => a.id === id);
      if (announcement) {
        const userStore = useUserStore();
        // If we have a user object attached (depends on mock structure)
        if ((announcement as any).user) {
          const userId = (announcement as any).user.id || announcement.userId;
          if (userStore.myReviews[userId]) {
            (announcement as any).user.myReview = userStore.myReviews[userId];
          }
        }
        this.currentAnnouncement = announcement;
        this.loading = false;
        return { success: true, announcement };
      }

      this.loading = false;
      return { success: false, error: 'Annonce non trouvée' };
    },

    /**
     * Créer une nouvelle annonce
     */
    async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));

      const newAnnouncement: Announcement = {
        ...announcementData,
        id: `ann-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.announcements.unshift(newAnnouncement);
      this.loading = false;

      return { success: true, announcement: newAnnouncement };
    },

    /**
     * Mettre à jour une annonce
     */
    async updateAnnouncement(id: string, updates: Partial<Announcement>) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = this.announcements.findIndex(a => a.id === id);
      if (index !== -1) {
        this.announcements[index] = {
          ...this.announcements[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        if (this.currentAnnouncement?.id === id) {
          this.currentAnnouncement = this.announcements[index];
        }

        this.loading = false;
        return { success: true, announcement: this.announcements[index] };
      }

      this.loading = false;
      return { success: false, error: 'Annonce non trouvée' };
    },

    /**
     * Supprimer une annonce
     */
    async deleteAnnouncement(id: string) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = this.announcements.findIndex(a => a.id === id);
      if (index !== -1) {
        this.announcements.splice(index, 1);

        if (this.currentAnnouncement?.id === id) {
          this.currentAnnouncement = null;
        }

        this.loading = false;
        return { success: true };
      }

      this.loading = false;
      return { success: false, error: 'Annonce non trouvée' };
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
  },
});
