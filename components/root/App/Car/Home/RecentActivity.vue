<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-black text-gray-900 dark:text-white">Activité récente</h2>
      <NuxtLink to="/app/uc/avail" class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
        Explorer →</NuxtLink>
    </div>

    <div v-if="recentActivity.length === 0"
      class="bg-white dark:bg-gray-800 rounded-[2rem] p-12 text-center border border-gray-100 dark:border-gray-700/50 shadow-xl">
      <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconSend class="w-10 h-10 text-gray-300 dark:text-gray-600" />
      </div>
      <p class="text-gray-500 dark:text-gray-400 font-medium mb-6">Aucune activité récente.</p>
      <NuxtLink to="/annonces?tab=fret"
        class="btn-primary px-8 py-3 rounded-2xl font-black inline-block active:scale-95 transition-all">
        VOIR LES ANNONCES
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="item in recentActivity" :key="item.type + '-' + item.id"
        class="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
            <IconTruck v-if="item.type === 'avail'" class="w-6 h-6 text-blue-500" />
            <IconSend v-else class="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{
              item.title }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span :class="getOfferStatusClass(item.status)"
                class="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                {{ getOfferStatusLabel(item.status) }}
              </span>
              <span class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {{ formatDate(item.createdAt) }}
              </span>
              <span v-if="item.price" class="text-xs font-black text-gray-700 dark:text-white ml-2">
                {{ item.price.toLocaleString() }} FCFA
              </span>
            </div>
          </div>
        </div>
        <NuxtLink :to="item.link"
          class="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-black text-primary-600 border border-primary-100 dark:border-primary-900/30 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
          VOIR
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTruck, IconSend } from '@tabler/icons-vue';

defineProps<{
  recentActivity: any[];
}>();

const getOfferStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Acceptée',
    rejected: 'Refusée',
    counter: 'Contre-offre',
    negotiating: 'Négociation',
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré'
  };
  return labels[status] || status;
};

const getOfferStatusClass = (status: string) => {
  const baseClass = 'badge';
  switch (status) {
    case 'pending': return `${baseClass} badge-info`;
    case 'accepted': return `${baseClass} badge-success`;
    case 'rejected': return `${baseClass} badge-danger`;
    case 'counter':
    case 'negotiating': return `${baseClass} badge-warning`;
    case 'active': return `${baseClass} badge-success`;
    case 'full': return `${baseClass} badge-neutral bg-amber-50 text-amber-600`;
    case 'expired': return `${baseClass} badge-neutral bg-gray-100 text-gray-500`;
    default: return `${baseClass} badge-neutral`;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};
</script>
