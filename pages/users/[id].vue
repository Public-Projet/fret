<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12 relative overflow-hidden">
    <!-- Ambient decorative glow blobs for premium visual depth -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    <div
      class="absolute top-[20%] left-[-200px] w-[600px] h-[600px] bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

    <div class="container-custom relative z-10">
      <NuxtLink to="/users"
        class="group inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
        <IconArrowLeft class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Retour à l'annuaire
      </NuxtLink>

      <RootUserDetailLoading v-if="loading" />

      <div v-else-if="user" class="animate-in fade-in slide-in-from-bottom-6 duration-500">
        <RootUserDetailProfileHeader :user="user" :is-me="isMe" :can-rate="canRate"
          @open-rate-modal="showRatingModal = true" />
        <RootUserDetailCarrierAvailabilities v-if="user.role === 'carrier'" :user-id="user.id"
          :items="availabilities" />
        <RootUserDetailShipperOffers v-if="user.role === 'shipper'" :user-id="user.id" :items="fretOffers" />
      </div>

      <RootUserDetailNotFound v-else />
    </div>

    <ModalGlobalRatingForm :show="showRatingModal" :targetId="user?.id || ''" :targetRole="user?.role"
      :initialData="user?.myReview" @close="showRatingModal = false" @success="handleRateSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnUserStore } from '~/stores/cmnUser';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { usePbcAvailabilityStore } from '~/stores/pbcAvailability';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useRoute } from 'vue-router';
import { IconArrowLeft } from '@tabler/icons-vue';

const route = useRoute();
const userStore = useCmnUserStore();
const authStore = useCmnAuthStore();
const pbcAvailStore = usePbcAvailabilityStore();
const fretStore = usePbcAnnouncementStore();

const id = route.params.id as string;
const userRole = route.query.role as string;

const user = ref<any>(null);
const loading = ref(true);
const showRatingModal = ref(false);

const availabilities = computed(() => {
  return pbcAvailStore.availabilities.filter((a: any) => String(a.carrier?.id) === String(id));
});

const fretOffers = computed(() => {
  return fretStore.allAnnouncements.filter((a) => String(a.userId) === String(id));
});

const isMe = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user?.id) return false;
  return String(authStore.user.id) === String(id);
});

const canRate = computed(() => {
  if (!authStore.isAuthenticated || isMe.value) return false;
  if (authStore.isCarrier && user.value?.role === 'shipper') return true;
  if (authStore.isShipper && user.value?.role === 'carrier') return true;
  return false;
});

const handleRateSuccess = (data: { rating: number; reviewsCount: number; myReview: any }) => {
  if (user.value) {
    user.value.rating = data.rating;
    user.value.reviewsCount = data.reviewsCount;
    user.value.myReview = data.myReview;
  }
  showRatingModal.value = false;
};

const fetchData = async () => {
  loading.value = true;
  if (userRole === 'carrier') {
    const res = await userStore.fetchPublicProfile(id, 'carrier');
    if (res.success && res.data?.carrier) {
      user.value = { ...res.data.carrier, role: 'carrier' };
    }
    await pbcAvailStore.fetchPbcAvailabilities(); // To filter by carrier
  } else if (userRole === 'shipper') {
    const res = await userStore.fetchPublicProfile(id, 'shipper');
    if (res.success && res.data?.shipper) {
      user.value = { ...res.data.shipper, role: 'shipper' };
    }
    await fretStore.fetchPbcAnnouncements(); // To filter by shipper
  } else {
    // Try to load as carrier first
    const resCarrier = await userStore.fetchPublicProfile(id, 'carrier');
    if (resCarrier.success && resCarrier.data?.carrier) {
      user.value = { ...resCarrier.data.carrier, role: 'carrier' };
      await pbcAvailStore.fetchPbcAvailabilities();
    } else {
      // Fallback to shipper
      const resShipper = await userStore.fetchPublicProfile(id, 'shipper');
      if (resShipper.success && resShipper.data?.shipper) {
        user.value = { ...resShipper.data.shipper, role: 'shipper' };
        await fretStore.fetchPbcAnnouncements();
      }
    }
  }
  loading.value = false;
};

onMounted(() => {
  fetchData();
});

definePageMeta({ layout: 'guest' });
useHead({
  title: computed(() => (user.value ? `${user.value.firstname} ${user.value.lastname}` : 'Profil Utilisateur')),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        user.value
          ? `Consultez le profil de ${user.value.firstname} ${user.value.lastname}. Voir les évaluations et les offres disponibles.`
          : 'Consultez les profils des utilisateurs.'
      )
    },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
