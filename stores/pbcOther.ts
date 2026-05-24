import { defineStore } from 'pinia';
import { extractErrorMessage } from '~/utils/error';

export const usePbcOtherStore = defineStore('pbcOther', {
  state: () => ({
    apiStatus: 'loading' as 'loading' | 'online' | 'offline',
  }),

  actions: {
    // Vérifie le statut de l'API
    async fetchApiStatus() {
      this.apiStatus = 'loading';
      try {
        const data = await $fetch<{ status: string }>('/api/public/other/status');
        this.apiStatus = (data as any)?.status || 'online';
      } catch (e) {
        this.apiStatus = 'offline';
        console.error('[pbcOther] Erreur vérification statut API:', e);
      }
    },

    // Retourne l'URL de téléchargement du contrat via le proxy frontend
    getContractDownloadUrl(filename: string | null | undefined): string {
      if (!filename) return '#';

      const baseName = filename.split('/').pop() || '';
      const cleanName = baseName.replace('.pdf', '');

      return `/api/public/other/contract-file?filename=${encodeURIComponent(cleanName)}`;
    },

    // Soumet le formulaire de contact
    async submitContactForm(data: any) {
      try {
        const response = await $fetch<{ message: string; ticketNumber: string }>('/api/public/other/submit-contact', {
          method: 'POST',
          body: data,
        });

        return { success: true, data: response };
      } catch (e: any) {
        return { success: false, error: extractErrorMessage(e) || 'Une erreur est survenue lors de l\'envoi' };
      }
    }
  }
});
