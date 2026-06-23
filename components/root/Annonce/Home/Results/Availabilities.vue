<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="item in items" :key="item.id"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden group">
      <div class="p-6">
        <!-- Route -->
        <div class="flex items-start justify-between mb-6">
          <div class="space-y-4 relative">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 z-10">
                <IconMapPin class="w-4 h-4" />
              </div>
              <div>
                <p class="text-xs text-gray-500 font-medium">Départ</p>
                <p class="font-bold text-gray-900 dark:text-white">{{ item.origin.city }}</p>
              </div>
            </div>
            <div
              class="absolute left-4 top-8 bottom-4 w-0.5 border-l-2 border-dashed border-gray-200 dark:border-gray-700">
            </div>
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center text-secondary-600 z-10">
                <IconMapPinFilled class="w-4 h-4" />
              </div>
              <div>
                <p class="text-xs text-gray-500 font-medium">Destination</p>
                <p class="font-bold text-gray-900 dark:text-white">
                  {{ item.destination?.city || 'Toutes destinations' }}</p>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black text-primary-600">
              {{ item.price ? item.price + ' FCFA' : 'Prix sur devis' }}</p>
            <span class="badge badge-xs mt-1" :class="getStatusBadgeClass(item.status)">{{
              getStatusLabel(item.status) }}</span>
          </div>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4 py-4 border-t border-gray-50 dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <IconCalendar class="w-4 h-4 text-gray-400" />
            <span class="text-sm text-gray-600">{{ formatDate(item.startDate) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <IconTruck class="w-4 h-4 text-gray-400" />
            <span class="text-sm text-gray-600">{{ item.vehicle?.brand }} {{ item.vehicle?.type }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden mr-2">
              <img v-if="item.carrier?.photoUrl" :src="item.carrier.photoUrl" class="w-full h-full object-cover" />
              <span v-else class="w-full h-full flex items-center justify-center text-[10px] font-bold">{{
                item.carrier?.firstname?.[0] }}</span>
            </div>
            <div class="text-xs">
              <p class="font-bold">{{ item.carrier?.firstname }} {{ item.carrier?.lastname }}</p>
              <div class="flex items-center text-yellow-500">
                <div class="flex mr-1">
                  <template v-for="i in 5" :key="i">
                    <IconStarFilled v-if="i <= Math.round(item.carrier?.rating || 0)" class="w-2.5 h-2.5" />
                    <IconStar v-else class="w-2.5 h-2.5 text-gray-200" />
                  </template>
                </div>
                <span class="text-[10px] text-gray-400 font-bold">({{ item.carrier?.rating || '0.0' }})</span>
              </div>
              <button v-if="canRateCarrier(item.carrier)" @click.stop.prevent="$emit('openRateModal', item.carrier)"
                class="text-[10px] bg-secondary-50 text-secondary-600 px-2 py-0.5 rounded-full mt-1 hover:bg-secondary-100 transition-colors font-medium">
                {{ item.carrier?.myReview ? 'Modifier avis' : 'Noter' }}
              </button>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-end gap-3 mr-3">
            <div class="flex items-center text-xs text-gray-500" title="Vues totales">
              <IconEye class="w-3.5 h-3.5 mr-1 text-primary-500/70" />
              <span class="font-bold">{{ item.views || 0 }}</span>
            </div>
            <div class="flex items-center text-xs text-gray-500" title="Vues uniques">
              <IconUsers class="w-3.5 h-3.5 mr-1 text-primary-500/70" />
              <span class="font-bold">{{ item.uniqueViews || 0 }}</span>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <NuxtLink :to="`/annonces/${item.id}?type=avail`" class="btn btn-primary btn-sm rounded-xl">Détails
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMapPin, IconMapPinFilled, IconCalendar, IconTruck, IconStarFilled, IconStar, IconEye, IconUsers } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';

const props = defineProps<{
  items: any[];
}>();

defineEmits<{
  (e: 'openRateModal', carrier: any): void;
}>();

const authStore = useCmnAuthStore();

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

const canRateCarrier = (carrier: any) => {
  if (!authStore.isAuthenticated || !authStore.isShipper) return false;
  return true;
};
</script>
