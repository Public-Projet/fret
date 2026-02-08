<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des détails...</p>
      </div>

      <!-- Availability View -->
      <div v-else-if="dataType === 'avail' && item" class="space-y-8">
        <NuxtLink to="/annonces"
          class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
          <IconArrowLeft class="w-5 h-5 mr-2" />
          Retour au marché
        </NuxtLink>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <div class="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <h1 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Trajet : {{ item.origin?.city }} → {{ item.destination?.city || 'Toutes destinations' }}
                  </h1>
                  <div class="flex items-center space-x-4">
                    <span class="badge" :class="getStatusBadgeClass(item.status)">{{ getStatusLabel(item.status)
                    }}</span>
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                      Proposé par
                      <NuxtLink :to="`/users/${item.carrier?.id}?role=carrier`"
                        class="ml-1 text-primary-600 hover:underline">
                        {{ (isOwner || item.carrier?.id === authStore.user?.id) ? 'Vous' :
                          ((item.carrier?.firstname || item.carrier?.lastname) ? (item.carrier.firstname + ' ' +
                            item.carrier.lastname) : 'Transporteur') }}
                      </NuxtLink>
                    </span>
                    <div class="flex items-center text-yellow-500">
                      <IconStarFilled v-for="i in 5" :key="i"
                        :class="i <= Math.round(item.carrier?.rating || 0) ? 'text-yellow-500' : 'text-gray-200'"
                        class="w-4 h-4" />
                      <span class="text-xs font-bold text-gray-500 ml-1">({{ item.carrier?.rating || '0.0' }})</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-3xl font-black text-primary-600">
                    {{ item.price ? item.price + ' FCFA' : 'Prix sur devis' }}</p>
                  <p class="text-sm text-gray-400 italic">Tarif indicatif</p>
                </div>
              </div>

              <!-- Route Visual -->
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-8">
                <div
                  class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative text-center md:text-left">
                  <div class="flex-1 w-full md:w-auto">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Départ</p>
                    <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.origin?.city }}, {{
                      item.origin?.country }}</p>
                    <p class="text-sm text-gray-500">{{ formatDateFull(item.startDate) }}</p>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <IconTruck class="w-8 h-8 text-primary-600 mb-2" />
                    <div class="w-24 md:w-32 h-0.5 border-t-2 border-dashed border-primary-200 dark:border-primary-800">
                    </div>
                  </div>
                  <div class="flex-1 w-full md:w-auto md:text-right">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Arrivée</p>
                    <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.destination?.city || 'Ouvert' }}
                    </p>
                    <p class="text-sm text-gray-500">{{ formatDateFull(item.endDate) }}</p>
                  </div>
                </div>
              </div>

              <!-- Vehicle Details -->
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-4">Informations Véhicule</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <p class="text-xs text-gray-400 uppercase mb-1">Type</p>
                    <p class="font-bold capitalize">{{ item.vehicle?.type }}</p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <p class="text-xs text-gray-400 uppercase mb-1">Capacité</p>
                    <p class="font-bold">{{ item.vehicle?.capacity || '-' }} kg</p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <p class="text-xs text-gray-400 uppercase mb-1">Volume</p>
                    <p class="font-bold">{{ item.vehicle?.volume || '-' }} m³</p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <p class="text-xs text-gray-400 uppercase mb-1">Marque</p>
                    <p class="font-bold">{{ item.vehicle?.brand || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar for Availability -->
          <div class="space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 class="font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div v-if="isOwner" class="space-y-3">
                <p class="text-sm text-gray-500 italic">Vous êtes le propriétaire de cette disponibilité.</p>
              </div>
              <div v-else-if="authStore.isShipper" class="space-y-4">
                <button v-if="!alreadyEnrolled" @click="enroll" class="btn btn-primary w-full py-4 rounded-2xl">
                  S'inscrire sur le trajet
                </button>
                <div v-else
                  class="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <p class="text-green-700 dark:text-green-400 font-bold flex items-center">
                    <IconCheck class="w-5 h-5 mr-2" />
                    Déjà inscrit !
                  </p>
                </div>
                <button class="btn btn-outline w-full py-4 rounded-2xl">
                  Contacter le transporteur
                </button>
              </div>
              <div v-else class="text-center p-4">
                <p class="text-sm text-gray-500">Connectez-vous en tant qu'expéditeur pour réserver.</p>
                <NuxtLink to="/auth/login" class="btn btn-primary btn-sm mt-4">Connexion</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Offer View -->
      <div v-else-if="dataType === 'offer' && item" class="space-y-8">
        <NuxtLink to="/annonces"
          class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
          <IconArrowLeft class="w-5 h-5 mr-2" />
          Retour au marché
        </NuxtLink>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div class="flex justify-between items-start mb-4">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ item.title }}</h1>
                <span :class="getStatusBadgeClass(item.status)" class="badge">
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>

              <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div class="flex items-center">
                  <IconCalendar class="w-4 h-4 mr-1" />
                  Publié le {{ formatDate(item.createdAt) }}
                </div>
                <div class="flex items-center">
                  <IconMapPin class="w-4 h-4 mr-1" />
                  {{ item.distance }} km
                </div>
              </div>

              <!-- Trajet -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
                <div class="relative pl-8 border-l-2 border-dashed border-gray-300 dark:border-gray-600 space-y-8">
                  <div class="relative">
                    <div
                      class="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-primary-600">
                    </div>
                    <div>
                      <p
                        class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                        Enlèvement</p>
                      <p class="font-medium text-gray-900 dark:text-white text-lg">{{ item.origin?.city }} ({{
                        item.origin?.postalCode }})</p>
                      <p class="text-gray-600 dark:text-gray-400">{{ item.origin?.address }}</p>
                    </div>
                  </div>
                  <div class="relative">
                    <div
                      class="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-secondary-600">
                    </div>
                    <div>
                      <p
                        class="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider mb-1">
                        Livraison</p>
                      <p class="font-medium text-gray-900 dark:text-white text-lg">{{ item.destination?.city }} ({{
                        item.destination?.postalCode }})</p>
                      <p class="text-gray-600 dark:text-gray-400">{{ item.destination?.address }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Caractéristiques -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <IconCube class="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p class="text-xs text-gray-500 uppercase">Type</p>
                  <p class="font-semibold">{{ item.cargoType }}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <IconScale class="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p class="text-xs text-gray-500 uppercase">Poids</p>
                  <p class="font-semibold">{{ item.weight }} kg</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <IconArrowsMaximize class="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p class="text-xs text-gray-500 uppercase">Volume</p>
                  <p class="font-semibold">{{ item.volume }} m³</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <IconCurrencyEuro class="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p class="text-xs text-gray-500 uppercase">Budget</p>
                  <p class="font-semibold text-primary-600">{{ item.budget }} FCFA</p>
                </div>
              </div>

              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar for Offer -->
          <div class="space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">À propos de l'expéditeur</h3>
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl uppercase">
                  {{ item.user?.firstName?.[0] || 'E' }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.user?.company || item.user?.firstName }}
                  </p>
                  <div class="flex items-center text-sm text-gray-500">
                    <IconStarFilled class="w-4 h-4 text-yellow-400 mr-1" />
                    {{ item.user?.rating || '0.0' }} ({{ item.user?.reviewCount || 0 }} avis)
                  </div>
                </div>
              </div>
              <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center">
                  <IconShieldCheck class="w-4 h-4 text-green-500 mr-2" />
                  Identité vérifiée
                </div>
              </div>
            </div>

            <div v-if="authStore.isCarrier && item.status === 'pending'"
              class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Faire une offre</h3>
              <button class="btn btn-primary w-full py-4 rounded-2xl">
                Proposer mes services
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-lg text-gray-500">Détails non trouvés ou erreur de chargement.</p>
        <NuxtLink to="/annonces" class="btn btn-primary mt-4">Retour au marché</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAvailabilityStore } from '~/stores/availability';
