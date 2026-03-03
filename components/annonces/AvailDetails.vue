<template>
  <div class="space-y-8">
    <NuxtLink to="/annonces"
      class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
      <IconArrowLeft class="w-5 h-5 mr-2" />
      Retour au marché
    </NuxtLink>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
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
                    {{ isOwner ? 'Vous' :
                      ((item.carrier?.firstname || item.carrier?.lastname) ? (item.carrier.firstname + ' ' +
                        item.carrier.lastname) : 'Transporteur') }}
                  </NuxtLink>
                </span>
                <div class="flex items-center text-yellow-500">
                  <template v-for="i in 5" :key="i">
                    <IconStarFilled v-if="i <= Math.round(item.carrier?.rating || 0)" class="w-4 h-4" />
                    <IconStar v-else class="w-4 h-4 text-gray-200" />
                  </template>
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

          <!-- Negotiations (Owner only) -->
          <div v-if="isOwner" class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <AnnoncesNegotiationList :items="item.bookings" type="avail" @refresh="$emit('refresh')" />
          </div>
        </div>
      </div>

      <!-- Sidebar for Availability -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
          <div v-if="isOwner" class="space-y-3">
            <p class="text-sm text-gray-500 italic">Vous êtes le propriétaire de cette disponibilité.</p>
          </div>
          <div v-else-if="authStore.isShipper" class="space-y-4">
            <button v-if="!alreadyEnrolled" @click="$emit('enroll')" class="btn btn-primary w-full py-4 rounded-2xl">
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

            <!-- Rating Action -->
            <button v-if="canRate" @click="$emit('showRatingModal')" class="btn btn-secondary btn-sm w-full rounded-xl">
              Noter ce transporteur
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
</template>

<script setup lang="ts">
import { IconArrowLeft, IconStarFilled, IconStar, IconTruck, IconCheck } from '@tabler/icons-vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
  item: any;
  isOwner: boolean;
  alreadyEnrolled: boolean;
  canRate: boolean;
}>();

defineEmits<{
  (e: 'enroll'): void;
  (e: 'showRatingModal'): void;
  (e: 'refresh'): void;
}>();

const authStore = useAuthStore();

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
</script>
