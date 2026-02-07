<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Opportunités de Transport</h1>
          <p class="text-gray-500">Consultez les trajets disponibles et réservez votre place.</p>
        </div>
        <NuxtLink to="/app/us/avail" class="btn btn-outline btn-primary">
          <IconHistory class="w-5 h-5 mr-2" />
          Mes Inscriptions
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Origine</label>
            <input v-model="filters.origin" type="text" placeholder="Départ..." class="input" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</label>
            <input v-model="filters.destination" type="text" placeholder="Arrivée..." class="input" />
          </div>
          <div class="flex items-end">
            <div class="flex-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Type de Véhicule</label>
              <select v-model="filters.type" class="input mt-1">
                <option value="">Tous les véhicules</option>
                <option value="truck">Poids lourd (TBR)</option>
                <option value="van">Fourgon</option>
                <option value="pickup">Pick-up</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 h-48 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else-if="filteredAvailabilities.length === 0" class="text-center py-20">
        <IconTruckOff class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold">Aucun trajet disponible</h3>
        <p class="text-gray-500">Essayez d'autres filtres ou revenez plus tard.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="item in filteredAvailabilities" :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden relative group">

          <!-- New Badge -->
          <div v-if="isNew(item.createdAt)" class="absolute top-4 left-4 z-10">
            <span
              class="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Nouveau</span>
          </div>

          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-primary-600">
                  <IconTruck class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white leading-tight">{{ item.origin.city }}</h3>
                  <IconArrowRight class="w-3 h-3 text-gray-400 my-1" />
                  <h3 class="font-bold text-gray-900 dark:text-white leading-tight">{{ item.destination?.city ||
                    'Ouvert' }}</h3>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-black text-primary-600">{{ item.price || 'S.D' }} <span
                    class="text-xs font-normal">FCFA</span></p>
                <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tarif</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
              <span
                class="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <IconCalendar class="w-3 h-3 mr-1" /> {{ formatDateShort(item.startDate) }}
              </span>
              <span
                class="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <IconPackage class="w-3 h-3 mr-1" /> {{ item.vehicle?.capacity }} kg
              </span>
              <span
                class="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
                <IconUsers class="w-3 h-3 mr-1" /> {{ item.currentRequests }} inscrits
              </span>
            </div>

            <div class="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-4">
              <div class="flex items-center">
                <div
                  class="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold flex items-center justify-center mr-2">
                  {{ item.carrier?.firstname?.[0] }}
                </div>
                <span class="text-xs font-medium text-gray-600">{{ item.carrier?.firstname }}</span>
              </div>
              <NuxtLink :to="`/avail/${item.id}`" class="btn btn-primary btn-sm rounded-xl px-4">
                S'inscrire
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
import {
  IconHistory, IconTruck, IconArrowRight, IconCalendar,
  IconPackage, IconUsers, IconTruckOff
} from '@tabler/icons-vue';

const availabilityStore = useAvailabilityStore();
const loading = computed(() => availabilityStore.loading);
const availabilities = computed(() => availabilityStore.availabilities);

const filters = ref({
  origin: '',
  destination: '',
  type: ''
});

const filteredAvailabilities = computed(() => {
  return availabilities.value.filter(item => {
    const matchOrigin = !filters.value.origin || item.origin.city.toLowerCase().includes(filters.value.origin.toLowerCase());
    const matchDest = !filters.value.destination || (item.destination?.city || '').toLowerCase().includes(filters.value.destination.toLowerCase());
    const matchType = !filters.value.type || item.vehicle?.type === filters.value.type;
    return matchOrigin && matchDest && matchType;
  });
});

const isNew = (date: string) => {
  if (!date) return false;
  const created = new Date(date).getTime();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return created > weekAgo;
};

const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

onMounted(async () => {
  await availabilityStore.fetchPublicAvailabilities();
});

definePageMeta({ layout: 'default' });
useHead({ title: 'Opportunités - Bourse de Fret' });
</script>
