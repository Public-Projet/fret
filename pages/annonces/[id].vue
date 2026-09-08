<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50/80 to-gray-100/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24 pt-8 md:pt-12">
    <div class="container-custom px-4 md:px-6">
      <Transition name="fade" mode="out-in">
        <RootAnnonceDetailLoading v-if="loading" />

        <!-- Availability View -->
        <CommonAvailDetails v-else-if="dataType === 'avail' && item" :item="item" :is-owner="isOwner"
          :already-enrolled="alreadyEnrolled" :can-rate="canRate" @enroll="enroll"
          @show-rating-modal="showRatingModal = true" @refresh="fetchData" @counter="startCounterNegotiation" />

        <!-- Offer View -->
        <RootAnnonceDetailOffer v-else-if="(dataType === 'offer' || dataType === 'fret') && item" :item="item"
          :is-owner="isOwner" :can-rate="canRate" :rating-label="ratingLabel" @show-rating-modal="showRatingModal = true"
          @enroll="enroll" @refresh="fetchData" @counter="startCounterNegotiation" />

        <!-- Fallback Error View -->
        <div v-else class="max-w-md mx-auto text-center py-16 px-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-5">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100 dark:border-red-900/30">
            <IconAlertCircle class="w-8 h-8" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-extrabold text-gray-900 dark:text-white">Annonce introuvable</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Les détails de cette annonce ne sont pas disponibles ou l'annonce a été retirée.</p>
          </div>
          <NuxtLink to="/annonces" class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm shadow-md shadow-primary-500/20 transition-all">
            <IconArrowLeft class="w-4 h-4" />
            <span>Retour au marché</span>
          </NuxtLink>
        </div>
      </Transition>
    </div>

    <!-- Negotiation Modal -->
    <ModalAnnonceNegotiation v-if="showNegotiationModal" :targetId="id"
      :dataType="dataType === 'avail' ? 'avail' : 'announcement'" :originalPrice="item?.price || item?.budget"
      :originalOrigin="item?.origin" :originalDestination="item?.destination" :initial-data="selectedProposalForCounter"
      @close="closeNegotiationModal" @success="handleNegotiationSuccess" />

    <!-- Rating Modal -->
    <ModalGlobalRatingForm :show="showRatingModal"
      :targetId="dataType === 'avail' ? item?.carrier?.id || '' : item?.user?.id || item?.shipper?.id || ''"
      :targetRole="dataType === 'avail' ? 'carrier' : 'shipper'"
      :initialData="dataType === 'avail' ? item?.carrier?.myReview : (item?.user?.myReview || item?.shipper?.myReview)"
      @close="showRatingModal = false" @success="handleRatingSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePbcAvailabilityStore } from '~/stores/pbcAvailability';
import { useShpAvailabilityStore } from '~/stores/shpAvailability';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-vue';

const route = useRoute();
const pbcAvailStore = usePbcAvailabilityStore();
const shpAvailStore = useShpAvailabilityStore();
const fretStore = usePbcAnnouncementStore();
const shpAnnouncementStore = useShpAnnouncementStore();
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
    const carrierId = item.value?.carrier?.id || item.value?.carrier;
    return authStore.isCarrier && carrierId && String(carrierId) === String(authStore.user.id);
  }

  const shipperId = item.value?.shipper?.id || item.value?.shipper || item.value?.userId || item.value?.user?.id;
  return authStore.isShipper && shipperId && String(shipperId) === String(authStore.user.id);
});

const alreadyEnrolled = computed(() => {
  if (dataType.value === 'avail') {
    return shpAvailStore.isEnrolled(id);
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
  const hasReview = dataType.value === 'avail' ? item.value?.carrier?.myReview : (item.value?.user?.myReview || item.value?.shipper?.myReview);
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
    const userObj = item.value.shipper || item.value.user;
    if (userObj) {
      userObj.rating = data.rating;
      userObj.reviewCount = data.reviewsCount;
      userObj.myReview = data.myReview;
    }
  }
};

const enroll = () => {
  selectedProposalForCounter.value = null;
  showNegotiationModal.value = true;
};

const fetchData = async () => {
  loading.value = true;

  try {
    if (dataType.value === 'avail') {
      const res = await pbcAvailStore.fetchPbcMineAvailability(id);
      if (res.success && res.availability) {
        item.value = res.availability;
      }
    } else if (dataType.value === 'offer' || dataType.value === 'fret') {
      if (authStore.isAuthenticated && authStore.isShipper) {
        const resShp = await shpAnnouncementStore.fetchShpAnnouncement(id);
        if (resShp.success && resShp.announcement) {
          item.value = resShp.announcement;
          await shpAnnouncementStore.fetchShpOffersForAnnouncement(id);
          item.value.offers = shpAnnouncementStore.offers.filter(
            (o: any) => String(o.announcementId || o.announcement?.id || o.announcement) === String(id)
          );
        } else {
          await fretStore.getPbcAnnouncements(id);
          item.value = fretStore.currentAnnouncement;
        }
      } else {
        await fretStore.getPbcAnnouncements(id);
        item.value = fretStore.currentAnnouncement;
      }
    } else {
      // Auto-detect type
      const resAvail = await pbcAvailStore.fetchPbcMineAvailability(id);
      if (resAvail.success && resAvail.availability) {
        item.value = resAvail.availability;
        dataType.value = 'avail';
      } else {
        if (authStore.isAuthenticated && authStore.isShipper) {
          const resShp = await shpAnnouncementStore.fetchShpAnnouncement(id);
          if (resShp.success && resShp.announcement) {
            item.value = resShp.announcement;
            dataType.value = 'offer';
            await shpAnnouncementStore.fetchShpOffersForAnnouncement(id);
            item.value.offers = shpAnnouncementStore.offers.filter(
              (o: any) => String(o.announcementId || o.announcement?.id || o.announcement) === String(id)
            );
          } else {
            await fretStore.getPbcAnnouncements(id);
            if (fretStore.currentAnnouncement) {
              item.value = fretStore.currentAnnouncement;
              dataType.value = 'offer';
            }
          }
        } else {
          await fretStore.getPbcAnnouncements(id);
          if (fretStore.currentAnnouncement) {
            item.value = fretStore.currentAnnouncement;
            dataType.value = 'offer';
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching detail:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  if (authStore.isAuthenticated && authStore.isShipper) {
    shpAvailStore.fetchShpEnrollments();
  }
});

definePageMeta({ layout: 'guest' });
useHead({
  title: computed(() => {
    if (!item.value) return 'Détails';
    if (item.value.title) return item.value.title;
    if (dataType.value === 'avail' && item.value.origin) {
      return `Trajet ${item.value.origin.city} → ${item.value.destination?.city || 'Toutes destinations'}`;
    }
    return `Détails de l'annonce`;
  }),
  meta: [
    {
      name: 'description',
      content: 'Consultez les détails de cette annonce de fret ou de véhicule disponible sur Bourse de Fret pour trouver votre partenaire idéal.'
    }
  ]
});
</script>
