import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { extractErrorMessage } from '~/utils/error';

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
    }
  }
});
