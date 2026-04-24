import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus, Offer } from '~/types';
import { sharedAnnouncementGetters, sharedAnnouncementActions } from '~/utils/announcementHelpers';

interface AnnouncementState {
  announcements: Announcement[];
  offers: Offer[];
  currentAnnouncement: Announcement | null;
  filters: AnnouncementFilters;
  loading: boolean;
}

export const useCmnAnnouncementStore = defineStore('cmnAnnouncement', {
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
    // Contre proposition d'une offre
    async counterCmnOffer(offerId: string, role: 'shipper' | 'carrier', data: any) {
      try {
        await $fetch(`/api/common/other/announce-counter`, {
          method: 'POST',
          body: { ...data, role },
        });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      }
    },

    ...sharedAnnouncementActions,
  },
});
