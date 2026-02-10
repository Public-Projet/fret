<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
      <div class="container-custom">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Marché du Fret & Transport</h1>
        <p class="text-primary-100 text-lg max-w-2xl">
          Trouvez des véhicules disponibles ou des annonces de fret à transporter dans tout le Bénin.
        </p>
      </div>
    </div>

    <div class="container-custom -mt-10">
      <!-- Search & Filters Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col space-y-6">
          <!-- Tabs Selection -->
          <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit self-center md:self-start">
            <button @click="switchTab('avail')"
              :class="activeTab === 'avail' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <IconTruck class="w-4 h-4" />
              Disponibilités
            </button>
            <button @click="switchTab('fret')"
              :class="activeTab === 'fret' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <IconPackage class="w-4 h-4" />
              Annonces Fret
            </button>
          </div>

          <!-- Availability Filters -->
          <div v-if="activeTab === 'avail'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Départ</label>
              <div class="relative">
                <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="availFilters.origin" type="text" placeholder="Ville de départ" class="input pl-10" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrivée</label>
              <div class="relative">
                <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="availFilters.destination" type="text" placeholder="Ville d'arrivée"
                  class="input pl-10" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
              <div class="relative">
                <IconCalendar class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="availFilters.date" type="date" class="input pl-10" />
              </div>
            </div>
            <div class="flex items-end">
              <button class="btn btn-primary w-full h-[42px]">
                <IconSearch class="w-5 h-5 mr-2" />
                Rechercher
              </button>
            </div>
          </div>

          <!-- Fret Filters -->
          <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Départ</label>
              <div class="relative">
                <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="fretFilters.originCity" type="text" placeholder="Ville de départ" class="input pl-10" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrivée</label>
              <div class="relative">
                <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="fretFilters.destinationCity" type="text" placeholder="Ville d'arrivée"
                  class="input pl-10" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Marchandise</label>
              <select v-model="fretFilters.cargoType" class="input">
                <option value="">Tous</option>
                <option value="palettes">Palettes</option>
                <option value="vrac">Vrac</option>
                <option value="conteneur">Conteneur</option>
                <option value="frigorifique">Frigorifique</option>
                <option value="dangereux">Dangereux</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <button @click="applyFretFilters" class="btn btn-primary flex-1 h-[42px]">
                <IconSearch class="w-5 h-5 mr-2" />
                Filtrer
              </button>
              <button @click="resetFretFilters" class="btn btn-ghost h-[42px]" title="Réinitialiser">
                <IconRefresh class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des données...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmpty"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <IconTruckOff v-if="activeTab === 'avail'" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <IconPackageOff v-else class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ activeTab === 'avail' ? 'Aucune disponibilité trouvée' : 'Aucune annonce trouvée' }}
        </h3>
        <p class="text-gray-500">Essayez de modifier vos filtres ou revenez plus tard.</p>
      </div>

      <!-- List Results -->
      <div v-else>
        <!-- Availabilities Grid -->
        <div v-if="activeTab === 'avail'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in filteredAvailabilities" :key="item.id"
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
                    <img v-if="item.carrier?.photoUrl" :src="item.carrier.photoUrl"
                      class="w-full h-full object-cover" />
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
                    <button v-if="canRateCarrier(item.carrier)" @click.stop.prevent="openRateModal(item.carrier)"
                      class="text-[10px] bg-secondary-50 text-secondary-600 px-2 py-0.5 rounded-full mt-1 hover:bg-secondary-100 transition-colors font-medium">
                      {{ item.carrier?.myReview ? 'Modifier avis' : 'Noter' }}
                    </button>
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


        <!-- Fret Announcements Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UtilsCard v-for="announcement in fretAnnouncements" :key="announcement.id" :announcement="announcement"
            detailRoute="/annonces" />
        </div>
      </div>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      @click.self="showRatingModal = false">
      <div class="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div class="relative">
          <button @click="showRatingModal = false"
            class="absolute -top-12 right-0 text-white hover:text-secondary-400 transition-colors flex items-center text-xs font-black uppercase tracking-widest">
            Fermer
            <IconX class="ml-2 w-5 h-5" />
          </button>
          <RatingForm :targetId="rateTarget?.id" :targetRole="'carrier'" :initialData="rateTarget?.myReview"
            @success="handleRateSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAvailabilityStore } from '~/stores/availability';
