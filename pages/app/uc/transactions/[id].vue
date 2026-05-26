<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <div class="container-custom pt-8">
      <div class="mb-8">
        <NuxtLink to="/app/uc/transactions" class="text-secondary-600 hover:text-secondary-700 flex items-center mb-4">
          &larr; Retour aux transactions
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Détails de la transaction</h1>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
        <div v-if="loading" class="text-center py-12">
          <IconLoader2 class="w-8 h-8 animate-spin text-secondary-500 mx-auto mb-4" />
          <p class="text-gray-500">Chargement...</p>
        </div>
        <div v-else-if="!transaction" class="text-center py-12">
          <IconX class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-gray-500">Transaction introuvable.</p>
        </div>
        <div v-else>
          <div class="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700 mb-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Montant payé</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {{ formatAmount(transaction.amount) }} {{ transaction.currency?.iso || 'XOF' }}
              </p>
            </div>
            <span class="badge badge-lg" :class="getStatusClass(transaction.status)">
              {{ getStatusLabel(transaction.status) }}
            </span>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Référence</span>
              <span class="font-mono font-medium text-gray-900 dark:text-white">{{ transaction.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Date</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(transaction.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Description</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ transaction.description || 'Paiement' }}</span>
            </div>
            <div class="flex justify-between" v-if="transaction.payment_method">
              <span class="text-gray-500 dark:text-gray-400">Moyen de paiement</span>
              <span class="font-medium text-gray-900 dark:text-white capitalize">{{ transaction.payment_method.brand || 'Mobile Money' }}</span>
            </div>
            <div class="flex justify-between" v-if="transaction.customer">
              <span class="text-gray-500 dark:text-gray-400">Client</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ transaction.customer.email }}</span>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
             <button @click="printReceipt" class="btn btn-outline w-full flex justify-center items-center">
                <IconPrinter class="w-5 h-5 mr-2" /> Imprimer le reçu
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCmnSubscriptionStore } from '~/stores/cmnSubscription';
import { IconLoader2, IconX, IconPrinter } from '@tabler/icons-vue';
import { getTransactionStatusLabel as getStatusLabel, getTransactionStatusClass as getStatusClass, formatDateTime as formatDate, formatAmount } from '~/utils/maps';

const route = useRoute();
const subscriptionStore = useCmnSubscriptionStore();

const txId = Number(route.params.id);
const loading = ref(true);

const transaction = computed(() => {
  return subscriptionStore.transactions.find((t: any) => t.id === txId);
});

onMounted(async () => {
  if (subscriptionStore.transactions.length === 0) {
    await subscriptionStore.fetchTransactions();
  }
  loading.value = false;
});

const printReceipt = async () => {
  if (!transaction.value) return;
  try {
    const res = await $fetch<any>(`/api/common/subscription/transactions/${transaction.value.id}/invoice`, {
      headers: {
        'Authorization': `Bearer ${useCookie('auth_token').value}`
      }
    });
    if (res.url) {
      window.open(res.url, '_blank');
    }
  } catch (fetchErr) {
    console.error('Erreur lors du téléchargement du reçu:', fetchErr);
    alert('Impossible de télécharger le reçu.');
  }
};

definePageMeta({ layout: 'default' });
useHead({ title: 'Détails de transaction' });
</script>
