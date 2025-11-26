<template>
  <div class="container-custom py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord Transporteur</h1>
        <p class="text-gray-600 dark:text-gray-400">Trouvez des chargements et gérez vos offres</p>
      </div>
      <div class="flex space-x-4 mt-4 md:mt-0">
        <NuxtLink to="/announcements" class="btn btn-outline flex items-center justify-center">
          <MagnifyingGlassIcon class="w-5 h-5 mr-2" />
          Trouver du fret
        </NuxtLink>
        <button @click="publishAvailability" class="btn btn-primary flex items-center justify-center">
          <PlusIcon class="w-5 h-5 mr-2" />
          Publier ma disponibilité
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <PaperAirplaneIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Offres en cours</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeOffersCount }}</p>
        </div>
      </div>
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircleIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Missions acceptées</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ acceptedOffersCount }}</p>
        </div>
      </div>
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <CurrencyEuroIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">CA potentiel</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ potentialRevenue }}€</p>
        </div>
      </div>
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
          <StarIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Ma note</p>
          <div class="flex items-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white mr-2">{{ currentUser?.rating || 0 }}</p>
            <span class="text-sm text-gray-500">({{ currentUser?.reviewCount || 0 }} avis)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Mes offres récentes -->
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Mes offres récentes</h2>

        <div v-if="myOffers.length === 0" class="card p-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">Vous n'avez fait aucune offre pour le moment.</p>
          <NuxtLink to="/announcements" class="text-primary-600 hover:underline mt-2 inline-block">
            Voir les annonces disponibles
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div v-for="offer in myOffers" :key="offer.id" class="card p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <span :class="getOfferStatusClass(offer.status)">
                    {{ getOfferStatusLabel(offer.status) }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(offer.createdAt) }}
                  </span>
                </div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  Offre de {{ offer.price }}€
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ offer.message }}
                </p>
              </div>
              <NuxtLink :to="`/announcements/${offer.announcementId}`" class="btn btn-ghost btn-sm">
                Voir l'annonce
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Annonces recommandées -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recommandé pour vous</h2>
          <NuxtLink to="/announcements" class="text-sm text-primary-600 hover:text-primary-500">
            Voir tout
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <div v-for="announcement in recommendedAnnouncements" :key="announcement.id" class="card p-4">
            <div class="mb-2">
              <h3 class="font-medium text-gray-900 dark:text-white line-clamp-1">
                {{ announcement.title }}
              </h3>
              <div class="flex items-center text-xs text-gray-500 mt-1">
                <MapPinIcon class="w-3 h-3 mr-1" />
                <span>{{ announcement.origin.city }} → {{ announcement.destination.city }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between mt-3">
              <span class="font-bold text-primary-600">{{ announcement.budget }}€</span>
              <NuxtLink :to="`/announcements/${announcement.id}`"
                class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Détails →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  CurrencyEuroIcon,
  StarIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '~/stores/auth';
import { useMessagingStore } from '~/stores/messaging';
import { useAnnouncementStore } from '~/stores/announcement';

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
});

const authStore = useAuthStore();
const messagingStore = useMessagingStore();
const announcementStore = useAnnouncementStore();

const publishAvailability = () => {
  alert('Fonctionnalité de publication de disponibilité à venir !');
};

const currentUser = computed(() => authStore.currentUser);

const myOffers = computed(() => {
  if (!currentUser.value) return [];
  return messagingStore.offersByCarrier(currentUser.value.id);
});

const recommendedAnnouncements = computed(() => {
  return announcementStore.allAnnouncements
    .filter(a => a.status === 'pending')
    .slice(0, 3);
});

// Stats
const activeOffersCount = computed(() =>
  myOffers.value.filter(o => ['pending', 'counter'].includes(o.status)).length
);

const acceptedOffersCount = computed(() =>
  myOffers.value.filter(o => o.status === 'accepted').length
);

const potentialRevenue = computed(() =>
  myOffers.value
    .filter(o => ['pending', 'counter', 'accepted'].includes(o.status))
    .reduce((sum, o) => sum + o.price, 0)
);

const getOfferStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Acceptée',
    rejected: 'Refusée',
    counter: 'Contre-offre'
  };
  return labels[status] || status;
};

const getOfferStatusClass = (status: string) => {
  const baseClass = 'badge';
  switch (status) {
    case 'pending': return `${baseClass} badge-info`;
    case 'accepted': return `${baseClass} badge-success`;
    case 'rejected': return `${baseClass} badge-danger`;
    case 'counter': return `${baseClass} badge-warning`;
    default: return `${baseClass} badge-neutral`;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

onMounted(() => {
  announcementStore.fetchAnnouncements();
});
</script>
