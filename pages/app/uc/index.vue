<template>
  <div class="container-custom py-6 lg:py-10">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
      <div>
        <h1 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
          Bienvenue, <span class="text-primary-600 dark:text-primary-400">{{ currentUser?.firstName }}</span>
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Tableau de bord Transporteur
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
        <NuxtLink to="/annonces?tab=fret"
          class="btn-outline flex items-center justify-center py-3 px-6 rounded-2xl font-bold text-sm">
          <IconSearch class="w-5 h-5 mr-2" />
          Trouver du fret
        </NuxtLink>
        <button @click="publishAvailability"
          class="btn-primary flex items-center justify-center py-3 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
          <IconPlus class="w-5 h-5 mr-2" />
          Publier ma disponibilité
        </button>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="mb-8 flex justify-end">
      <NuxtLink to="/app/uc/avail"
        class="group text-sm font-black text-primary-600 dark:text-primary-400 flex items-center gap-2 hover:translate-x-1 transition-transform">
        <IconTruck class="w-5 h-5" />
        GÉRER MES DISPONIBILITÉS →
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
      <div
        class="group bg-gradient-to-br from-blue-500 to-indigo-700 p-6 rounded-[2rem] shadow-xl shadow-blue-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconTruck class="w-24 h-24" />
        </div>
        <IconTruck class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Disponibilités</p>
          <p class="text-3xl lg:text-4xl font-black text-white">{{ activeAvailabilitiesCount }}</p>
        </div>
      </div>

      <div
        class="group bg-gradient-to-br from-amber-500 to-orange-700 p-6 rounded-[2rem] shadow-xl shadow-amber-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconSend class="w-24 h-24" />
        </div>
        <IconSend class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-amber-50/90 uppercase tracking-wider mb-1">Offres en cours</p>
          <p class="text-3xl lg:text-4xl font-black text-white">{{ activeOffersCount }}</p>
        </div>
      </div>

      <div
        class="group bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconCircleCheck class="w-24 h-24" />
        </div>
        <IconCircleCheck class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-emerald-50/90 uppercase tracking-wider mb-1">Missions</p>
          <p class="text-3xl lg:text-4xl font-black text-white">{{ acceptedOffersCount }}</p>
        </div>
      </div>

      <div
        class="group bg-gradient-to-br from-purple-500 to-indigo-800 p-6 rounded-[2rem] shadow-xl shadow-purple-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconCurrencyEuro class="w-24 h-24" />
        </div>
        <IconCurrencyEuro class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-purple-50/90 uppercase tracking-wider mb-1">CA Potentiel</p>
          <p class="text-2xl lg:text-3xl font-black text-white leading-tight">{{ potentialRevenue.toLocaleString() }}
            <span class="text-sm">FCFA</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Activité récente -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-gray-900 dark:text-white">Activité récente</h2>
          <NuxtLink to="/app/uc/avail"
            class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">Explorer →</NuxtLink>
        </div>

        <div v-if="recentActivity.length === 0"
          class="bg-white dark:bg-gray-800 rounded-[2rem] p-12 text-center border border-gray-100 dark:border-gray-700/50 shadow-xl">
          <div
            class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconSend class="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium mb-6">Aucune activité récente.</p>
          <NuxtLink to="/annonces?tab=fret"
            class="btn-primary px-8 py-3 rounded-2xl font-black inline-block active:scale-95 transition-all">
            VOIR LES ANNONCES
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div v-for="item in recentActivity" :key="item.type + '-' + item.id"
            class="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                <IconTruck v-if="item.type === 'avail'" class="w-6 h-6 text-blue-500" />
                <IconSend v-else class="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{
                  item.title }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="getOfferStatusClass(item.status)"
                    class="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    {{ getOfferStatusLabel(item.status) }}
                  </span>
                  <span class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {{ formatDate(item.createdAt) }}
                  </span>
                  <span v-if="item.price" class="text-xs font-black text-gray-700 dark:text-white ml-2">
                    {{ item.price.toLocaleString() }} FCFA
                  </span>
                </div>
              </div>
            </div>
            <NuxtLink :to="item.link"
              class="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-black text-primary-600 border border-primary-100 dark:border-primary-900/30 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
              VOIR
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Annonces recommandées -->
      <div class="space-y-6">
        <h2 class="text-xl font-black text-gray-900 dark:text-white">Pour vous</h2>

        <div class="space-y-4">
          <div v-for="announcement in recommendedAnnouncements" :key="announcement.id"
            class="group bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150">
            </div>

            <div class="relative z-10">
              <h3 class="font-black text-gray-900 dark:text-white line-clamp-1 mb-4 text-lg">
                {{ announcement.title }}
              </h3>

              <div class="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <div class="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                  <IconMapPin class="w-4 h-4 text-primary-500" />
                </div>
                <div class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {{ announcement.origin.city }} → {{ announcement.destination.city }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xl font-black text-primary-600">{{ announcement.budget.toLocaleString() }} <span
                    class="text-xs">FCFA</span></span>
                <NuxtLink :to="`/annonces/${announcement.id}?type=offer`"
                  class="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 hover:bg-primary-500 active:scale-90 transition-all">
                  →
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- View More Card -->
          <NuxtLink to="/annonces?tab=fret"
            class="block p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-center hover:border-primary-500 transition-all group">
            <p class="text-gray-500 font-bold group-hover:text-primary-600">Voir toutes les annonces de fret</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useCarAvailabilityStore } from '~/stores/carAvailability';
import { useCarVehiclesStore } from '~/stores/carVehicles';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import { IconCircleCheck, IconCurrencyEuro, IconMapPin, IconPlus, IconSearch, IconSend, IconTruck } from '@tabler/icons-vue';

const authStore = useCmnAuthStore();
const carVehicleStore = useCarVehiclesStore();
const messagingStore = useCmnMessagingStore();
const announcementStore = usePbcAnnouncementStore();
const availabilityStore = useCarAvailabilityStore();
const profileStore = useCmnProfileStore();

const publishAvailability = () => {
  useRouter().push('/app/uc/avail/create');
};

const currentUser = computed(() => authStore.currentUser);

const myOffers = computed(() => {
  if (!currentUser.value) return [];
  return messagingStore.offersByCarrier(currentUser.value.id);
});

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

// Missions are completed/accepted offers or booked availabilities
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

const getOfferStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Acceptée',
    rejected: 'Refusée',
    counter: 'Contre-offre',
    negotiating: 'Négociation',
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré'
  };
  return labels[status] || status;
};

const getOfferStatusClass = (status: string) => {
  const baseClass = 'badge';
  switch (status) {
    case 'pending': return `${baseClass} badge-info`;
    case 'accepted': return `${baseClass} badge-success`;
    case 'rejected': return `${baseClass} badge-danger`;
    case 'counter':
    case 'negotiating': return `${baseClass} badge-warning`;
    case 'active': return `${baseClass} badge-success`;
    case 'full': return `${baseClass} badge-neutral bg-amber-50 text-amber-600`;
    case 'expired': return `${baseClass} badge-neutral bg-gray-100 text-gray-500`;
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
  announcementStore.fetchPublicAnnouncements();
  availabilityStore.fetchCarAvailabilities();
  carVehicleStore.fetchCarVehicles();
  messagingStore.fetchCarrierOffers();
});
useHead({
  title: 'Tableau de bord Transporteur',
  meta: [
    { name: 'description', content: 'Accédez à votre tableau de bord transporteur sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
