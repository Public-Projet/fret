<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Opportunités & Inscriptions</h1>
          <p class="text-gray-500 font-medium mt-1">Gérez vos expéditions au travers des offres du marché</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-8">
        <button @click="activeTab = 'market'" :class="[
          'px-6 py-3 rounded-2xl font-bold transition-all',
          activeTab === 'market'
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
        ]">
          <IconSearch class="w-5 h-5 inline-block mr-2" v-if="activeTab === 'market'" />
          Opportunités du marché
        </button>
        <button @click="activeTab = 'enrollments'" :class="[
          'px-6 py-3 rounded-2xl font-bold transition-all',
          activeTab === 'enrollments'
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
        ]">
          <IconHistory class="w-5 h-5 inline-block mr-2" v-if="activeTab === 'enrollments'" />
          Mes Souscriptions
        </button>
      </div>

      <!-- Market Tab -->
      <div v-if="activeTab === 'market'">
        <!-- Filters -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 mb-10 border border-white dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Origine</label>
              <div class="relative">
                <input v-model="filters.origin" type="text" placeholder="Ville de départ..."
                  class="w-full pl-11 pr-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-sm" />
                <IconMapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
              <div class="relative">
                <input v-model="filters.destination" type="text" placeholder="Ville d'arrivée..."
                  class="w-full pl-11 pr-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-sm" />
                <IconMapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Type de Véhicule</label>
              <div class="relative">
                <select v-model="filters.type"
                  class="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-sm appearance-none">
                  <option value="">Tous les véhicules</option>
                  <option value="truck">🚛 Poids lourd (TBR)</option>
                  <option value="van">🚐 Fourgon</option>
                  <option value="pickup">🛻 Pick-up</option>
                </select>
                <IconTruck class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <IconChevronDown
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Feed List -->
        <div v-if="loadingPublic" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div v-for="i in 4" :key="i" class="bg-white/50 dark:bg-gray-800/50 h-64 rounded-3xl animate-pulse"></div>
        </div>

        <div v-else-if="filteredAvailabilities.length === 0" class="text-center py-24">
          <div
            class="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
            <IconTruckOff class="w-12 h-12" />
          </div>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Aucun trajet disponible</h3>
          <p class="text-gray-500 font-medium">Réessayez avec d'autres critères ou revenez plus tard.</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div v-for="item in filteredAvailabilities" :key="item.id"
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 hover:shadow-2xl transition-all overflow-hidden relative group">
            <div v-if="isNew(item.createdAt)" class="absolute top-6 right-6 z-10">
              <span
                class="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">Nouveau</span>
            </div>

            <div class="p-8">
              <div class="flex justify-between items-start mb-8">
                <div class="flex items-center space-x-5">
                  <div
                    class="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                    <IconTruck class="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 class="font-black text-xl text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                      {{ item.origin.city }}</h3>
                    <div
                      class="flex items-center text-primary-500 my-1 py-1 px-2 bg-primary-50 dark:bg-primary-900/30 w-max rounded-lg">
                      <IconArrowDown class="w-4 h-4" />
                    </div>
                    <h3 class="font-black text-xl text-primary-600 leading-tight uppercase tracking-tight">{{
                      item.destination?.city || 'Libre' }}</h3>
                  </div>
                </div>
                <div class="text-right pt-2">
                  <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Prix suggéré</p>
                  <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                    {{ item.price?.toLocaleString() || 'S.D' }}
                    <span class="text-sm font-bold ml-1">FCFA</span>
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-3 mb-8">
                <span
                  class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center border border-gray-100 dark:border-gray-700">
                  <IconCalendar class="w-3.5 h-3.5 mr-2 text-primary-500" /> {{ formatDateShort(item.startDate) }}
                </span>
                <span
                  class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center border border-gray-100 dark:border-gray-700">
                  <IconPackage class="w-3.5 h-3.5 mr-2 text-amber-500" /> {{ item.vehicle?.capacity?.toLocaleString() }}
                  kg
                </span>
                <span
                  class="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-[11px] font-black text-emerald-600 uppercase tracking-wider flex items-center border border-emerald-100 dark:border-emerald-900/30">
                  <IconUsers class="w-3.5 h-3.5 mr-2" /> {{ item.currentRequests }} inscrits
                </span>
                <span
                  class="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[11px] font-black text-blue-600 uppercase tracking-wider flex items-center border border-blue-100 dark:border-blue-900/30">
                  <IconEye class="w-3.5 h-3.5 mr-1" /> {{ item.views || 0 }}
                  <span class="mx-1 text-blue-200 dark:text-blue-800">|</span>
                  <IconUser class="w-3.5 h-3.5 mr-1" /> {{ item.uniqueViews || 0 }}
                </span>
              </div>

              <div class="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-6">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-full bg-primary-600 text-white font-black flex items-center justify-center mr-3 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                    {{ item.carrier?.firstname?.[0] || 'C' }}
                  </div>
                  <div>
                    <span class="text-sm font-black text-gray-900 dark:text-white">{{ item.carrier?.firstname ||
                      'Transporteur' }}</span>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Transporteur</p>
                  </div>
                </div>

                <template v-if="availabilityStore.isEnrolled(item.id)">
                  <div
                    class="flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <IconCheck class="w-5 h-5 mr-2" />
                    <span class="text-sm font-black uppercase tracking-wider">Inscrit</span>
                  </div>
                </template>
                <NuxtLink v-else :to="`/app/us/avail/${item.id}`"
                  class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 text-sm uppercase tracking-wider">
                  S'inscrire
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrollments Tab -->
      <div v-if="activeTab === 'enrollments'">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:translate-y-1">
            <div class="flex items-center space-x-5">
              <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 shadow-inner">
                <IconLoader2 class="w-7 h-7" />
              </div>
              <div>
                <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">En attente</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ pendingCount }}</p>
              </div>
            </div>
          </div>
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:translate-y-1">
            <div class="flex items-center space-x-5">
              <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 shadow-inner">
                <IconCheck class="w-7 h-7" />
              </div>
              <div>
                <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Confirmées</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ confirmedCount }}</p>
              </div>
            </div>
          </div>
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:translate-y-1">
            <div class="flex items-center space-x-5">
              <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 shadow-inner">
                <IconHistory class="w-7 h-7" />
              </div>
              <div>
                <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                <p class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ enrollments.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Enrollment List -->
        <div v-if="loadingEnrollments" class="flex flex-col items-center justify-center py-24">
          <div class="relative w-16 h-16 mb-6">
            <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin">
            </div>
          </div>
          <p class="text-gray-500 font-bold">Chargement de vos inscriptions...</p>
        </div>

        <div v-else-if="enrollments.length === 0"
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
          <div
            class="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
            <IconTicketOff class="w-12 h-12" />
          </div>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Aucune inscription active
          </h3>
          <p class="text-gray-500 mb-10 max-w-sm mx-auto font-medium">Vous n'avez pas encore souscrit à des trajets de
            transporteurs. Explorez le marché pour trouver votre bonheur.</p>
          <button @click="activeTab = 'market'"
            class="inline-flex px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95">
            Explorer le marché
          </button>
        </div>

        <div v-else class="space-y-6">
          <div v-for="enrollment in enrollments" :key="enrollment.id"
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white dark:border-gray-700 p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-primary-200 dark:hover:border-primary-800 transition-all shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl">

            <div class="flex-1 min-w-0 w-full">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Trajet #{{ safeSlice(enrollment.availability?.id) }}
                </span>
                <span
                  :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider', getStatusClass(enrollment)]">
                  {{ getStatusLabel(enrollment) }}
                </span>
              </div>

              <div class="flex items-center gap-4 group-hover:translate-x-1 transition-transform">
                <div class="flex-1">
                  <p
                    class="text-lg lg:text-2xl font-black text-gray-900 dark:text-white flex items-center flex-wrap gap-x-3">
                    <span class="truncate">{{ enrollment.availability?.origin?.city }}</span>
                    <IconArrowRight class="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span class="truncate text-primary-600">{{ enrollment.availability?.destination?.city || 'Libre'
                      }}</span>
                  </p>
                  <div class="flex items-center mt-2 text-gray-500 font-bold text-sm">
                    <IconCalendar class="w-4 h-4 mr-2 text-primary-400" />
                    {{ formatDate(enrollment.availability?.startDate) }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col items-center md:items-end md:px-10 md:border-x border-gray-100 dark:border-gray-700 w-full md:w-auto py-4 md:py-0">
              <p class="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                {{ enrollment.availability?.price?.toLocaleString() || '-' }}
                <span class="text-sm font-bold ml-1 text-gray-400">FCFA</span>
              </p>
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Budget proposé</p>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto shrink-0">
              <NuxtLink :to="`/app/us/avail/${enrollment.availability?.id}`"
                class="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
                Détails
              </NuxtLink>
              <NuxtLink :to="`/app/messages`"
                class="flex-1 md:flex-none px-6 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center group active:scale-95">
                <IconMessage class="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Chat
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAvailabilityStore } from '~/stores/availability';
import { IconSearch, IconLoader2, IconCheck, IconHistory, IconTicketOff, IconArrowRight, IconMessage, IconTruck, IconCalendar, IconPackage, IconUsers, IconTruckOff, IconMapPin, IconChevronDown, IconArrowDown } from '@tabler/icons-vue';

