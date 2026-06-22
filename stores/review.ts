import { defineStore } from 'pinia';
import type { Review, Report, ReportType, ReportReason } from '~/types';
import { extractErrorMessage } from '~/utils/error';

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
    allReviews: (state) => state.reviews,

    userReviews: (state) => (userId: string) => {
      return state.reviews.filter(r => r.toUserId === userId);
    },

    userAverageRating: (state) => (userId: string) => {
      const userReviews = state.reviews.filter(r => r.toUserId === userId);
      if (userReviews.length === 0) return 0;
      const sum = userReviews.reduce((acc, r) => acc + r.rating, 0);
      return sum / userReviews.length;
    },

    allReports: (state) => state.reports,

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
      try {
        const response = await $fetch<Review>('/api/reviews', {
          method: 'POST',
          body: reviewData,
        });

        if (response) {
          this.reviews.push(response);
          return { success: true, review: response };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (error: any) {
        console.error('Erreur lors de la création de l\'avis:', error);
        return { success: false, error: extractErrorMessage(error) };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Créer un signalement
     */
    async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) {
      this.loading = true;
      try {
        const response = await $fetch<Report>('/api/reports', {
          method: 'POST',
          body: reportData,
        });

        if (response) {
          this.reports.push(response);
          return { success: true, report: response };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (error: any) {
        console.error('Erreur lors du signalement:', error);
        return { success: false, error: extractErrorMessage(error) };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Mettre à jour le statut d'un signalement (Admin)
     */
    async updateReportStatus(reportId: string, status: Report['status']) {
      this.loading = true;
      try {
        const response = await $fetch<Report>(`/api/reports/${reportId}`, {
          method: 'PATCH',
          body: { status },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response) {
          const index = this.reports.findIndex(r => r.id === reportId);
          if (index !== -1) {
            this.reports[index] = response;
          }
          return { success: true, report: response };
        }
        return { success: false, error: 'Erreur technique' };
      } catch (error: any) {
        console.error('Erreur lors de la mise à jour du signalement:', error);
        return { success: false, error: extractErrorMessage(error) };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprimer un avis (Admin)
     */
    async deleteReview(reviewId: string) {
      this.loading = true;
      try {
        await $fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        return { success: true };
      } catch (error: any) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        return { success: false, error: extractErrorMessage(error) };
      } finally {
        this.loading = false;
      }
    },
  },
});
