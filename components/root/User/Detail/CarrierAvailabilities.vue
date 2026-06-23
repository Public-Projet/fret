<template>
  <div class="space-y-6 mb-8">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
        <IconTruck class="w-6 h-6 mr-2 text-primary-600" />
        Disponibilités en cours
      </h2>
      <NuxtLink v-if="items.length > 0" :to="`/annonces?tab=avail&userId=${userId}`"
        class="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline">
        Voir tout
      </NuxtLink>
    </div>

    <div v-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="avail in items" :key="avail.id"
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="font-bold">{{ avail.origin.city }}</span>
              <IconArrowRight class="w-4 h-4 text-gray-400" />
              <span class="font-bold">{{ avail.destination?.city || 'Ouvert' }}</span>
            </div>
            <div class="flex items-center space-x-4 text-xs text-gray-500">
              <span class="flex items-center">
                <IconCalendar class="w-3.5 h-3.5 mr-1" />
                {{ formatDate(avail.startDate) }}
              </span>
              <span class="flex items-center">
                <IconTruck class="w-3.5 h-3.5 mr-1" />
                {{ avail.vehicle?.type }}
              </span>
            </div>
          </div>
          <span class="badge" :class="getStatusBadgeClass(avail.status)">{{ getStatusLabel(avail.status) }}</span>
        </div>
        <div class="flex justify-end">
          <NuxtLink :to="`/annonces/${avail.id}?type=avail`"
            class="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center">
            Détails
            <IconArrowRight class="w-4 h-4 ml-1" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else
      class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
      <p class="text-gray-500">Aucune disponibilité en cours.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTruck, IconCalendar, IconArrowRight } from '@tabler/icons-vue';

defineProps<{
  userId: string;
  items: any[];
}>();

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé',
    pending: 'En attente'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'badge-success';
    case 'full': return 'badge-warning';
    case 'prolonged': return 'badge-info';
    default: return 'badge-neutral';
  }
};
</script>