// Tabs
const activeTab = ref('market');

// Store
const availabilityStore = useAvailabilityStore();
const loadingPublic = ref(false);
const loadingEnrollments = ref(false);

const availabilities = computed(() => availabilityStore.availabilities);
const enrollments = computed(() => availabilityStore.enrollments);

// Data loading logic based on active tab
const fetchCurrentTabInfo = async () => {
  if (activeTab.value === 'market') {
    loadingPublic.value = true;
    await availabilityStore.fetchPublicAvailabilities();
    loadingPublic.value = false;
  } else if (activeTab.value === 'enrollments') {
    loadingEnrollments.value = true;
    await availabilityStore.fetchShipperEnrollments();
    loadingEnrollments.value = false;
  }
};

watch(activeTab, fetchCurrentTabInfo);

onMounted(() => {
  fetchCurrentTabInfo();
});

// Market Logic
const filters = ref({ origin: '', destination: '', type: '' });
const filteredAvailabilities = computed(() => {
  return availabilities.value.filter(item => {
    const matchOrigin = !filters.value.origin || item.origin.city.toLowerCase().includes(filters.value.origin.toLowerCase());
    const matchDest = !filters.value.destination || (item.destination?.city || '').toLowerCase().includes(filters.value.destination.toLowerCase());
    const matchType = !filters.value.type || item.vehicle?.type === filters.value.type;
    return matchOrigin && matchDest && matchType;
  });
});

