import { defineStore } from 'pinia';
import type { Announcement, AnnouncementFilters, AnnouncementStatus } from '~/types';
import { sharedAnnouncementGetters, sharedAnnouncementActions } from '~/utils/announcementHelpers';

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
    ...sharedAnnouncementGetters,
  },

  actions: {
    // Charger toutes les annonces
    async fetchPbcAnnouncements(queryParams: any = {}) {
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
    async getPbcAnnouncements(id: string) {
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

    ...sharedAnnouncementActions,
  },
});
