<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="announcement in items" :key="announcement.id" class="card-hover p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4 gap-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate" :title="announcement.title">
            {{ announcement.title }}
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <IconMapPin class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ announcement.origin.city }} → {{ announcement.destination.city }}</span>
            <span v-if="announcement.distance" class="text-gray-400 shrink-0">
              ({{ announcement.distance }} km)
            </span>
          </div>
        </div>
        <span :class="statusClass(announcement.status)">
          {{ statusLabel(announcement.status) }}
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
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ cargoTypeLabel(announcement.cargoType) }}
            </p>
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
            <p class="text-sm font-medium text-primary-600 dark:text-primary-400">{{ announcement.budget }} FCFA</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <!-- Shipper info -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <IconUser class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ shipperName(announcement) }}
            </p>
            <div class="flex items-center text-yellow-500">
              <template v-for="i in 5" :key="i">
                <IconStarFilled v-if="i <= Math.round((announcement.shipper || announcement.user)?.rating || 0)"
                  class="w-2.5 h-2.5" />
                <IconStar v-else class="w-2.5 h-2.5 text-gray-200" />
              </template>
              <span class="text-[10px] text-gray-400 font-bold ml-1">
                ({{ (announcement.shipper || announcement.user)?.rating || '0.0' }})
              </span>
            </div>
          </div>
        </div>

        <!-- Views -->
        <div class="flex items-center space-x-3 text-sm text-gray-500 mr-4">
          <div class="flex items-center" title="Vues totales">
            <IconEye class="w-4 h-4 mr-1 text-primary-500/70" />
            <span class="font-bold">{{ announcement.views || 0 }}</span>
          </div>
          <div class="flex items-center" title="Vues uniques">
            <IconUsers class="w-4 h-4 mr-1 text-primary-500/70" />
            <span class="font-bold">{{ announcement.uniqueViews || 0 }}</span>
          </div>
        </div>

        <NuxtLink :to="`/annonces/${announcement.id}?type=fret`" class="btn btn-primary btn-sm">
          Voir détails
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconCalendar, IconCube, IconMapPin, IconScale,
  IconStar, IconStarFilled, IconTag, IconUser, IconEye, IconUsers
} from '@tabler/icons-vue';

defineProps<{
  items: any[];
}>();

const statusClass = (status: string) => {
  const base = 'badge';
  switch (status) {
    case 'pending': return `${base} badge-info`;
    case 'negotiating': return `${base} badge-warning`;
    case 'accepted': return `${base} badge-success`;
    case 'completed': return `${base} badge-neutral`;
    case 'cancelled': return `${base} badge-danger`;
    default: return `${base} badge-neutral`;
  }
};

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    negotiating: 'En négociation',
    accepted: 'Accepté',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };
  return labels[status] ?? status;
};

const cargoTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    palettes: 'Palettes',
    vrac: 'Vrac',
    conteneur: 'Conteneur',
    frigorifique: 'Frigo',
    dangereux: 'Dangereux',
    autre: 'Autre',
  };
  return labels[type] ?? type;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

const shipperName = (announcement: any) => {
  const s = announcement.shipper || announcement.user;
  return s?.company || `${s?.firstname || ''} ${s?.lastname || ''}`.trim() || 'Expéditeur';
};
</script>

<style scoped>
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
