<template>
  <div class="space-y-6 mb-8">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
        <IconPackage class="w-6 h-6 mr-2 text-primary-600" />
        Annonces de fret
      </h2>
      <NuxtLink v-if="items.length > 0" :to="`/annonces?tab=fret&userId=${userId}`"
        class="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline">
        Voir tout
      </NuxtLink>
    </div>

    <div v-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="offer in items" :key="offer.id"
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="space-y-2">
            <h4 class="font-bold text-gray-900 dark:text-white">{{ offer.title }}</h4>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span class="font-medium">{{ offer.origin.city }}</span>
              <IconArrowRight class="w-4 h-4 text-gray-400" />
              <span class="font-medium">{{ offer.destination.city }}</span>
            </div>
            <div class="flex items-center space-x-4 text-xs text-gray-500">
              <span class="flex items-center">
                <IconCube class="w-3.5 h-3.5 mr-1" />
                {{ offer.cargoType }}
              </span>
              <span class="flex items-center">
                <IconScale class="w-3.5 h-3.5 mr-1" />
                {{ offer.weight }}kg
              </span>
            </div>
          </div>
          <span class="badge" :class="getStatusBadgeClass(offer.status)">{{ getStatusLabel(offer.status) }}</span>
        </div>
        <div class="flex justify-end">
          <NuxtLink :to="`/annonces/${offer.id}?type=offer`"
            class="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center">
            Détails
            <IconArrowRight class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else
      class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
      <p class="text-gray-500">Aucune annonce en cours.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconPackage, IconArrowRight, IconCube, IconScale } from '@tabler/icons-vue';

defineProps<{
  userId: string;
  items: any[];
}>();

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    closed: 'Fermé',
    pending: 'En attente'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'badge-success';
    case 'closed': return 'badge-neutral';
    default: return 'badge-info';
  }
};
</script>
