<template>
  <div class="container-custom py-6 lg:py-10">
    <!-- Header Section -->
    <RootAppShpHomeHero :current-user="currentUser" />

    <!-- Loading state with UiAppSkeleton -->
    <div v-if="loading" class="space-y-10">
      <!-- Hero Skeleton -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div class="space-y-3 w-full lg:w-1/3">
          <UiAppSkeleton :loading="true" type="heading" width="80%" height="32px" />
          <UiAppSkeleton :loading="true" type="text" width="50%" height="16px" />
        </div>
        <div class="flex gap-3 w-full lg:w-auto">
          <UiAppSkeleton :loading="true" type="rectangle" width="120px" height="44px" radius="16px" />
          <UiAppSkeleton :loading="true" type="rectangle" width="120px" height="44px" radius="16px" />
          <UiAppSkeleton :loading="true" type="rectangle" width="150px" height="44px" radius="16px" />
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
          <UiAppSkeleton :loading="true" type="card" height="180px" class="rounded-[2rem]" />
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <RootAppShpHomeStats :active-announcements-count="activeAnnouncementsCount" :negotiating-count="negotiatingCount"
        :completed-count="completedCount" :total-budget="totalBudget" />

      <!-- Interactive Charts with Real Data -->
      <RootAppShpHomeCharts :announcements="myAnnouncements" :enrollments="enrollments" />

      <!-- Recent Activity & Quick Action -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <RootAppShpHomeRecentActivity :recent-activity="recentActivity" />
        </div>
        <div>
          <RootAppShpHomeQuickAction />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { useShpAvailabilityStore } from '~/stores/shpAvailability';

const authStore = useCmnAuthStore();
const announcementStore = useShpAnnouncementStore();
const shpAvailStore = useShpAvailabilityStore();

const loading = computed(() => announcementStore.loading || shpAvailStore.loading);
const currentUser = computed(() => authStore.currentUser);

const myAnnouncements = computed(() => {
  if (!currentUser.value) return [];
  return announcementStore.userAnnouncements(currentUser.value.id);
});

const enrollments = computed(() => shpAvailStore.enrollments);

// Stats
const activeAnnouncementsCount = computed(() => {
  const activeOffers = myAnnouncements.value.filter(a => ['pending', 'negotiating'].includes(a.status)).length;
  const activeEnrollments = enrollments.value.filter((e: any) => ['pending', 'negotiating', 'countered'].includes(e.status)).length;
  return activeOffers + activeEnrollments;
});

const negotiatingCount = computed(() => {
  const negOffers = myAnnouncements.value.filter(a => a.status === 'negotiating').length;
  const negEnrollments = enrollments.value.filter((e: any) => ['negotiating', 'countered'].includes(e.status)).length;
  return negOffers + negEnrollments;
});

const completedCount = computed(() => {
  const compOffers = myAnnouncements.value.filter(a => a.status === 'completed').length;
  const compEnrollments = enrollments.value.filter((e: any) => ['completed', 'accepted'].includes(e.status)).length;
  return compOffers + compEnrollments;
});

const totalBudget = computed(() => {
  const sumOffers = myAnnouncements.value.reduce((sum: number, a: any) => {
    let finalPrice = a.budget || 0;
    if (a.offers && a.offers.length > 0) {
      const acceptedOffer = a.offers.find((o: any) => ['accepted', 'confirmed'].includes(o.status));
      if (acceptedOffer) {
        finalPrice = (acceptedOffer as any).proposedPrice || acceptedOffer.price || finalPrice;
      }
    }
    return sum + finalPrice;
  }, 0);

  const sumEnrollments = enrollments.value.reduce((sum: number, e: any) => {
    let finalPrice = e.availability?.price || 0;
    if (e.proposedPrice || e.price) {
      finalPrice = e.proposedPrice || e.price;
    }
    return sum + finalPrice;
  }, 0);

  return sumOffers + sumEnrollments;
});

const recentActivity = computed(() => {
  const offersList = myAnnouncements.value.map(a => ({
    id: a.id,
    title: a.title,
    createdAt: a.createdAt,
    type: 'offer',
    link: `/annonces/${a.id}?type=offer`
  }));
  const enrollmentsList = enrollments.value.map((e: any) => ({
    id: e.id,
    title: `${e.availability?.origin?.city || 'Origine'} → ${e.availability?.destination?.city || 'Libre'}`,
    createdAt: e.createdAt,
    type: 'avail',
    link: `/app/us/avail/${e.availability?.id}`
  }));

  return [...offersList, ...enrollmentsList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

onMounted(() => {
  announcementStore.fetchShpAnnouncements();
  shpAvailStore.fetchShpEnrollments();
});

useHead({
  title: 'Tableau de bord Expéditeur',
  meta: [
    { name: 'description', content: 'Accédez à votre tableau de bord expéditeur sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