import { useAnnouncementStore } from '~/stores/announcement';
import { useAuthStore } from '~/stores/auth';
import { useRoute } from 'vue-router';
import {
  IconMapPin, IconCalendar, IconSearch, IconLoader2, IconTruckOff,
  IconTruck, IconMapPinFilled, IconStarFilled, IconPackage, IconRefresh, IconPackageOff, IconX
} from '@tabler/icons-vue';
import RatingForm from '~/components/profile/RatingForm.vue';

const availStore = useAvailabilityStore();
const fretStore = useAnnouncementStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showRatingModal = ref(false);
const rateTarget = ref<any>(null);

const canRateCarrier = (carrier: any) => {
  if (!authStore.isAuthenticated || !authStore.isShipper) return false;
  return true;
};

const openRateModal = (carrier: any) => {
  rateTarget.value = carrier;
  showRatingModal.value = true;
};

const handleRateSuccess = (data: { rating: number, reviewsCount: number, myReview: any }) => {
  if (rateTarget.value) {
    rateTarget.value.rating = data.rating;
    rateTarget.value.reviewsCount = data.reviewsCount;
    // We might need to refresh strict data or update local state if myReview is returned
    // Assuming backend returns compiled rating.
    // Also update myReview locally to toggle button state
    rateTarget.value.myReview = data.myReview;

    // Also update in the list if necessary (though rateTarget is a reference to the item in list)
  }
  showRatingModal.value = false;
};

const activeTab = ref<'avail' | 'fret'>('avail');

// Availability State
const availFilters = ref({
  origin: '',
  destination: '',
  date: ''
});

const filteredAvailabilities = computed(() => {
  return availStore.availabilities.filter(item => {
    // Filter by User if provided in query
    const matchUserId = !route.query.userId || String(item.carrier?.id) === String(route.query.userId);
    if (!matchUserId) return false;

    const matchOrigin = !availFilters.value.origin || item.origin.city.toLowerCase().includes(availFilters.value.origin.toLowerCase());
    const matchDest = !availFilters.value.destination || (item.destination?.city || '').toLowerCase().includes(availFilters.value.destination.toLowerCase());
    const matchDate = !availFilters.value.date || item.startDate.includes(availFilters.value.date);
    return matchOrigin && matchDest && matchDate;
  });
});

// Fret State
const fretFilters = ref({
  originCity: '',
  destinationCity: '',
  cargoType: '' as string,
  minBudget: undefined
});

const fretAnnouncements = computed(() => {
  let filtered = fretStore.filteredAnnouncements;
  if (route.query.userId) {
    filtered = filtered.filter(a => String(a.userId) === String(route.query.userId));
  }
  return filtered;
});

const loading = computed(() => activeTab.value === 'avail' ? availStore.loading : fretStore.loading);
const isEmpty = computed(() => {
  if (activeTab.value === 'avail') return filteredAvailabilities.value.length === 0;
  return fretAnnouncements.value.length === 0;
});

// Common Methods
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

const applyFretFilters = () => {
  const cleanFilters = { ...fretFilters.value };
  if (cleanFilters.cargoType === '') delete (cleanFilters as any).cargoType;
  fretStore.setFilters(cleanFilters as any);
};

const resetFretFilters = () => {
  fretFilters.value = { originCity: '', destinationCity: '', cargoType: '', minBudget: undefined };
  fretStore.resetFilters();
};

const switchTab = (tab: 'avail' | 'fret') => {
  activeTab.value = tab;
  router.push({ query: { tab } });
};

const navigateToDetail = (id: string) => {
  router.push(`/annonces/${id}?type=offer`);
};

// Data Fetching
const fetchData = async () => {
  if (activeTab.value === 'avail') {
    await availStore.fetchPublicAvailabilities();
  } else {
    await fretStore.fetchAnnouncements();
  }
};

// Handle Query Params
const handleQueryParams = () => {
  if (route.query.tab === 'fret') {
    activeTab.value = 'fret';
  } else if (route.query.tab === 'avail') {
    activeTab.value = 'avail';
  }
};

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'fret' || newTab === 'avail') {
    activeTab.value = newTab as 'avail' | 'fret';
  }
});

watch(activeTab, (newTab) => {
  // Sync tab to query without full reload if desired, or just fetch
  // router.replace({ query: { ...route.query, tab: newTab } });
  fetchData();
});

onMounted(() => {
  handleQueryParams();
  fetchData();
});

definePageMeta({ layout: 'guest' });
useHead({ title: 'Marché du Fret - Bourse de Fret' });
</script>