import { useAnnouncementStore } from '~/stores/announcement';
import { useAuthStore } from '~/stores/auth';
import {
  IconArrowLeft, IconLoader2, IconAlertCircle, IconTruck,
  IconShieldCheck, IconCheck, IconStarFilled, IconMapPin, IconCalendar,
  IconCube, IconScale, IconArrowsMaximize, IconCurrencyEuro
} from '@tabler/icons-vue';

const route = useRoute();
const availStore = useAvailabilityStore();
const fretStore = useAnnouncementStore();
const authStore = useAuthStore();

const id = route.params.id as string;
const dataType = ref<'avail' | 'offer' | null>((route.query.type as any) || null);
const item = ref<any>(null);
const loading = ref(true);

const isOwner = computed(() => {
  if (dataType.value === 'avail') {
    return authStore.isCarrier && item.value?.carrier?.id === authStore.currentUser?.id;
  }
  return authStore.isShipper && item.value?.userId === authStore.currentUser?.id;
});

const alreadyEnrolled = computed(() => {
  if (dataType.value === 'avail') {
    return availStore.isEnrolled(id);
  }
  return false;
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé',
    pending: 'En attente',
    accepted: 'Accepté'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
    case 'accepted': return 'badge-success';
    case 'pending': return 'badge-info';
    case 'full': return 'badge-warning';
    default: return 'badge-neutral';
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateFull = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
