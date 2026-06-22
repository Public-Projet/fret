import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { extractErrorMessage } from '~/utils/error';
import { useCmnAuthStore } from './cmnAuth';


export const useCmnSubscriptionStore = defineStore('cmnSubscription', {
  state: () => ({
    transactions: [] as any[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchTransactions() {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<any>('/api/common/subscription/transactions', {
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });
        if (response && response.data) {
          this.transactions = response.data;
        } else {
          this.transactions = [];
        }
        return { success: true, data: this.transactions };
      } catch (e: any) {
        this.error = extractErrorMessage(e) || 'Erreur lors de la récupération des transactions';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    async checkout(plan: string, billing: string) {
      try {
        const response = await $fetch<any>('/api/common/subscription/checkout', {
          method: 'POST',
          body: { plan, billing },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });
        return { success: true, data: response };
      } catch (e: any) {
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors de la création du paiement' };
      }
    },
    async verify(transactionId?: string) {
      try {
        const url = transactionId ? `/api/common/subscription/verify?transaction_id=${transactionId}` : `/api/common/subscription/verify`;
        const response = await $fetch<any>(url, {
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });
        return { success: true, data: response };
      } catch (e: any) {
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors de la vérification du paiement' };
      }
    },
    async cancelSubscription() {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<any>('/api/common/subscription/cancel', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        // Update user in authStore
        const authStore = useCmnAuthStore();
        if (response.user && authStore.user) {
          authStore.user = { ...authStore.user, ...response.user };
        }

        return { success: true, message: response.message || 'Abonnement annulé' };
      } catch (e: any) {
        this.error = extractErrorMessage(e) || 'Erreur lors de l\'annulation de l\'abonnement';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    async cancelTransaction(transactionId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<any>('/api/common/subscription/cancel-transaction', {
          method: 'POST',
          body: { transactionId },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });
        await this.fetchTransactions();
        return { success: true, message: response.message || 'Transaction annulée' };
      } catch (e: any) {
        this.error = extractErrorMessage(e) || 'Erreur lors de l\'annulation de la transaction';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    async downloadReceipt(transactionId: number) {
      this.loading = true;
      try {
        const response = await $fetch<any>(`/api/common/subscription/invoice`, {
          query: { id: transactionId },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });
        return { success: true, url: response.url };
      } catch (e: any) {
        return { success: false, error: extractErrorMessage(e) || 'Erreur lors du téléchargement du reçu' };
      } finally {
        this.loading = false;
      }
    }
  }
});
