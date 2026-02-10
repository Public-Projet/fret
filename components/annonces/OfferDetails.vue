<template>
  <div class="space-y-8">
    <NuxtLink to="/annonces"
      class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
      <IconArrowLeft class="w-5 h-5 mr-2" />
      Retour au marché
    </NuxtLink>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
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
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
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
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">À propos de l'expéditeur</h3>
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl uppercase">
              {{ item.user?.firstName?.[0] || 'E' }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ isOwner ? 'Vous' : (item.user?.company || item.user?.firstName) }}
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <div class="flex mr-2">
                  <template v-for="i in 5" :key="i">
                    <IconStarFilled v-if="i <= Math.round(item.user?.rating || 0)" class="w-4 h-4 text-yellow-500" />
                    <IconStar v-else class="w-4 h-4 text-gray-200" />
                  </template>
                </div>
                <span class="font-bold">{{ item.user?.rating || '0.0' }}</span>
                <span class="ml-1">({{ item.user?.reviewCount || 0 }} avis)</span>
              </div>
            </div>
          </div>
          <div class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center">
              <IconShieldCheck class="w-4 h-4 text-green-500 mr-2" />
              Identité vérifiée
            </div>

            <!-- Rating Action -->
            <button v-if="canRate" @click="$emit('showRatingModal')" class="btn btn-secondary btn-sm w-full rounded-xl">
              {{ ratingLabel }}
            </button>
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
</template>

<script setup lang="ts">
import { IconArrowLeft, IconCalendar, IconMapPin, IconCube, IconScale, IconArrowsMaximize, IconCurrencyEuro, IconStarFilled, IconStar, IconShieldCheck } from '@tabler/icons-vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
  item: any;
  isOwner: boolean;
  canRate: boolean;
  ratingLabel: string;
}>();

defineEmits<{
  (e: 'showRatingModal'): void;
}>();

const authStore = useAuthStore();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

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
</script>
