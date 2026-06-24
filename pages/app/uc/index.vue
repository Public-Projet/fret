<template>
  <div class="container-custom py-6 lg:py-10">
    <!-- Header Section -->
    <RootAppCarHomeHero :current-user="currentUser" @publish-availability="publishAvailability" />

    <!-- Quick Navigation -->
    <div class="mb-8 flex justify-end">
      <NuxtLink to="/app/uc/avail"
        class="group text-sm font-black text-primary-600 dark:text-primary-400 flex items-center gap-2 hover:translate-x-1 transition-transform">
        <IconTruck class="w-5 h-5" />
        GÉRER MES DISPONIBILITÉS →
      </NuxtLink>
    </div>

    <!-- Loading state with UiAppSkeleton -->
    <div v-if="loading" class="space-y-10">
      <!-- Hero Skeleton -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div class="space-y-3 w-full lg:w-1/3">
          <UiAppSkeleton :loading="true" type="heading" width="80%" height="32px" />
          <UiAppSkeleton :loading="true" type="text" width="50%" height="16px" />
        </div>
        <div class="flex gap-3 w-full lg:w-auto">
          <UiAppSkeleton :loading="true" type="rectangle" width="140px" height="44px" radius="16px" />
          <UiAppSkeleton :loading="true" type="rectangle" width="180px" height="44px" radius="16px" />
        </div>
      </div>

      <!-- Stats Skeleton -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <UiAppSkeleton v-for="i in 4" :key="i" :loading="true" type="card" height="130px" class="rounded-[2rem]" />
      </div>

      <!-- Charts Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UiAppSkeleton :loading="true" type="card" height="320px" class="lg:col-span-2 rounded-[2rem]" />
        <UiAppSkeleton :loading="true" type="card" height="320px" class="rounded-[2rem]" />
      </div>

      <!-- Activity Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <UiAppSkeleton :loading="true" type="heading" width="30%" height="24px" />
          <UiAppSkeleton v-for="i in 3" :key="i" :loading="true" type="table-row" height="70px" class="rounded-2xl" />
        </div>
        <div class="space-y-4">
          <UiAppSkeleton :loading="true" type="heading" width="40%" height="24px" />
          <UiAppSkeleton v-for="i in 2" :key="i" :loading="true" type="card" height="130px" class="rounded-[2rem]" />
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <RootAppCarHomeStats :active-availabilities-count="activeAvailabilitiesCount"
        :active-offers-count="activeOffersCount" :accepted-offers-count="acceptedOffersCount"
        :potential-revenue="potentialRevenue" />

      <!-- Interactive Charts with Real Data -->
      <RootAppCarHomeCharts :offers="myOffers" :availabilities="myAvailabilities" />

      <!-- Recent Activity & Recommendations -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <RootAppCarHomeRecentActivity :recent-activity="recentActivity" />
        </div>
        <div>
          <RootAppCarHomeRecommended :recommended-announcements="recommendedAnnouncements" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useCarAnnouncementStore } from '~/stores/carAnnouncement';
import { useCarAvailabilityStore } from '~/stores/carAvailability';
import { useCarVehiclesStore } from '~/stores/carVehicles';
import { IconTruck } from '@tabler/icons-vue';

const authStore = useCmnAuthStore();
const carVehicleStore = useCarVehiclesStore();
const messagingStore = useCmnMessagingStore();
const announcementStore = usePbcAnnouncementStore();
const carStore = useCarAnnouncementStore();
const availabilityStore = useCarAvailabilityStore();

const publishAvailability = () => {
  useRouter().push('/app/uc/avail/create');
};

const loading = computed(() =>
  announcementStore.loading ||
  availabilityStore.loading ||
  carVehicleStore.vehiclesLoading ||
  carStore.loading
);

const currentUser = computed(() => authStore.currentUser);
const myOffers = computed(() => carStore.offers);
const myAvailabilities = computed(() => availabilityStore.availabilities);

const recommendedAnnouncements = computed(() => {
  return announcementStore.allAnnouncements
    .filter(a => a.status === 'pending')
    .slice(0, 3);
});

// Stats
const activeAvailabilitiesCount = computed(() =>
  myAvailabilities.value.filter((a: any) => ['active'].includes(a.status)).length
);

const activeOffersCount = computed(() =>
  myOffers.value.filter((o: any) => ['pending', 'counter', 'negotiating'].includes(o.status)).length
);

// Missions
const acceptedOffersCount = computed(() => {
  const fromOffers = myOffers.value.filter((o: any) => ['accepted', 'completed'].includes(o.status)).length;
  const fromAvailabilities = myAvailabilities.value.reduce((acc, a: any) => acc + (a.bookings?.filter((b: any) => ['accepted', 'completed'].includes(b.status)).length || 0), 0);
  return fromOffers + fromAvailabilities;
});

const potentialRevenue = computed(() => {
  const offersSum = myOffers.value
    .filter((o: any) => ['pending', 'counter', 'negotiating', 'accepted', 'completed'].includes(o.status))
    .reduce((sum: number, o: any) => sum + (o.proposedPrice || o.price || 0), 0);

  const availabilitiesSum = myAvailabilities.value
    .filter((a: any) => ['active', 'full'].includes(a.status))
    .reduce((sum: number, a: any) => sum + (a.price || 0), 0);

  return offersSum + availabilitiesSum;
});

const recentActivity = computed(() => {
  const offersList = myOffers.value.map((o: any) => ({
    id: o.id,
    title: `Offre sur annonce`,
    createdAt: o.createdAt,
    type: 'offer',
    status: o.status,
    price: o.proposedPrice || o.price,
    link: `/annonces/${o.announcementId}?type=offer`
  }));
  const availabilitiesList = myAvailabilities.value.map((a: any) => ({
    id: a.id,
    title: `${a.origin?.city || 'Origine'} → ${a.destination?.city || 'Libre'}`,
    createdAt: a.createdAt,
    type: 'avail',
    status: a.status,
    price: a.price,
    link: `/app/uc/avail/${a.id}`
  }));

  return [...offersList, ...availabilitiesList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

onMounted(() => {
  announcementStore.fetchPbcAnnouncements();
  availabilityStore.fetchCarAvailabilities();
  carVehicleStore.fetchCarVehicles();
  carStore.fetchCarOffers();
  messagingStore.fetchUserConversations();
});

useHead({
  title: 'Tableau de bord Transporteur',
  meta: [
    { name: 'description', content: 'Accédez à votre tableau de bord transporteur sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
