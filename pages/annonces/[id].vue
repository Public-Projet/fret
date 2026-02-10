<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des détails...</p>
      </div>

      <!-- Availability View -->
      <AnnoncesAvailDetails v-else-if="dataType === 'avail' && item" :item="item" :is-owner="isOwner"
        :already-enrolled="alreadyEnrolled" :can-rate="canRate" @enroll="enroll"
        @show-rating-modal="showRatingModal = true" />

      <!-- Offer View -->
      <AnnoncesOfferDetails v-else-if="dataType === 'offer' && item" :item="item" :is-owner="isOwner"
        :can-rate="canRate" :rating-label="ratingLabel" @show-rating-modal="showRatingModal = true" />

      <div v-else class="text-center py-20">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-lg text-gray-500">Détails non trouvés ou erreur de chargement.</p>
        <NuxtLink to="/annonces" class="btn btn-primary mt-4">Retour au marché</NuxtLink>
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
          <RatingForm :targetId="dataType === 'avail' ? item.carrier?.id : item.user?.id"
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
import { useAnnouncementStore } from '~/stores/announcement';
import { useAuthStore } from '~/stores/auth';
import { IconLoader2, IconAlertCircle, IconX } from '@tabler/icons-vue';
import RatingForm from '~/components/profile/RatingForm.vue';

const route = useRoute();
const availStore = useAvailabilityStore();
const fretStore = useAnnouncementStore();
const authStore = useAuthStore();

const id = route.params.id as string;
const dataType = ref<'avail' | 'offer' | null>((route.query.type as any) || null);
const item = ref<any>(null);
const loading = ref(true);
const showRatingModal = ref(false);

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

const enroll = async () => {
  if (dataType.value === 'avail') {
    await availStore.enrollAvailability(id);
  }
};

const fetchData = async () => {
  loading.value = true;

  // Try to load based on type or try both
  if (dataType.value === 'avail') {
    const res = await availStore.fetchPublicAvailability(id);
    if (res.success) item.value = res.availability;
  } else if (dataType.value === 'offer') {
    const res = await fretStore.fetchAnnouncementById(id);
    // Announcement store might update its state directly
    item.value = fretStore.currentAnnouncement;
  } else {
    // Try both
    const resAvail = await availStore.fetchPublicAvailability(id);
    if (resAvail.success) {
      item.value = resAvail.availability;
      dataType.value = 'avail';
    } else {
      const resOffer = await fretStore.fetchAnnouncementById(id);
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
});

definePageMeta({ layout: 'guest' });
useHead({ title: 'Détails - Bourse de Fret' });
</script>
