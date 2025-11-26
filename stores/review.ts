import { defineStore } from 'pinia';
import type { Review, Report, ReportType, ReportReason } from '~/types';
import { mockReviews, mockReports } from '~/data/mock';

interface ReviewState {
  reviews: Review[];
  reports: Report[];
  loading: boolean;
}

export const useReviewStore = defineStore('review', {
  state: (): ReviewState => ({
    reviews: [...mockReviews],
    reports: [...mockReports],
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
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Vérifier si l'utilisateur a déjà laissé un avis pour cette annonce
      const existingReview = this.reviews.find(
        r => r.fromUserId === reviewData.fromUserId &&
          r.announcementId === reviewData.announcementId
      );

      if (existingReview) {
        this.loading = false;
        return { success: false, error: 'Vous avez déjà laissé un avis pour cette annonce' };
      }

      const newReview: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      this.reviews.push(newReview);
      this.loading = false;

      return { success: true, review: newReview };
    },

    /**
     * Créer un signalement
     */
    async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      const newReport: Report = {
        ...reportData,
        id: `rep-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      this.reports.push(newReport);
      this.loading = false;

      return { success: true, report: newReport };
    },

    /**
     * Mettre à jour le statut d'un signalement
     */
    async updateReportStatus(reportId: string, status: Report['status']) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = this.reports.findIndex(r => r.id === reportId);
      if (index !== -1) {
        this.reports[index].status = status;
        this.loading = false;
        return { success: true, report: this.reports[index] };
      }

      this.loading = false;
      return { success: false, error: 'Signalement non trouvé' };
    },

    /**
     * Supprimer un avis
     */
    async deleteReview(reviewId: string) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = this.reviews.findIndex(r => r.id === reviewId);
      if (index !== -1) {
        this.reviews.splice(index, 1);
        this.loading = false;
        return { success: true };
      }

      this.loading = false;
      return { success: false, error: 'Avis non trouvé' };
    },
  },
});
