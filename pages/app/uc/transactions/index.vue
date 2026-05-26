<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <div class="container-custom pt-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <IconReceipt class="w-8 h-8 mr-3 text-secondary-600" />
            Mes Transactions
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Historique de vos 5 derniers paiements d'abonnement</p>
        </div>
        <NuxtLink to="/app/uc/profile" class="btn btn-ghost">
          &larr; Retour au profil
        </NuxtLink>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <IconLoader2 class="w-8 h-8 animate-spin text-secondary-500 mx-auto mb-4" />
          <p class="text-gray-500">Chargement des transactions...</p>
        </div>
        <div v-else-if="error" class="p-12 text-center">
          <IconX class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-500 font-medium">{{ error }}</p>
          <button @click="fetchTransactions" class="mt-4 btn btn-outline btn-sm">Réessayer</button>
        </div>
        <div v-else-if="transactions.length === 0" class="p-12 text-center">
          <IconReceipt class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Aucune transaction trouvée.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm">
                <th class="py-4 px-6 font-medium">Référence</th>
                <th class="py-4 px-6 font-medium">Date</th>
                <th class="py-4 px-6 font-medium">Montant</th>
                <th class="py-4 px-6 font-medium">Statut</th>
                <th class="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="tx in transactions" :key="tx.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                :class="{ 'bg-yellow-50/50 dark:bg-yellow-900/10 border-l-2 border-l-yellow-400': tx.status === 'pending' }">
                <td class="py-4 px-6">
                  <span class="font-mono text-sm text-gray-900 dark:text-gray-300">{{ tx.reference }}</span>
                  <p class="text-xs text-gray-500 mt-1">{{ tx.description || 'Paiement abonnement' }}</p>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                  {{ formatDate(tx.created_at) }}
                </td>
                <td class="py-4 px-6 font-medium text-gray-900 dark:text-white">
                  {{ formatAmount(tx.amount) }} {{ tx.currency?.iso || 'XOF' }}
                </td>
                <td class="py-4 px-6">
                  <span class="badge" :class="getStatusClass(tx.status)">
                    {{ getStatusLabel(tx.status) }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <button v-if="tx.status === 'pending'" @click="handleCancelTransaction(tx.id)"
                    class="btn btn-outline btn-sm text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                    Annuler
                  </button>
                  <NuxtLink :to="`/app/uc/transactions/${tx.id}`" class="btn btn-ghost btn-sm text-secondary-600">
                    Détails
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCmnSubscriptionStore } from '~/stores/cmnSubscription';
import { IconReceipt, IconLoader2, IconX } from '@tabler/icons-vue';
import { getTransactionStatusLabel as getStatusLabel, getTransactionStatusClass as getStatusClass, formatDateTime as formatDate, formatAmount } from '~/utils/maps';

const subscriptionStore = useCmnSubscriptionStore();

const transactions = computed(() => subscriptionStore.transactions);
const loading = computed(() => subscriptionStore.loading);
const error = computed(() => subscriptionStore.error);

const fetchTransactions = async () => {
  await subscriptionStore.fetchTransactions();
};

const handleCancelTransaction = async (id: number) => {
  if (confirm('Voulez-vous vraiment annuler cette transaction en attente ?')) {
    const res = await subscriptionStore.cancelTransaction(id) as any;
    if (res.success) {
      useNuxtApp().$toast?.success('Transaction annulée avec succès.');
    } else {
      useNuxtApp().$toast?.error(res.error || 'Erreur lors de l\'annulation.');
    }
  }
};

onMounted(() => {
  fetchTransactions();
});

definePageMeta({ layout: 'default' });
useHead({ title: 'Mes Transactions' });
</script>
