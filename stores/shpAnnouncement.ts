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

export const useShpAnnouncementStore = defineStore('shpAnnouncement', {
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

    // Obtenir une seule annonce
    async fetchShpAnnouncement(id: string) {
      this.loading = true;
      try {
        const response = await $fetch<Announcement>(`/api/shipper/announce/get`, {
          query: { id }
        });
        if (response) {
          const shipperId = typeof response.shipper === 'object' && response.shipper !== null ? (response.shipper as any).id : response.shipper;
          if (shipperId && !response.userId) response.userId = shipperId;

          this.currentAnnouncement = response;
          return { success: true, announcement: response };
        }
        return { success: false, error: 'Annonce non trouvée' };
      } catch (error: any) {
        console.error('Erreur lors du chargement de l\'annonce:', error);
        return { success: false, error: error?.data?.message || 'Erreur technique' };
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

    // Refuser une offre
    async rejectShpOffer(offerId: string) {
      try {
        await $fetch(`/api/shipper/announce/offer-reject`, { method: 'POST' });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error?.data?.message || 'Erreur technique' };
      }
    },

    ...sharedAnnouncementActions,
  },
});
