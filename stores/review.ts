import { defineStore } from 'pinia';
import type { Review, Report, ReportType, ReportReason } from '~/types';
import { useAPI } from '~/composables/useAPI';

interface ReviewState {
  reviews: Review[];
  reports: Report[];
  loading: boolean;
}

export const useReviewStore = defineStore('review', {
  state: (): ReviewState => ({
    reviews: [],
    reports: [],
    loading: false,
  }),

  getters: {
    /**
     * Récupérer tous les avis
     */
    allReviews: (state) => state.reviews,

    /**
     * Récupérer les avis d'un utilisateur
     */
    userReviews: (state) => (userId: string) => {
      return state.reviews.filter(r => r.toUserId === userId);
    },

    /**
     * Calculer la note moyenne d'un utilisateur
     */
    userAverageRating: (state) => (userId: string) => {
      const userReviews = state.reviews.filter(r => r.toUserId === userId);
      if (userReviews.length === 0) return 0;

      const sum = userReviews.reduce((acc, r) => acc + r.rating, 0);
      return sum / userReviews.length;
    },

    /**
     * Récupérer tous les signalements
     */
    allReports: (state) => state.reports,

    /**
     * Récupérer les signalements par type
     */
    reportsByType: (state) => (type: ReportType) => {
      return state.reports.filter(r => r.type === type);
    },
  },

  actions: {
    /**
     * Créer un avis
     */
    async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
      this.loading = true;
      const api = useAPI();

      try {
        // En fonction du rôle de l'utilisateur, l'endpoint peut varier
        // Mais en général, on utilise les endpoints de UserStore (rateCarrier / rateShipper)
        // Si ce store est utilisé séparément :
        const response = await api.post<Review>('/public/reviews', reviewData);

        if (response.success && response.data) {
          this.reviews.push(response.data);
          return { success: true, review: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la création de l\'avis:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Créer un signalement
     */
    async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) {
      this.loading = true;
      const api = useAPI();

      try {
        const response = await api.post<Report>('/public/reports', reportData);

        if (response.success && response.data) {
          this.reports.push(response.data);
          return { success: true, report: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors du signalement:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Mettre à jour le statut d'un signalement (Admin)
     */
    async updateReportStatus(reportId: string, status: Report['status']) {
      this.loading = true;
      const api = useAPI();

      try {
        const response = await api.patch<Report>(`/admin/reports/${reportId}`, { status });

        if (response.success && response.data) {
          const index = this.reports.findIndex(r => r.id === reportId);
          if (index !== -1) {
            this.reports[index] = response.data;
          }
          return { success: true, report: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la mise à jour du signalement:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprimer un avis
     */
    async deleteReview(reviewId: string) {
      this.loading = true;
      const api = useAPI();

      try {
        const response = await api.del(`/admin/reviews/${reviewId}`);

        if (response.success) {
          this.reviews = this.reviews.filter(r => r.id !== reviewId);
          return { success: true };
        }
        return { success: false, error: response.error };
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        return { success: false, error: 'Erreur technique' };
      } finally {
        this.loading = false;
      }
    },
  },
});
