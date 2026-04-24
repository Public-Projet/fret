<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des détails...</p>
      </div>

      <!-- Availability View -->
      <AnnoncesAvailDetails v-else-if="item" :item="item" :is-owner="false" :already-enrolled="alreadyEnrolled"
        :can-rate="canRate" @enroll="enroll" @show-rating-modal="showRatingModal = true" @refresh="fetchData"
        @counter="startCounterNegotiation" />

      <div v-else class="text-center py-20">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-lg text-gray-500">Détails non trouvés ou erreur de chargement.</p>
        <NuxtLink to="/app/us/avail" class="btn btn-primary mt-4">Retour aux opportunités</NuxtLink>
      </div>
    </div>

    <!-- Negotiation Modal -->
    <AnnoncesNegotiationModal v-if="showNegotiationModal" :targetId="id" :dataType="'avail'"
      :originalPrice="item?.price || item?.budget" :originalOrigin="item?.origin"
      :originalDestination="item?.destination" :initial-data="selectedProposalForCounter" @close="closeNegotiationModal"
      @success="handleNegotiationSuccess" />

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
          <ProfileRatingForm :targetId="item.carrier?.id" :targetRole="'carrier'" :initialData="null"
            @success="handleRatingSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useShpAvailabilityStore } from '~/stores/shpAvailability';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconLoader2, IconAlertCircle, IconX } from '@tabler/icons-vue';

const route = useRoute();
const availStore = useShpAvailabilityStore();
const authStore = useCmnAuthStore();

const id = route.params.id as string;
const item = ref<any>(null);
const loading = ref(true);
const showRatingModal = ref(false);
const showNegotiationModal = ref(false);
const selectedProposalForCounter = ref<any>(null);

const handleNegotiationSuccess = async () => {
  showNegotiationModal.value = false;
  selectedProposalForCounter.value = null;
  await fetchData();
  if (authStore.isAuthenticated && authStore.isShipper) {
    await availStore.fetchShipperEnrollments();
  }
};

const startCounterNegotiation = (proposal: any) => {
  selectedProposalForCounter.value = proposal;
  showNegotiationModal.value = true;
};

const closeNegotiationModal = () => {
  showNegotiationModal.value = false;
  selectedProposalForCounter.value = null;
};

const alreadyEnrolled = computed(() => {
  return availStore.isEnrolled(id);
});

const canRate = computed(() => {
  if (!authStore.isAuthenticated || !item.value) return false;
  return authStore.isShipper;
});

const handleRatingSuccess = (data: { rating: number, reviewsCount: number, myReview: any }) => {
  showRatingModal.value = false;
  if (item.value.carrier) {
    item.value.carrier.rating = data.rating;
    item.value.carrier.reviewCount = data.reviewsCount;
    item.value.carrier.myReview = data.myReview;
  }
};

const enroll = () => {
  showNegotiationModal.value = true;
};

const fetchData = async () => {
  loading.value = true;
  const res = await availStore.fetchShpMineAvailability();
  if (res.success) {
    item.value = res.availability;
  }
  loading.value = false;
};

onMounted(() => {
  fetchData();
  if (authStore.isAuthenticated && authStore.isShipper) {
    availStore.fetchShipperEnrollments();
  }
});

definePageMeta({ layout: 'default' });
useHead({
  title: computed(() => item.value ? `Détails de l'opportunité` : 'Détails'),
  meta: [
    { name: 'description', content: 'Consultez les détails de cette disponibilité.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