const isNew = (date: string) => {
  if (!date) return false;
  const created = new Date(date).getTime();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return created > weekAgo;
};

const formatDateShort = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

// Enrollment Logic
const pendingCount = computed(() => enrollments.value.filter(e => e.status === 'pending' || e.status === 'countered').length);
const confirmedCount = computed(() => enrollments.value.filter(e => e.status === 'confirmed' || e.status === 'accepted').length);

const getStatusLabel = (enrollment: any) => {
  if (enrollment.status === 'pending' || enrollment.status === 'countered') {
    return enrollment.lastProposedBy === 'carrier' ? 'Contre-offre reçue (Action requise)' : 'En attente transporteur';
  }
  const labels: Record<string, string> = {
    accepted: 'Contrat Validé',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    rejected: 'Refusé'
  };
  return labels[enrollment.status] || enrollment.status;
};

const getStatusClass = (enrollment: any) => {
  if (enrollment.status === 'pending' || enrollment.status === 'countered') {
    return enrollment.lastProposedBy === 'carrier' ? 'badge-primary' : 'badge-warning';
  }
  if (['confirmed', 'accepted'].includes(enrollment.status)) return 'badge-success';
  if (['cancelled', 'rejected'].includes(enrollment.status)) return 'badge-error';
  return 'badge-neutral';
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const safeSlice = (id: any) => {
  if (!id) return '...';
  return id.toString().slice(0, 6);
};

definePageMeta({ layout: 'default' });
useHead({
  title: 'Opportunités & Inscriptions',
  meta: [
    { name: 'description', content: 'Retrouvez toutes vos inscriptions aux différentes disponibilités et le marché.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
