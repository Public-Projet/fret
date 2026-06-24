<template>
  <div class="container-custom py-6 lg:py-10">
    <!-- Header Section -->
    <RootAppShpHomeHero :current-user="currentUser" />

    <!-- Loading state with extracted module -->
    <RootAppShpHomeLoading v-if="loading" />

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
