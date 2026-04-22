<template>
  <div class="container-custom py-8 min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mes propositions d'offres</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Suivez l'état de vos offres soumises aux expéditeurs</p>
      </div>
      <NuxtLink to="/annonces?tab=fret" 
        class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center group active:scale-95">
        <IconSearch class="w-5 h-5 mr-2" />
        Trouver du fret
      </NuxtLink>
    </div>

    <!-- Filtres et Liste -->
    <div
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 overflow-hidden">
      <div
        class="p-6 border-b border-gray-100 dark:border-gray-700">
        <div class="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          <button v-for="status in ['all', 'pending', 'negotiating', 'accepted', 'rejected', 'completed']"
            :key="status" @click="currentFilter = status" 
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300',
              currentFilter === status
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
            ]">
            {{ getStatusLabel(status) }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-20 text-center">
        <div class="relative w-16 h-16 mx-auto">
          <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-gray-500 font-medium">Chargement de vos offres...</p>
      </div>

      <div v-else-if="filteredOffers.length === 0" class="p-20 text-center">
        <div class="mx-auto h-20 w-20 bg-gray-50 dark:bg-gray-700/50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
          <IconSend class="w-10 h-10" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Aucune offre trouvée</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Vous n'avez pas encore d'offres correspondant à ce filtre.</p>
        <div v-if="currentFilter === 'all'" class="mt-8 px-4">
          <NuxtLink to="/annonces?tab=fret" class="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 inline-flex items-center justify-center w-full sm:w-auto">
            Explorer les annonces
          </NuxtLink>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
        <div v-for="offer in filteredOffers" :key="offer.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all group">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-3">
                <span :class="getStatusClass(offer.status)">
                  {{ getStatusLabel(offer.status) }}
                </span>
                <span class="text-xs font-medium text-gray-400 tabular-nums">Offre #{{ String(offer.id || '').slice(0, 8) }}</span>
              </div>
              
              <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                <NuxtLink :to="`/annonces/${offer.announcement?.id}?type=offer`">
                  {{ offer.announcement?.title || 'Annonce supprimée' }}
                </NuxtLink>
              </h3>

              <p v-if="offer.message" class="text-sm text-gray-500 dark:text-gray-400 italic mb-4 line-clamp-1">
                "{{ offer.message }}"
              </p>

              <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div v-if="offer.announcement" class="flex items-center bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  <IconMapPin class="w-4 h-4 mr-2 text-primary-500" />
                  <span class="font-bold text-gray-700 dark:text-gray-300 truncate">{{ offer.announcement?.origin?.city }}</span>
                  <IconArrowRight class="w-3 h-3 mx-2" />
                  <span class="font-bold text-gray-700 dark:text-gray-300 truncate">{{ offer.announcement?.destination?.city }}</span>
                </div>
                <div class="flex items-center px-1">
                  <IconCalendar class="w-4 h-4 mr-2 text-primary-500" />
                  <span>Soumis le <span class="font-bold text-gray-700 dark:text-gray-300">{{ formatDate(offer.createdAt) }}</span></span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
              <div class="text-left lg:text-right">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Votre Prix</p>
                <p class="text-2xl font-black text-primary-600 leading-none">
                  {{ offer.price.toLocaleString() }} <span class="text-sm font-bold">FCFA</span>
                </p>
              </div>

              <div class="flex items-center gap-2">
                <NuxtLink :to="`/annonces/${offer.announcement?.id}?type=offer`" 
                  class="btn btn-sm btn-outline flex items-center">
                  <IconEye class="w-4 h-4 mr-1" />
                  Détails
                </NuxtLink>
                <NuxtLink to="/app/messages" 
                  class="btn btn-sm btn-primary flex items-center">
                  <IconMessage class="w-4 h-4 mr-1" />
                  Négocier
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useMessagingStore } from '~/stores/messaging';
import { IconCalendar, IconMapPin, IconSearch, IconEye, IconMessage, IconSend, IconArrowRight } from '@tabler/icons-vue';

const authStore = useCmnAuthStore();
const messagingStore = useMessagingStore();
const currentFilter = ref('all');

const loading = computed(() => messagingStore.loading);
const currentUser = computed(() => authStore.currentUser);

const myOffers = computed(() => {
  if (!currentUser.value) return [];
  return messagingStore.offers;
});

const filteredOffers = computed(() => {
  if (currentFilter.value === 'all') return myOffers.value;
  return myOffers.value.filter(o => o.status === currentFilter.value);
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    all: 'Toutes',
    pending: 'En attente',
    negotiating: 'En négociation',
    accepted: 'Acceptée',
    completed: 'Terminée',
    rejected: 'Refusée'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const baseClass = 'badge';
  switch (status) {
    case 'pending': return `${baseClass} badge-info`;
    case 'negotiating': return `${baseClass} badge-warning`;
    case 'accepted': return `${baseClass} badge-success`;
    case 'completed': return `${baseClass} badge-neutral`;
    case 'rejected': return `${baseClass} badge-danger`;
    default: return `${baseClass} badge-neutral`;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  messagingStore.fetchCarrierOffers();
});

useHead({
  title: 'Mes offres soumises',
  meta: [
    { name: 'description', content: 'Gérez vos offres soumises aux expéditeurs sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
