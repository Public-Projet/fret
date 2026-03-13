<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Opportunités de Transport</h1>
          <p class="text-gray-500 font-medium mt-1">Consultez les trajets disponibles et réservez votre chargement</p>
        </div>
        <NuxtLink to="/app/us/avail" 
          class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center active:scale-95">
          <IconHistory class="w-5 h-5 mr-2 text-primary-500" />
          Mes Inscriptions
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 mb-10 border border-white dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Origine</label>
            <div class="relative">
              <input v-model="filters.origin" type="text" placeholder="Ville de départ..." 
                class="w-full pl-11 pr-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-sm" />
              <IconMapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
            <div class="relative">
              <input v-model="filters.destination" type="text" placeholder="Ville d'arrivée..." 
                class="w-full pl-11 pr-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-sm" />
              <IconMapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Type de Véhicule</label>
            <div class="relative">
              <select v-model="filters.type" 
                class="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-sm appearance-none">
                <option value="">Tous les véhicules</option>
                <option value="truck">🚛 Poids lourd (TBR)</option>
                <option value="van">🚐 Fourgon</option>
                <option value="pickup">🛻 Pick-up</option>
              </select>
              <IconTruck class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Feed -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="i in 4" :key="i" class="bg-white/50 dark:bg-gray-800/50 h-64 rounded-3xl animate-pulse"></div>
      </div>

      <div v-else-if="filteredAvailabilities.length === 0" class="text-center py-24">
        <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
          <IconTruckOff class="w-12 h-12" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Aucun trajet disponible</h3>
        <p class="text-gray-500 font-medium">Réessayez avec d'autres critères ou revenez plus tard.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="item in filteredAvailabilities" :key="item.id"
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 hover:shadow-2xl transition-all overflow-hidden relative group">

          <!-- New Badge -->
          <div v-if="isNew(item.createdAt)" class="absolute top-6 right-6 z-10">
            <span
              class="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">Nouveau</span>
          </div>

          <div class="p-8">
            <div class="flex justify-between items-start mb-8">
              <div class="flex items-center space-x-5">
                <div
                  class="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                  <IconTruck class="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div>
                  <h3 class="font-black text-xl text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{{ item.origin.city }}</h3>
                  <div class="flex items-center text-primary-500 my-1 py-1 px-2 bg-primary-50 dark:bg-primary-900/30 w-max rounded-lg">
                    <IconArrowDown class="w-4 h-4" />
                  </div>
                  <h3 class="font-black text-xl text-primary-600 leading-tight uppercase tracking-tight">{{ item.destination?.city || 'Libre' }}</h3>
                </div>
              </div>
              <div class="text-right pt-2">
                <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Prix suggéré</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                  {{ item.price?.toLocaleString() || 'S.D' }}
                  <span class="text-sm font-bold ml-1">FCFA</span>
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-8">
              <span
                class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center border border-gray-100 dark:border-gray-700">
                <IconCalendar class="w-3.5 h-3.5 mr-2 text-primary-500" /> {{ formatDateShort(item.startDate) }}
              </span>
              <span
                class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center border border-gray-100 dark:border-gray-700">
                <IconPackage class="w-3.5 h-3.5 mr-2 text-amber-500" /> {{ item.vehicle?.capacity?.toLocaleString() }} kg
              </span>
              <span
                class="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-[11px] font-black text-emerald-600 uppercase tracking-wider flex items-center border border-emerald-100 dark:border-emerald-900/30">
                <IconUsers class="w-3.5 h-3.5 mr-2" /> {{ item.currentRequests }} inscrits
              </span>
            </div>

            <div class="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-6">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 rounded-full bg-primary-600 text-white font-black flex items-center justify-center mr-3 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                  {{ item.carrier?.firstname?.[0] }}
                </div>
                <div>
                  <span class="text-sm font-black text-gray-900 dark:text-white">{{ item.carrier?.firstname }}</span>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Transporteur</p>
                </div>
              </div>
              
              <template v-if="availabilityStore.isEnrolled(item.id)">
                <div class="flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <IconCheck class="w-5 h-5 mr-2" />
                  <span class="text-sm font-black uppercase tracking-wider">Inscrit</span>
                </div>
              </template>
              <NuxtLink v-else :to="`/annonces/${item.id}?type=avail`" 
                class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 text-sm uppercase tracking-wider">
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
useHead({
  title: 'Opportunités',
  meta: [
    { name: 'description', content: 'Trouvez et parcourez les véhicules disponibles pour vos expéditions.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
