import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, Offer } from '~/types';
import { sharedAnnouncementGetters, sharedAnnouncementActions } from '~/utils/announcementHelpers';

interface AnnouncementState {
  announcements: Announcement[];
  offers: Offer[];
  currentAnnouncement: Announcement | null;
  filters: AnnouncementFilters;
  loading: boolean;
}

export const useCarAnnouncementStore = defineStore('carAnnouncement', {
  state: (): AnnouncementState => ({
    announcements: [],
    offers: [],
    currentAnnouncement: null,
    filters: {},
    loading: false,
  }),

  getters: {
    ...sharedAnnouncementGetters,
  },

  actions: {
    // Créer une offre
    async createCarOffer(announcementId: string, negotiationData: any) {
      this.loading = true;
      try {
        await $fetch(`/api/carrier/announce/create-offer`, {
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

    ...sharedAnnouncementActions,
  },
});
