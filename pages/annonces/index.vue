<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <AnnoncesHeroSection />

    <div class="container-custom -mt-10">
      <!-- Search & Filters Card -->
      <AnnoncesFilters :active-tab="activeTab" v-model:avail-filters="availFilters" v-model:fret-filters="fretFilters"
        @update:active-tab="switchTab" @apply-fret-filters="applyFretFilters" @reset-fret-filters="resetFretFilters"
        @reset-avail-filters="resetAvailFilters" />

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
          {{ activeTab === 'avail' ? 'Aucun véhicule disponible' : 'Aucune annonce de fret trouvée' }}
        </h3>
        <p class="text-gray-500 px-4">
          {{ activeTab === 'avail' ?
            "Il n'y a pas de véhicules correspondant à vos critères pour le moment."
            : "Aucun chargement n'est disponible avec ces filtres actuellement." }}
        </p>
      </div>

      <!-- List Results -->
      <div v-else>
        <!-- Availabilities Grid -->
        <AnnoncesAvailabilitiesList v-if="activeTab === 'avail'" :items="filteredAvailabilities"
          @open-rate-modal="openRateModal" />

        <!-- Fret Announcements Grid -->
        <AnnoncesFretList v-else :items="fretAnnouncements" />
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
          <ProfileRatingForm :targetId="rateTarget?.id" :targetRole="'carrier'" :initialData="rateTarget?.myReview"
            @success="handleRateSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { usePbcAvailabilityStore } from '~/stores/pbcAvailability';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useRoute } from 'vue-router';
import { IconLoader2, IconTruckOff, IconPackageOff, IconX } from '@tabler/icons-vue';

const pbcAvailStore = usePbcAvailabilityStore();
const fretStore = usePbcAnnouncementStore();
const router = useRouter();
const route = useRoute();

const showRatingModal = ref(false);
const rateTarget = ref<any>(null);

const openRateModal = (carrier: any) => {
  rateTarget.value = carrier;
  showRatingModal.value = true;
};

const handleRateSuccess = (data: { rating: number, reviewsCount: number, myReview: any }) => {
  if (rateTarget.value) {
    rateTarget.value.rating = data.rating;
    rateTarget.value.reviewsCount = data.reviewsCount;
    rateTarget.value.myReview = data.myReview;
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
  return pbcAvailStore.availabilities.filter(item => {
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
  return fretStore.filteredAnnouncements.map(a => {
    return {
      ...a,
      user: a.shipper || a.user,
      shipper: a.shipper
    };
  });
});

const loading = computed(() => activeTab.value === 'avail' ? pbcAvailStore.loading : fretStore.loading);
const isEmpty = computed(() => {
  if (activeTab.value === 'avail') return filteredAvailabilities.value.length === 0;
  return fretAnnouncements.value.length === 0;
});

const applyFretFilters = () => {
  const cleanFilters = { ...fretFilters.value };
  if (cleanFilters.cargoType === '') delete (cleanFilters as any).cargoType;
  fretStore.setFilters(cleanFilters as any);
};

const resetFretFilters = () => {
  fretFilters.value = { originCity: '', destinationCity: '', cargoType: '', minBudget: undefined };
  fretStore.resetFilters();
};

const resetAvailFilters = () => {
  availFilters.value = { origin: '', destination: '', date: '' };
};

const switchTab = (tab: 'avail' | 'fret') => {
  activeTab.value = tab;
  router.push({ query: { tab } });
};

// Data Fetching
const fetchData = async () => {
  if (activeTab.value === 'avail') {
    await pbcAvailStore.fetchPbcAvailabilities();
  } else {
    const params: any = {};
    if (fretFilters.value.originCity) params.originCity = fretFilters.value.originCity;
    if (fretFilters.value.destinationCity) params.destinationCity = fretFilters.value.destinationCity;
    if (fretFilters.value.cargoType) params.cargoType = fretFilters.value.cargoType;
    if (fretFilters.value.minBudget) params.minBudget = fretFilters.value.minBudget;

    await fretStore.fetchPbcAnnouncements(params);
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
  fetchData();
});

onMounted(() => {
  handleQueryParams();
  fetchData();
});

definePageMeta({ layout: 'guest' });
useHead({
  title: 'Marché du Fret',
  meta: [
    {
      name: 'description',
      content: 'Trouvez et proposez des offres de fret et des véhicules disponibles. Connectez-vous avec des transporteurs et expéditeurs de confiance.'
    }
  ]
});
</script>
