<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
      <div class="container-custom">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Disponibilités Transport</h1>
        <p class="text-primary-100 text-lg max-w-2xl">
          Trouvez des véhicules disponibles pour vos frets sur les trajets réguliers et retours à vide.
        </p>
      </div>
    </div>

    <div class="container-custom -mt-10">
      <!-- Search & Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Départ</label>
            <div class="relative">
              <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="filters.origin" type="text" placeholder="Ville de départ" class="input pl-10" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrivée</label>
            <div class="relative">
              <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="filters.destination" type="text" placeholder="Ville d'arrivée" class="input pl-10" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
            <div class="relative">
              <IconCalendar class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="filters.date" type="date" class="input pl-10" />
            </div>
          </div>
          <div class="flex items-end">
            <button class="btn btn-primary w-full h-[42px]">
              <IconSearch class="w-5 h-5 mr-2" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des disponibilités...</p>
      </div>

      <div v-else-if="filteredAvailabilities.length === 0"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <IconTruckOff class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune disponibilité trouvée</h3>
        <p class="text-gray-500">Essayez de modifier vos filtres ou revenez plus tard.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in filteredAvailabilities" :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden group">

          <div class="p-6">
            <!-- Route -->
            <div class="flex items-start justify-between mb-6">
              <div class="space-y-4 relative">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 relative z-10">
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
                    class="w-8 h-8 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center text-secondary-600 relative z-10">
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
                <p class="text-2xl font-black text-primary-600">{{ item.price ? item.price + ' FCFA' : 'Prix sur devis'
                }}</p>
                <div class="flex flex-col items-end gap-1">
                  <p class="text-xs text-gray-400">Tarif estimé</p>
                  <span class="badge badge-xs" :class="{
                    'badge-success': item.status === 'active',
                    'badge-info': item.status === 'prolonged',
                    'badge-warning': item.status === 'full'
                  }">{{ getStatusLabel(item.status) }}</span>
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="grid grid-cols-2 gap-4 py-4 border-t border-gray-50 dark:border-gray-700">
              <div class="flex items-center space-x-2">
                <IconCalendar class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(item.startDate) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <IconTruck class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ item.vehicle?.brand }} {{ item.vehicle?.type
                }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold mr-2 uppercase overflow-hidden">
                  <img v-if="item.carrier?.photoUrl" :src="item.carrier.photoUrl" class="w-full h-full object-cover" />
                  <span v-else>{{ item.carrier?.firstname?.[0] || 'T' }}</span>
                </div>
                <div class="text-xs">
                  <p class="font-bold text-gray-900 dark:text-white">
                    {{ (item.carrier?.id === authStore.currentUser?.id && authStore.isCarrier) ? 'Vous' :
                      (item.carrier?.firstname + ' ' + item.carrier?.lastname) }}
                  </p>
                  <div class="flex text-yellow-500">
                    <IconStarFilled v-for="i in 5" :key="i" class="w-2 h-2" />
                  </div>
                </div>
              </div>

              <NuxtLink :to="`/avail/${item.id}`" class="btn btn-primary btn-sm rounded-xl">
                Voir détails
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAvailabilityStore } from '~/stores/availability';
import { useAuthStore } from '~/stores/auth';
import {
  IconMapPin, IconCalendar, IconSearch, IconLoader2, IconTruckOff,
  IconTruck, IconMapPinFilled, IconStarFilled
} from '@tabler/icons-vue';

const availabilityStore = useAvailabilityStore();
const authStore = useAuthStore();
const loading = computed(() => availabilityStore.loading);
const availabilities = computed(() => availabilityStore.availabilities);

const filters = ref({
  origin: '',
  destination: '',
  date: ''
});

const filteredAvailabilities = computed(() => {
  return availabilities.value.filter(item => {
    const matchOrigin = !filters.value.origin || item.origin.city.toLowerCase().includes(filters.value.origin.toLowerCase());
    const matchDest = !filters.value.destination || (item.destination?.city || '').toLowerCase().includes(filters.value.destination.toLowerCase());
    const matchDate = !filters.value.date || item.startDate.includes(filters.value.date);
    return matchOrigin && matchDest && matchDate;
  });
});

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
    prolonged: 'Prolongé'
  };
  return labels[status] || status;
};

onMounted(async () => {
  await availabilityStore.fetchPublicAvailabilities();
});

definePageMeta({ layout: 'guest' });
useHead({ title: 'Disponibilités - Bourse de Fret Bénin' });
</script>
