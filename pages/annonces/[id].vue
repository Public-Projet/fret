<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom px-4 md:px-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500 font-medium">Récupération des informations...</p>
      </div>

      <!-- Availability View -->
      <AnnoncesAvailDetails v-else-if="dataType === 'avail' && item" :item="item" :is-owner="isOwner"
        :already-enrolled="alreadyEnrolled" :can-rate="canRate" @enroll="enroll"
        @show-rating-modal="showRatingModal = true" @refresh="fetchData" @counter="startCounterNegotiation" />

      <!-- Offer View -->
      <AnnoncesOfferDetails v-else-if="(dataType === 'offer' || dataType === 'fret') && item" :item="item"
        :is-owner="isOwner" :can-rate="canRate" :rating-label="ratingLabel" @show-rating-modal="showRatingModal = true"
        @enroll="enroll" @refresh="fetchData" @counter="startCounterNegotiation" />

      <div v-else class="text-center py-20">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-lg text-gray-500">Détails non trouvés ou erreur de chargement.</p>
        <NuxtLink to="/annonces" class="btn btn-primary mt-4">Retour au marché</NuxtLink>
      </div>
    </div>

    <!-- Negotiation Modal -->
    <AnnoncesNegotiationModal v-if="showNegotiationModal" :targetId="id"
      :dataType="dataType === 'avail' ? 'avail' : 'announcement'" :originalPrice="item?.price || item?.budget"
      :originalOrigin="item?.origin" :originalDestination="item?.destination" :initial-data="selectedProposalForCounter"
      @close="closeNegotiationModal" @success="handleNegotiationSuccess" />

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
          <ProfileRatingForm :targetId="dataType === 'avail' ? item.carrier?.id : item.user?.id"
            :targetRole="dataType === 'avail' ? 'carrier' : 'shipper'" :initialData="null"
            @success="handleRatingSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAvailabilityStore } from '~/stores/availability';
import { usePbcAvailabilityStore } from '~/stores/pbcAvailability';
import { useShpAvailabilityStore } from '~/stores/shpAvailability';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconLoader2, IconAlertCircle, IconX } from '@tabler/icons-vue';

const route = useRoute();
const availStore = useAvailabilityStore();
const pbcAvailStore = usePbcAvailabilityStore();
const shpAvailStore = useShpAvailabilityStore();
const fretStore = usePbcAnnouncementStore();
const authStore = useCmnAuthStore();

const id = route.params.id as string;
const dataType = ref<'avail' | 'fret' | 'offer' | null>((route.query.type as any) || null);
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
    await shpAvailStore.fetchShpEnrollments();
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

const isOwner = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user?.id || !item.value) return false;

  if (dataType.value === 'avail') {
    const carrierId = item.value?.carrier?.id;
    return authStore.isCarrier && carrierId && String(carrierId) === String(authStore.user.id);
  }
  const userId = item.value?.userId;
  return authStore.isShipper && userId && String(userId) === String(authStore.user.id);
});

const alreadyEnrolled = computed(() => {
  if (dataType.value === 'avail') {
    return availStore.isEnrolled(id);
  }
  return false;
});

const canRate = computed(() => {
  if (!authStore.isAuthenticated || isOwner.value || !item.value) return false;
  if (dataType.value === 'avail') {
    return authStore.isShipper;
  }

  return authStore.isCarrier;
});

const ratingLabel = computed(() => {
  const hasReview = dataType.value === 'avail' ? item.value?.carrier?.myReview : item.value?.user?.myReview;
  return hasReview ? 'Modifier mon avis' : 'Noter cet expéditeur';
});

const handleRatingSuccess = (data: { rating: number, reviewsCount: number, myReview: any }) => {
  showRatingModal.value = false;
  if (dataType.value === 'avail') {
    if (item.value.carrier) {
      item.value.carrier.rating = data.rating;
      item.value.carrier.reviewCount = data.reviewsCount;
      item.value.carrier.myReview = data.myReview;
    }
  } else {
    if (item.value.user) {
      item.value.user.rating = data.rating;
      item.value.user.reviewCount = data.reviewsCount;
      item.value.user.myReview = data.myReview;
    }
  }
};

const enroll = () => {
  showNegotiationModal.value = true;
};

const fetchData = async () => {
  loading.value = true;

  // Try to load based on type or try both
  if (dataType.value === 'avail') {
    const res = await pbcAvailStore.fetchPbcMineAvailability(id);
    if (res.success) item.value = res.availability;
  } else if (dataType.value === 'offer' || dataType.value === 'fret') {
    const res = await fretStore.getPbcAnnouncements(id);
    item.value = fretStore.currentAnnouncement;
  } else {
    const resAvail = await pbcAvailStore.fetchPbcMineAvailability(id);
    if (resAvail.success) {
      item.value = resAvail.availability;
      dataType.value = 'avail';
    } else {
      const resOffer = await fretStore.getPbcAnnouncements(id);
      if (resOffer) {
        item.value = fretStore.currentAnnouncement;
        dataType.value = 'offer';
      }
    }
  }

  loading.value = false;
};

onMounted(() => {
  fetchData();
  if (authStore.isAuthenticated && authStore.isShipper) {
    shpAvailStore.fetchShpEnrollments();
  }
});

definePageMeta({ layout: 'guest' });
useHead({
  title: computed(() => item.value ? `Détails de l'annonce` : 'Détails'),
  meta: [
    {
      name: 'description',
      content: 'Consultez les détails de cette annonce de fret ou de véhicule disponible sur Bourse de Fret pour trouver votre partenaire idéal.'
    }
  ]
});
</script>
