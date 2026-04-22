<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
            <IconCalendarCheck class="w-10 h-10 mr-4 text-primary-600 drop-shadow-sm" />
            Mes disponibilités
          </h1>
          <p class="text-gray-500 font-medium mt-1">Publiez et gérez vos trajets pour recevoir des offres de fret</p>
        </div>
        <NuxtLink to="/app/uc/avail/create"
          class="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 flex items-center justify-center group active:scale-95 w-full md:w-auto">
          <IconPlus class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Publier une disponibilité
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin">
          </div>
        </div>
        <p class="text-gray-500 font-bold">Chargement de vos trajets...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="availabilities.length === 0"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <div
          class="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
          <IconTruck class="w-12 h-12 opacity-30" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Aucune disponibilité publiée
        </h3>
        <p class="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
          Dites aux chargeurs où et quand vos véhicules sont disponibles pour maximiser vos revenus.
        </p>
        <NuxtLink to="/app/uc/avail/create"
          class="inline-flex px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95">
          Publier ma première disponibilité
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <div v-for="item in availabilities" :key="item.id"
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8 group hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-2xl">

          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <div
                class="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 shadow-inner group-hover:scale-110 transition-transform">
                <IconTruck class="w-6 h-6" />
              </div>
              <h3 class="font-black text-xl text-gray-900 dark:text-white tracking-tight">
                {{ item.vehicle?.brand }} {{ item.vehicle?.model }}
                <span class="text-gray-400 font-bold ml-1 text-sm">({{ item.vehicle?.licensePlate || item.vehicle?.type
                }})</span>
              </h3>
              <span
                :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border', getStatusClass(item.status)]">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                <IconMapPin class="w-5 h-5 text-secondary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Trajet</p>
                  <p class="text-sm font-black text-gray-900 dark:text-white truncate">
                    {{ item.origin.city }}
                    <IconArrowRight class="w-3 h-3 text-primary-500 inline mx-1" />
                    <span class="text-primary-600">{{ item.destination?.city || 'Partout' }}</span>
                  </p>
                </div>
              </div>

              <div
                class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                <IconCalendar class="w-5 h-5 text-secondary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Période</p>
                  <p class="text-sm font-black text-gray-900 dark:text-white">
                    {{ formatDate(item.startDate) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                <IconCurrencyEuro v-if="item.price" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <IconUsers v-else class="w-5 h-5 text-secondary-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">{{ item.price ? 'Tarif' :
                    'Activités' }}</p>
                  <p class="text-sm font-black"
                    :class="item.price ? 'text-emerald-600' : 'text-gray-900 dark:text-white'">
                    {{ item.price ? `${item.price.toLocaleString()} FCFA` : `${item.bookings?.length || 0} Propositions`
                    }}
                  </p>
                </div>
              </div>
              <div
                class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                <IconEye class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Vues (tot./uniq.)</p>
                  <p class="text-sm font-black text-gray-900 dark:text-white">
                    {{ item.views || 0 }} / {{ item.uniqueViews || 0 }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end">
            <NuxtLink :to="`/app/uc/avail/${item.id}`"
              class="w-full md:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-black rounded-2xl hover:bg-secondary-600 hover:text-white transition-all text-center flex items-center justify-center group/btn active:scale-95">
              Voir détails
              <IconChevronRight class="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useAvailabilityStore } from '~/stores/availability';
import { IconCalendar, IconMapPin, IconPlus, IconTruck, IconCurrencyEuro, IconChevronRight, IconArrowRight, IconCalendarCheck, IconUsers, IconEye } from '@tabler/icons-vue';

const authStore = useCmnAuthStore();
const availabilityStore = useAvailabilityStore();

const availabilities = computed(() => availabilityStore.availabilities);
const loading = computed(() => availabilityStore.loading);

onMounted(() => {
  availabilityStore.fetchAvailabilities();
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-100 dark:border-emerald-800/50';
    case 'full': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border-amber-100 dark:border-amber-800/50';
    case 'expired': return 'bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600';
    case 'prolonged': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-100 dark:border-blue-800/50';
    default: return 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 border-gray-100 dark:border-gray-800/50';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

useHead({
  title: 'Mes disponibilités',
  meta: [
    { name: 'description', content: 'Gérez vos véhicules disponibles sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
