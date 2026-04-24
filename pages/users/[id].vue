<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom">
      <NuxtLink to="/users"
        class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
        <IconArrowLeft class="w-5 h-5 mr-2" />
        Retour à l'annuaire
      </NuxtLink>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement du profil...</p>
      </div>

      <div v-else-if="user">
        <!-- Profile Header -->
        <UsersProfileHeader :user="user" :is-me="isMe" :can-rate="canRate" @open-rate-modal="showRatingModal = true" />

        <!-- Role Specific Section: Carrier Availabilities -->
        <UsersCarrierAvailabilities v-if="user.role === 'carrier'" :user-id="user.id" :items="availabilities" />

        <!-- Role Specific Section: Shipper Offers -->
        <UsersShipperOffers v-if="user.role === 'shipper'" :user-id="user.id" :items="fretOffers" />
      </div>

      <div v-else class="text-center py-20">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-lg text-gray-500">Utilisateur non trouvé.</p>
        <NuxtLink to="/users" class="btn btn-primary mt-4">Retour à l'annuaire</NuxtLink>
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
          <ProfileRatingForm :targetId="user?.id" :targetRole="user?.role" :initialData="user?.myReview"
            @success="handleRateSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useAvailabilityStore } from '~/stores/availability';
import { usePbcAvailabilityStore } from '~/stores/pbcAvailability';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useRoute } from 'vue-router';
import { IconArrowLeft, IconLoader2, IconAlertCircle, IconX } from '@tabler/icons-vue';

const route = useRoute();
const userStore = useUserStore();
const authStore = useCmnAuthStore();
const availStore = useAvailabilityStore();
const pbcAvailStore = usePbcAvailabilityStore();
const fretStore = usePbcAnnouncementStore();

const id = route.params.id as string;
const userRole = route.query.role as string;

const user = ref<any>(null);
const loading = ref(true);
const showRatingModal = ref(false);

const availabilities = computed(() => {
  return availStore.availabilities.filter(a => String(a.carrier?.id) === String(id));
});

const fretOffers = computed(() => {
  return fretStore.allAnnouncements.filter(a => String(a.userId) === String(id));
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

const handleRateSuccess = (data: { rating: number, reviewsCount: number, myReview: any }) => {
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
  } else {
    const res = await userStore.fetchPublicProfile(id, 'shipper');
    if (res.success && res.data?.shipper) {
      user.value = { ...res.data.shipper, role: 'shipper' };
    }
    await fretStore.fetchPbcAnnouncements(); // To filter by shipper
  }
  loading.value = false;
};

onMounted(() => {
  fetchData();
});

definePageMeta({ layout: 'guest' });
useHead({
  title: computed(() => user.value ? `${user.value.firstname} ${user.value.lastname}` : 'Profil Utilisateur'),
  meta: [
    { name: 'description', content: computed(() => user.value ? `Consultez le profil de ${user.value.firstname} ${user.value.lastname}. Voir les évaluations et les offres disponibles.` : 'Consultez les profils des utilisateurs.') },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
