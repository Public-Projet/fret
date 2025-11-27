<template>
  <div class="card-hover p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ announcement.title }}
        </h3>
        <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <IconMapPin class="w-4 h-4" />
          <span>{{ announcement.origin.city }} → {{ announcement.destination.city }}</span>
          <span v-if="announcement.distance" class="text-gray-400">
            ({{ announcement.distance }} km)
          </span>
        </div>
      </div>
      <span :class="statusClass">
        {{ statusLabel }}
      </span>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
      {{ announcement.description }}
    </p>

    <!-- Details -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div class="flex items-center space-x-2">
        <IconCube class="w-5 h-5 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Type</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ cargoTypeLabel }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <IconScale class="w-5 h-5 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Poids</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ announcement.weight }} kg</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <IconCalendar class="w-5 h-5 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Enlèvement</p>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(announcement.pickupDate) }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <IconTag class="w-5 h-5 text-gray-400" />
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Budget</p>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-400">{{ announcement.budget }}FCFA</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <IconUser class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ announcement.user?.company || 'Entreprise' }}
          </p>
          <div class="flex items-center space-x-1">
            <IconStar class="w-3 h-3 text-yellow-400 fill-current" />
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {{ announcement.user?.rating || 0 }} ({{ announcement.user?.reviewCount || 0 }})
            </span>
          </div>
        </div>
      </div>
      <NuxtLink :to="`/announcements/${announcement.id}`" class="btn btn-primary btn-sm">
        Voir détails
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Announcement } from '~/types';
import { IconCalendar, IconCube, IconMapPin, IconScale, IconStar, IconTag, IconUser } from '@tabler/icons-vue';

const props = defineProps<{
  announcement: Announcement;
}>();

const statusClass = computed(() => {
  const baseClass = 'badge';
  switch (props.announcement.status) {
    case 'pending':
      return `${baseClass} badge-info`;
    case 'negotiating':
      return `${baseClass} badge-warning`;
    case 'accepted':
      return `${baseClass} badge-success`;
    case 'completed':
      return `${baseClass} badge-neutral`;
    case 'cancelled':
      return `${baseClass} badge-danger`;
    default:
      return `${baseClass} badge-neutral`;
  }
});

const statusLabel = computed(() => {
  switch (props.announcement.status) {
    case 'pending':
      return 'En attente';
    case 'negotiating':
      return 'En négociation';
    case 'accepted':
      return 'Accepté';
    case 'completed':
      return 'Terminé';
    case 'cancelled':
      return 'Annulé';
    default:
      return props.announcement.status;
  }
});

const cargoTypeLabel = computed(() => {
  switch (props.announcement.cargoType) {
    case 'palettes':
      return 'Palettes';
    case 'vrac':
      return 'Vrac';
    case 'conteneur':
      return 'Conteneur';
    case 'frigorifique':
      return 'Frigo';
    case 'dangereux':
      return 'Dangereux';
    case 'autre':
      return 'Autre';
    default:
      return props.announcement.cargoType;
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};
</script>

<style scoped>
.btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
